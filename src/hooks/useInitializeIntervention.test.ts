import type { Intervention } from '@planet-sdk/common';
import type { NextRouter } from 'next/router';

import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInterventionStore, useSingleProjectStore } from '../stores';
import {
  createMockRouter,
  createProject,
  createSite,
  createSiteWithoutGeometry,
  resetAllStores,
} from '../test-utils';
import { useInitializeIntervention } from './useInitializeIntervention';

vi.mock('next/router', () => ({ useRouter: vi.fn() }));
vi.mock('next-intl', () => ({ useLocale: () => 'en' }));

const SITES = [createSite('site_a'), createSite('site_b')];

const intervention = (hid: string) => ({ hid } as Intervention);

const createProjectFetchKey = (slug: string) => ({
  slug,
  locale: 'en',
  currency: 'EUR',
  tenant: 'ten_1',
});

/** Renders at a query, and returns the router and a function that moves the same hook to another query, like a client-side navigation. */
const renderAtQuery = (query: Record<string, string>) => {
  const router = createMockRouter({ query });
  vi.mocked(useRouter).mockReturnValue(router);
  const { rerender } = renderHook(() => useInitializeIntervention());
  const navigateTo = (nextQuery: Record<string, string>) => {
    vi.mocked(useRouter).mockReturnValue(
      createMockRouter({ query: nextQuery })
    );
    rerender();
  };
  return { router, navigateTo };
};

const selectedSite = () => useSingleProjectStore.getState().selectedSite;
const selectedIntervention = () =>
  useInterventionStore.getState().selectedIntervention;

const shownUrls = (router: NextRouter) =>
  vi.mocked(router.replace).mock.calls.map(([, shownUrl]) => shownUrl);

describe('useInitializeIntervention', () => {
  beforeEach(() => {
    resetAllStores();
    const project = createProject({ sites: SITES });
    useSingleProjectStore.setState({
      singleProject: project,
      lastFetch: createProjectFetchKey('yucatan'),
    });
    useInterventionStore.setState({
      interventions: [intervention('ploc_1'), intervention('ploc_2')],
      interventionsFinishedForProjectId: project.id,
    });
  });

  it('selects the intervention the URL names', () => {
    const { router } = renderAtQuery({ p: 'yucatan', ploc: 'ploc_2' });

    expect(selectedIntervention()?.hid).toBe('ploc_2');
    expect(selectedSite()).toBeNull();
    expect(shownUrls(router)).toEqual(['/en/yucatan?ploc=ploc_2']);
  });

  it('falls back to the first site when the URL names an unknown intervention', () => {
    const { router } = renderAtQuery({ p: 'yucatan', ploc: 'ploc_unknown' });

    expect(selectedIntervention()).toBeNull();
    expect(selectedSite()).toBe(0);
    expect(shownUrls(router)).toEqual(['/en/yucatan?site=site_a']);
  });

  it('falls back to the first site with a shape when the URL names an unknown intervention', () => {
    useSingleProjectStore.setState({
      singleProject: createProject({
        sites: [createSiteWithoutGeometry('site_a'), createSite('site_b')],
      }),
    });
    const { router } = renderAtQuery({ p: 'yucatan', ploc: 'ploc_unknown' });

    expect(selectedSite()).toBe(1);
    expect(shownUrls(router)).toEqual(['/en/yucatan?site=site_b']);
  });

  it('selects no site when the intervention is unknown and the project has no sites', () => {
    useSingleProjectStore.setState({ singleProject: createProject() });
    const { router } = renderAtQuery({ p: 'yucatan', ploc: 'ploc_unknown' });

    expect(selectedIntervention()).toBeNull();
    expect(selectedSite()).toBeNull();
    expect(shownUrls(router)).toEqual(['/en/yucatan']);
  });

  it('leaves the selection to the site when the URL names both a site and an intervention', () => {
    const { router } = renderAtQuery({
      p: 'yucatan',
      site: 'site_b',
      ploc: 'ploc_1',
    });

    expect(selectedIntervention()).toBeNull();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('selects the intervention only once the interventions load', () => {
    useInterventionStore.setState({
      interventions: null,
      interventionsFinishedForProjectId: null,
    });
    const { router } = renderAtQuery({ p: 'yucatan', ploc: 'ploc_1' });

    expect(router.replace).not.toHaveBeenCalled();

    act(() =>
      useInterventionStore.setState({
        interventions: [intervention('ploc_1')],
        interventionsFinishedForProjectId: createProject().id,
      })
    );

    expect(selectedIntervention()?.hid).toBe('ploc_1');
  });

  // See #3278. Each of these leaves no list to match the ploc against, and none will ever arrive.
  it.each([
    ['the fetch failed', { interventions: null, fetchError: true }],
    ['the fetch was skipped', { interventions: null, fetchError: false }],
    ['the project has no interventions', { interventions: [] }],
  ])('falls back to the first site when %s', (_, interventionState) => {
    useInterventionStore.setState(interventionState);
    const { router } = renderAtQuery({ p: 'yucatan', ploc: 'ploc_1' });

    expect(selectedIntervention()).toBeNull();
    expect(selectedSite()).toBe(0);
    expect(shownUrls(router)).toEqual(['/en/yucatan?site=site_a']);
  });

  it('falls back to the first site for a project that is not a tree project, without waiting for interventions', () => {
    useSingleProjectStore.setState({
      singleProject: createProject({ purpose: 'conservation', sites: SITES }),
    });
    useInterventionStore.setState({
      interventions: null,
      interventionsFinishedForProjectId: null,
    });
    const { router } = renderAtQuery({ p: 'yucatan', ploc: 'ploc_1' });

    expect(selectedSite()).toBe(0);
    expect(shownUrls(router)).toEqual(['/en/yucatan?site=site_a']);
  });

  it('waits while the interventions are still loading, then falls back if the fetch fails', () => {
    useInterventionStore.setState({
      interventions: null,
      interventionsFinishedForProjectId: null,
      isFetching: true,
    });
    const { router } = renderAtQuery({ p: 'yucatan', ploc: 'ploc_1' });

    expect(router.replace).not.toHaveBeenCalled();

    act(() =>
      useInterventionStore.setState({
        isFetching: false,
        fetchError: true,
        interventionsFinishedForProjectId: createProject().id,
      })
    );

    expect(selectedSite()).toBe(0);
    expect(shownUrls(router)).toEqual(['/en/yucatan?site=site_a']);
  });

  // The new project's ploc must not be matched against the interventions still held from the previous project.
  it("after moving to another project, selects the intervention only once that project's interventions load", () => {
    const { navigateTo } = renderAtQuery({ p: 'yucatan' });

    navigateTo({ p: 'koenigswald-ontananga', ploc: 'ploc_1' });

    expect(selectedIntervention()).toBeNull();

    // Same order as fetchProject: the new project lands first, while the old interventions are still held.
    act(() => {
      useSingleProjectStore.setState({
        singleProject: createProject({
          id: 'proj_koenigswald',
          slug: 'koenigswald-ontananga',
          sites: SITES,
        }),
        lastFetch: createProjectFetchKey('koenigswald-ontananga'),
      });
    });

    expect(selectedIntervention()).toBeNull();

    const newProjectIntervention = intervention('ploc_1');
    act(() => {
      useInterventionStore.setState({
        interventions: [newProjectIntervention],
        interventionsFinishedForProjectId: 'proj_koenigswald',
      });
    });

    expect(selectedIntervention()).toBe(newProjectIntervention);
  });

  it('clears the interventions when the URL no longer names a project', () => {
    const { navigateTo } = renderAtQuery({ p: 'yucatan', ploc: 'ploc_1' });

    navigateTo({});

    expect(selectedIntervention()).toBeNull();
    expect(useInterventionStore.getState().interventions).toBeNull();
  });
});

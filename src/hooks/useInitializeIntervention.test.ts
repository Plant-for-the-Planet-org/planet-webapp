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
  resetAllStores,
} from '../test-utils';
import { useInitializeIntervention } from './useInitializeIntervention';

vi.mock('next/router', () => ({ useRouter: vi.fn() }));
vi.mock('next-intl', () => ({ useLocale: () => 'en' }));

const SITES = [createSite('site_a'), createSite('site_b')];

const intervention = (hid: string) => ({ hid } as Intervention);

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
    useSingleProjectStore.setState({
      singleProject: createProject({ sites: SITES }),
    });
    useInterventionStore.setState({
      interventions: [intervention('ploc_1'), intervention('ploc_2')],
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
    useInterventionStore.setState({ interventions: null });
    const { router } = renderAtQuery({ p: 'yucatan', ploc: 'ploc_1' });

    expect(router.replace).not.toHaveBeenCalled();

    act(() =>
      useInterventionStore.setState({ interventions: [intervention('ploc_1')] })
    );

    expect(selectedIntervention()?.hid).toBe('ploc_1');
  });

  // The new project's ploc must not be matched against the interventions still held from the previous project.
  it("after moving to another project, selects the intervention only once that project's interventions load", () => {
    const { navigateTo } = renderAtQuery({ p: 'yucatan' });

    navigateTo({ p: 'koenigswald-ontananga', ploc: 'ploc_1' });

    expect(selectedIntervention()).toBeNull();

    const newProjectIntervention = intervention('ploc_1');
    act(() => {
      useSingleProjectStore.setState({
        singleProject: createProject({
          slug: 'koenigswald-ontananga',
          sites: SITES,
        }),
      });
      useInterventionStore.setState({
        interventions: [newProjectIntervention],
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

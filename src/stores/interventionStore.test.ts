import type { Intervention } from '@planet-sdk/common';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInterventionStore } from './interventionStore';
import { useSingleProjectStore } from './singleProjectStore';
import {
  createDeferred,
  createGetApi,
  createMockRouter,
  createProject,
  resetAllStores,
} from '../test-utils';

describe('interventionStore.selectInterventionSyncUrl', () => {
  beforeEach(() => {
    resetAllStores();
  });

  it('selects the intervention, clears the site, and swaps the site for the ploc in the URL, keeping other params', () => {
    useSingleProjectStore.setState({ selectedSite: 0 });
    const intervention = { hid: 'ploc_1' } as Intervention;
    const router = createMockRouter({
      query: {
        p: 'yucatan',
        site: 'site_a',
        embed: 'true',
        callback: 'https://example.org',
      },
    });

    useInterventionStore
      .getState()
      .selectInterventionSyncUrl(intervention, 'en', 'yucatan', router);

    expect(useInterventionStore.getState().selectedIntervention).toBe(
      intervention
    );
    expect(useSingleProjectStore.getState().selectedSite).toBeNull();
    expect(vi.mocked(router.replace).mock.calls[0][1]).toBe(
      '/en/yucatan?embed=true&callback=https%3A%2F%2Fexample.org&ploc=ploc_1'
    );
  });
});

describe('interventionStore.fetchInterventions', () => {
  const project = createProject();
  const getInterventions = () => useInterventionStore.getState();

  beforeEach(() => {
    resetAllStores();
    vi.stubEnv('TREEMAPPER_URL', 'https://treemapper.test');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    useSingleProjectStore.setState({ singleProject: project });
  });

  // A marker left from the last fetch would make a new fetch look finished before it is.
  it('clears the finished marker when a new fetch starts', () => {
    useInterventionStore.setState({
      interventionsFinishedForProjectId: project.id,
    });
    const getApi = createGetApi();
    getApi.mockReturnValue(createDeferred().promise);

    getInterventions().fetchInterventions(getApi, project.id);

    expect(getInterventions().interventionsFinishedForProjectId).toBeNull();
    expect(getInterventions().isFetching).toBe(true);
  });

  // A locale or currency change refetches the same project. The older request failing late must not mark it finished. See #3278.
  it('ignores an older request for the same project that fails after a newer one started', async () => {
    const older = createDeferred();
    const newer = createDeferred();
    const getApi = createGetApi();
    getApi
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise);

    const olderFetch = getInterventions().fetchInterventions(
      getApi,
      project.id
    );
    const newerFetch = getInterventions().fetchInterventions(
      getApi,
      project.id
    );

    older.reject(new Error('timeout'));
    await olderFetch;

    expect(getInterventions().fetchError).toBe(false);
    expect(getInterventions().interventionsFinishedForProjectId).toBeNull();

    const intervention = { hid: 'ploc_1' } as Intervention;
    newer.resolve({ data: [intervention] });
    await newerFetch;

    expect(getInterventions().interventions).toEqual([intervention]);
    expect(getInterventions().interventionsFinishedForProjectId).toBe(
      project.id
    );
  });
});

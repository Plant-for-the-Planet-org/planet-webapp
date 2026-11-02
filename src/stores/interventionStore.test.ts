import type { Intervention } from '@planet-sdk/common';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInterventionStore } from './interventionStore';
import { useSingleProjectStore } from './singleProjectStore';
import { createMockRouter, resetAllStores } from '../test-utils';

describe('interventionStore.selectInterventionSyncUrl', () => {
  beforeEach(() => {
    resetAllStores();
  });

  it('selects the intervention, clears the site, and shows only the ploc in the URL', () => {
    useSingleProjectStore.setState({ selectedSite: 0 });
    const intervention = { hid: 'ploc_1' } as Intervention;
    const router = createMockRouter({
      query: { p: 'yucatan', site: 'site_a' },
    });

    useInterventionStore
      .getState()
      .selectInterventionSyncUrl(intervention, 'en', 'yucatan', router);

    expect(useInterventionStore.getState().selectedIntervention).toBe(
      intervention
    );
    expect(useSingleProjectStore.getState().selectedSite).toBeNull();
    expect(vi.mocked(router.replace).mock.calls[0][1]).toBe(
      '/en/yucatan?ploc=ploc_1'
    );
  });
});

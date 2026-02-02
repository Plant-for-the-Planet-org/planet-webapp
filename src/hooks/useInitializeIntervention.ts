import type { Intervention } from '@planet-sdk/common';

import { useEffect } from 'react';
import {
  useInterventionStore,
  useSingleProjectStore,
  useViewStore,
} from '../stores';
import { useRouter } from 'next/router';
import { useLocale } from 'next-intl';
import { FIRST_SITE_INDEX, isString } from '../utils/projectV2';

const getInterventionByHid = (
  interventions: Intervention[] | null,
  hid: string | number
): Intervention | undefined => {
  return interventions?.find((intervention) => intervention.hid === hid);
};

export const useInitializeIntervention = () => {
  const locale = useLocale();
  const router = useRouter();
  const { site: requestedSite, ploc: requestedIntervention } = router.query;
  const hasRequestedBothTogether = Boolean(
    requestedSite && requestedIntervention
  );
  // store: state
  const currentPage = useViewStore((state) => state.page);
  const singleProject = useSingleProjectStore((state) => state.singleProject);
  const selectedIntervention = useInterventionStore(
    (state) => state.selectedIntervention
  );
  const selectedSite = useSingleProjectStore((state) => state.selectedSite);
  const interventions = useInterventionStore((state) => state.interventions);
  // store: action
  const clearInterventionStates = useInterventionStore(
    (state) => state.clearInterventionStates
  );
  const selectInterventionSyncUrl = useInterventionStore(
    (state) => state.selectInterventionSyncUrl
  );
  const selectSiteAndSyncUrl = useSingleProjectStore(
    (state) => state.selectSiteAndSyncUrl
  );
  const projectSlug = singleProject?.slug ?? '';
  const hasInterventions =
    interventions?.length !== undefined && interventions?.length > 0;

  useEffect(() => {
    if (!router.isReady) return;
    if (currentPage === 'project-list') return;
    if (!hasInterventions) return;
    if (selectedSite !== null) return;
    if (hasRequestedBothTogether) return;
    if (!isString(requestedIntervention)) return;
    if (selectedIntervention !== null) return;

    const intervention = getInterventionByHid(
      interventions,
      requestedIntervention
    );

    if (intervention) {
      selectInterventionSyncUrl(intervention, locale, projectSlug, router);
    } else {
      selectSiteAndSyncUrl(FIRST_SITE_INDEX, locale, router);
    }
  }, [
    router.isReady,
    currentPage,
    selectedIntervention,
    interventions,
    selectedSite,
  ]);

  useEffect(() => {
    if (currentPage === 'project-list') clearInterventionStates();
  }, [currentPage]);
};

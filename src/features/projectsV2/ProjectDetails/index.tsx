import type {
  SampleTreeRegistration,
  SingleTreeRegistration,
} from '@planet-sdk/common';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectSnippet from '../ProjectSnippet';
import ProjectInfo from './components/ProjectInfo';
import { useLocale } from 'next-intl';
import styles from './ProjectDetails.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MultiTreeInfo from './components/MultiTreeInfo';
import SingleTreeInfo from './components/SingleTreeInfo';
import { getActiveSingleTree } from '../../../utils/projectV2';
import ProjectDetailsMeta from '../../../utils/getMetaTags/ProjectDetailsMeta';
import OtherInterventionInfo from './components/OtherInterventionInfo';
import { isNonPlantationType } from '../../../utils/constants/intervention';
import { useApi } from '../../../hooks/useApi';
import { useTenant } from '../../common/Layout/TenantContext';
import { useCurrencyStore } from '../../../stores/currencyStore';
import { useInterventionStore, useSingleProjectStore } from '../../../stores';

const ProjectDetails = ({ isMobile }: { isMobile: boolean }) => {
  const locale = useLocale();
  const router = useRouter();
  const { getApi } = useApi();
  const { tenantConfig } = useTenant();
  const { p: projectSlug } = router.query;
  //local state
  const [hasVideoConsent, setHasVideoConsent] = useState(false);
  // store: state
  const currencyCode = useCurrencyStore((state) => state.currencyCode);
  const singleProject = useSingleProjectStore((state) => state.singleProject);
  const selectedSampleTree = useSingleProjectStore(
    (state) => state.selectedSampleTree
  );
  const hoveredIntervention = useInterventionStore(
    (state) => state.hoveredIntervention
  );
  const selectedIntervention = useInterventionStore(
    (state) => state.selectedIntervention
  );
  // store: action
  const fetchProjectData = useSingleProjectStore((state) => state.fetchProject);
  const setSelectedSampleTree = useSingleProjectStore(
    (state) => state.setSelectedSampleTree
  );

  useEffect(() => {
    if (typeof projectSlug === 'string' && currencyCode && router.isReady) {
      const config = {
        queryParams: {
          _scope: 'extended',
          currency: currencyCode,
          //passing locale/tenant as a query param to break cache when locale changes,
          //as the browser uses the cached response even though the x-locale header is different
          locale: locale,
          tenant: tenantConfig.id,
        },
      };
      fetchProjectData(getApi, config, projectSlug);
    }
  }, [router.isReady, projectSlug, locale, currencyCode, tenantConfig?.id]);

  useEffect(() => {
    setHasVideoConsent(false);
  }, [projectSlug]);

  const activeMultiTree = useMemo(() => {
    if (hoveredIntervention?.type === 'multi-tree-registration') {
      return hoveredIntervention;
    } else if (selectedIntervention?.type === 'multi-tree-registration') {
      return selectedIntervention;
    }
    return undefined;
  }, [hoveredIntervention, selectedIntervention]);

  const shouldShowOtherIntervention =
    isNonPlantationType(hoveredIntervention) ||
    isNonPlantationType(selectedIntervention);

  const shouldShowSingleTreeInfo =
    (hoveredIntervention?.type === 'single-tree-registration' ||
      selectedIntervention?.type === 'single-tree-registration' ||
      selectedSampleTree !== null) &&
    !isMobile;

  const shouldShowMultiTreeInfo =
    (hoveredIntervention?.type === 'multi-tree-registration' ||
      selectedIntervention?.type === 'multi-tree-registration') &&
    !isMobile &&
    !shouldShowSingleTreeInfo &&
    activeMultiTree !== undefined;

  const shouldShowProjectInfo =
    hoveredIntervention === null &&
    selectedIntervention === null &&
    selectedSampleTree === null;

  // clean up sample tree when intervention change
  useEffect(() => {
    if (selectedSampleTree !== null) setSelectedSampleTree(null);
  }, [selectedIntervention?.hid]);

  const activeSingleTree:
    | SingleTreeRegistration
    | SampleTreeRegistration
    | undefined = useMemo(
    () =>
      getActiveSingleTree(
        selectedIntervention,
        hoveredIntervention,
        selectedSampleTree
      ),
    [selectedIntervention, hoveredIntervention, selectedSampleTree]
  );

  if (singleProject === null) {
    return <Skeleton className={styles.projectDetailsSkeleton} />;
  }

  return (
    <>
      <ProjectDetailsMeta project={singleProject} />
      <div className={styles.projectDetailsContainer}>
        <ProjectSnippet
          project={singleProject}
          showTooltipPopups={true}
          isMobile={isMobile}
        />
        {shouldShowSingleTreeInfo && (
          <SingleTreeInfo
            activeSingleTree={activeSingleTree}
            isMobile={isMobile}
          />
        )}
        {shouldShowMultiTreeInfo && (
          <MultiTreeInfo
            activeMultiTree={activeMultiTree}
            isMobile={isMobile}
          />
        )}

        {shouldShowOtherIntervention && (
          <OtherInterventionInfo isMobile={isMobile} />
        )}

        {shouldShowProjectInfo && (
          <ProjectInfo
            isMobile={isMobile}
            hasVideoConsent={hasVideoConsent}
            onVideoConsentChange={setHasVideoConsent}
          />
        )}
      </div>
    </>
  );
};

export default ProjectDetails;

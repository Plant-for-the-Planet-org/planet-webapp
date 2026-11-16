import type {
  SampleTreeRegistration,
  SingleTreeRegistration,
} from '@planet-sdk/common';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectSnippet from '../ProjectSnippet';
import ProjectInfo from './components/ProjectInfo';
import styles from './ProjectDetails.module.scss';
import ProjectDetailsSkeleton from './ProjectDetailsSkeleton';
import MultiTreeInfo from './components/MultiTreeInfo';
import SingleTreeInfo from './components/SingleTreeInfo';
import { getActiveSingleTree } from '../../../utils/projectV2';
import ProjectDetailsMeta from '../../../utils/getMetaTags/ProjectDetailsMeta';
import OtherInterventionInfo from './components/OtherInterventionInfo';
import { isNonPlantationType } from '../../../utils/constants/intervention';
import { useInterventionStore, useSingleProjectStore } from '../../../stores';

const ProjectDetails = ({ isMobile }: { isMobile: boolean }) => {
  const router = useRouter();

  const { p: projectSlug } = router.query;
  // local state
  const [hasVideoConsent, setHasVideoConsent] = useState(false);
  // store: state
  const singleProject = useSingleProjectStore((state) => state.singleProject);
  const selectedSampleIntervention = useInterventionStore(
    (state) => state.selectedSampleIntervention
  );
  const hoveredIntervention = useInterventionStore(
    (state) => state.hoveredIntervention
  );
  const selectedIntervention = useInterventionStore(
    (state) => state.selectedIntervention
  );

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
      selectedSampleIntervention !== null) &&
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
    selectedSampleIntervention === null;

  const activeSingleTree:
    | SingleTreeRegistration
    | SampleTreeRegistration
    | undefined = useMemo(
    () =>
      getActiveSingleTree(
        selectedIntervention,
        hoveredIntervention,
        selectedSampleIntervention
      ),
    [selectedIntervention, hoveredIntervention, selectedSampleIntervention]
  );

  if (singleProject === null) {
    return <ProjectDetailsSkeleton isMobile={isMobile} />;
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

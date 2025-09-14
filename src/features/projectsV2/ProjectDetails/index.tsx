import type {
  APIError,
  Intervention,
  SampleTreeRegistration,
  SingleTreeRegistration,
} from '@planet-sdk/common';
import type { ExtendedProject } from '../../common/types/projectv2';

import { useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import ProjectSnippet from '../ProjectSnippet';
import { useProjects } from '../ProjectsContext';
import ProjectInfo from './components/ProjectInfo';
import { useLocale } from 'next-intl';
import { handleError, ClientError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import styles from './ProjectDetails.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MultiTreeInfo from './components/MultiTreeInfo';
import SingleTreeInfo from './components/SingleTreeInfo';
import { getActiveSingleTree } from '../../../utils/projectV2';
import ProjectDetailsMeta from '../../../utils/getMetaTags/ProjectDetailsMeta';
import OtherInterventionInfo from './components/OtherInterventionInfo';
import { isNonPlantationType } from '../../../utils/constants/intervention';
import { getProjectTimeTravelConfig } from '../../../utils/mapsV2/timeTravel';
import { useProjectsMap } from '../ProjectsMapContext';
import { useApi } from '../../../hooks/useApi';
import { useTenant } from '../../common/Layout/TenantContext';

const ProjectDetails = ({
  currencyCode,
  isMobile,
}: {
  currencyCode: string;
  isMobile: boolean;
}) => {
  const {
    singleProject,
    setSingleProject,
    setInterventions,
    setIsLoading,
    setIsError,
    setSelectedMode,
    selectedIntervention,
    hoveredIntervention,
    selectedSampleTree,
    setSelectedSampleTree,
    setPreventShallowPush,
  } = useProjects();
  const { setTimeTravelConfig } = useProjectsMap();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const locale = useLocale();
  const router = useRouter();
  const { getApi } = useApi();
  const { tenantConfig } = useTenant();
  const { p: projectSlug } = router.query;

  const fetchInterventions = async (projectId: string) => {
    setIsLoading(true);
    try {
      const result = await getApi<Intervention[]>(
        `/app/interventions/${projectId}`,
        {
          queryParams: {
            // Fetches sampleInterventions within each intervention
            _scope: 'extended',
          },
        }
      );
      setInterventions(result);
    } catch (err) {
      setErrors(handleError(err as APIError | ClientError));
      setIsError(true);
      redirect('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function loadProject(projectSlug: string, currency: string) {
      setIsLoading(true);
      setIsError(false);
      try {
        const fetchedProject = await getApi<ExtendedProject>(
          `/app/projects/${projectSlug}`,
          {
            queryParams: {
              _scope: 'extended',
              currency: currency,
              //passing locale/tenant as a query param to break cache when locale changes, as the browser uses the cached response even though the x-locale header is different
              locale: locale,
              tenant: tenantConfig.id,
            },
          }
        );
        const { purpose, id: projectId } = fetchedProject;
        if (projectId && purpose === 'trees') {
          fetchInterventions(projectId);
        }
        if (purpose === 'conservation' || purpose === 'trees') {
          setSingleProject(fetchedProject);
          const timeTravelConfig = await getProjectTimeTravelConfig(
            fetchedProject.id,
            fetchedProject.geoLocation
          );
          setTimeTravelConfig(timeTravelConfig);
        } else {
          throw new ClientError(404, {
            error_type: 'project_not_available',
            error_code: 'project_not_available',
          });
        }
      } catch (err) {
        setErrors(handleError(err as APIError | ClientError));
        setIsError(true);
        redirect('/');
      } finally {
        setIsLoading(false);
      }
    }

    if (typeof projectSlug === 'string' && currencyCode && router.isReady) {
      loadProject(projectSlug, currencyCode);
    }
  }, [projectSlug, locale, currencyCode, tenantConfig?.id, router.isReady]);

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

  const baseInterventionInfoProps = {
    isMobile,
    setSelectedSampleTree,
  };

  return singleProject ? (
    <>
      <ProjectDetailsMeta project={singleProject} />
      <div className={styles.projectDetailsContainer}>
        <ProjectSnippet
          project={singleProject}
          showTooltipPopups={true}
          isMobile={isMobile}
          page="project-details"
          setPreventShallowPush={setPreventShallowPush}
        />
        {shouldShowSingleTreeInfo && (
          <SingleTreeInfo
            activeSingleTree={activeSingleTree}
            {...baseInterventionInfoProps}
          />
        )}
        {shouldShowMultiTreeInfo && (
          <MultiTreeInfo
            activeMultiTree={activeMultiTree}
            {...baseInterventionInfoProps}
          />
        )}

        {shouldShowOtherIntervention ? (
          <OtherInterventionInfo
            selectedIntervention={
              selectedIntervention?.type !== 'single-tree-registration' &&
              selectedIntervention?.type !== 'multi-tree-registration'
                ? selectedIntervention
                : null
            }
            hoveredIntervention={
              hoveredIntervention?.type !== 'single-tree-registration' &&
              hoveredIntervention?.type !== 'multi-tree-registration'
                ? hoveredIntervention
                : null
            }
            {...baseInterventionInfoProps}
          />
        ) : null}

        {shouldShowProjectInfo && (
          <ProjectInfo
            project={singleProject}
            isMobile={isMobile}
            setSelectedMode={setSelectedMode}
          />
        )}
      </div>
    </>
  ) : (
    <Skeleton className={styles.projectDetailsSkeleton} />
  );
};

export default ProjectDetails;

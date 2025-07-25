import type { APIError } from '@planet-sdk/common';
import type {
  Intervention,
  InterventionSingle,
  SampleIntervention,
} from '../../common/types/intervention';
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
import MultiInterventionInfo from './components/MultiInterventionInfo';
import SingleInterventionInfo from './components/SingleInterventionInfo';
import { getPlantData } from '../../../utils/projectV2';
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
    selectedSampleIntervention,
    setSelectedSampleIntervention,
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
        `/app/plantLocations/${projectId}`,
        { queryParams: { _scope: 'extended' } }
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

  const shouldShowMultiInterventionInfo =
    (hoveredIntervention?.type === 'multi-tree-registration' ||
      selectedIntervention?.type === 'multi-tree-registration') &&
    !isMobile;

  const shouldShowOtherIntervention =
    isNonPlantationType(hoveredIntervention) ||
    isNonPlantationType(selectedIntervention);

  const shouldShowSingleInterventionInfo =
    (hoveredIntervention?.type === 'single-tree-registration' ||
      selectedIntervention?.type === 'single-tree-registration' ||
      selectedSampleIntervention !== null) &&
    !isMobile;

  const shouldShowProjectInfo =
    hoveredIntervention === null &&
    selectedIntervention === null &&
    selectedSampleIntervention === null;

  // clean up sample plant location when plant location change
  useEffect(() => {
    if (selectedSampleIntervention !== null)
      setSelectedSampleIntervention(null);
  }, [selectedIntervention?.hid]);

  const plantData: InterventionSingle | SampleIntervention | undefined =
    useMemo(
      () =>
        getPlantData(
          selectedIntervention,
          hoveredIntervention,
          selectedSampleIntervention
        ),
      [selectedIntervention, hoveredIntervention, selectedSampleIntervention]
    );

  const multiIntervention = useMemo(() => {
    if (hoveredIntervention?.type === 'multi-tree-registration') {
      return hoveredIntervention;
    } else if (selectedIntervention?.type === 'multi-tree-registration') {
      return selectedIntervention;
    }
    return undefined;
  }, [hoveredIntervention, selectedIntervention]);

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
        {shouldShowSingleInterventionInfo && (
          <SingleInterventionInfo
            plantData={plantData}
            isMobile={isMobile}
            setSelectedSampleIntervention={setSelectedSampleIntervention}
          />
        )}
        {shouldShowMultiInterventionInfo &&
          !shouldShowSingleInterventionInfo &&
          multiIntervention !== undefined && (
            <MultiInterventionInfo
              interventionInfo={multiIntervention}
              setSelectedSampleIntervention={setSelectedSampleIntervention}
              isMobile={isMobile}
            />
          )}

        {shouldShowOtherIntervention ? (
          <OtherInterventionInfo
            selectedIntervention={
              selectedIntervention &&
              selectedIntervention?.type !== 'single-tree-registration' &&
              selectedIntervention?.type !== 'multi-tree-registration'
                ? selectedIntervention
                : null
            }
            hoveredIntervention={
              hoveredIntervention &&
              hoveredIntervention?.type !== 'single-tree-registration' &&
              hoveredIntervention?.type !== 'multi-tree-registration'
                ? hoveredIntervention
                : null
            }
            setSelectedSampleIntervention={setSelectedSampleIntervention}
            isMobile={isMobile}
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

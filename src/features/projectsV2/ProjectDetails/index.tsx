import type { APIError } from '@planet-sdk/common';
import type {
  PlantLocation,
  PlantLocationSingle,
  SamplePlantLocation,
} from '../../common/types/plantLocation';
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
import MultiPlantLocationInfo from './components/MultiPlantLocationInfo';
import SinglePlantLocationInfo from './components/SinglePlantLocationInfo';
import { getPlantData } from '../../../utils/projectV2';
import ProjectDetailsMeta from '../../../utils/getMetaTags/ProjectDetailsMeta';
import OtherInterventionInfo from './components/OtherInterventionInfo';
import { isNonPlantationType } from '../../../utils/constants/intervention';
import { getProjectTimeTravelConfig } from '../../../utils/mapsV2/timeTravel';
import { useProjectsMap } from '../ProjectsMapContext';
import { useServerApi } from '../../../hooks/useServerApi';

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
    setPlantLocations,
    setIsLoading,
    setIsError,
    setSelectedMode,
    selectedPlantLocation,
    hoveredPlantLocation,
    selectedSamplePlantLocation,
    setSelectedSamplePlantLocation,
    setPreventShallowPush,
  } = useProjects();
  const { setTimeTravelConfig } = useProjectsMap();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const locale = useLocale();
  const router = useRouter();
  const { getApi } = useServerApi();
  const { p: projectSlug } = router.query;

  const fetchPlantLocations = async (projectId: string) => {
    setIsLoading(true);
    try {
      const result = await getApi<PlantLocation[]>(
        `/app/plantLocations/${projectId}`,
        { _scope: 'extended' }
      );
      setPlantLocations(result);
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
        const fetchedProject = await getApi<
          ExtendedProject,
          Record<string, string>
        >(`/app/projects/${projectSlug}`, {
          _scope: 'extended',
          currency: currency,
        });
        const { purpose, id: projectId } = fetchedProject;
        if (projectId && purpose === 'trees') {
          fetchPlantLocations(projectId);
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
  }, [projectSlug, locale, currencyCode, router.isReady]);

  const shouldShowPlantLocationInfo =
    (hoveredPlantLocation?.type === 'multi-tree-registration' ||
      selectedPlantLocation?.type === 'multi-tree-registration') &&
    !isMobile;

  const shouldShowOtherIntervention =
    isNonPlantationType(hoveredPlantLocation) ||
    isNonPlantationType(selectedPlantLocation);

  const shouldShowSinglePlantInfo =
    (hoveredPlantLocation?.type === 'single-tree-registration' ||
      selectedPlantLocation?.type === 'single-tree-registration' ||
      selectedSamplePlantLocation !== null) &&
    !isMobile;

  const shouldShowProjectInfo =
    hoveredPlantLocation === null &&
    selectedPlantLocation === null &&
    selectedSamplePlantLocation === null;

  // clean up sample plant location when plant location change
  useEffect(() => {
    if (selectedSamplePlantLocation !== null)
      setSelectedSamplePlantLocation(null);
  }, [selectedPlantLocation?.hid]);

  const plantData: PlantLocationSingle | SamplePlantLocation | undefined =
    useMemo(
      () =>
        getPlantData(
          selectedPlantLocation,
          hoveredPlantLocation,
          selectedSamplePlantLocation
        ),
      [selectedPlantLocation, hoveredPlantLocation, selectedSamplePlantLocation]
    );

  return singleProject ? (
    <>
      <ProjectDetailsMeta project={singleProject} />
      <div className={styles.projectDetailsContainer}>
        <ProjectSnippet
          project={singleProject}
          showTooltipPopups={false}
          isMobile={isMobile}
          page="project-details"
          setPreventShallowPush={setPreventShallowPush}
        />
        {shouldShowSinglePlantInfo && (
          <SinglePlantLocationInfo
            plantData={plantData}
            isMobile={isMobile}
            setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
          />
        )}
        {shouldShowPlantLocationInfo && !shouldShowSinglePlantInfo && (
          <MultiPlantLocationInfo
            plantLocationInfo={
              hoveredPlantLocation?.type === 'multi-tree-registration'
                ? hoveredPlantLocation
                : selectedPlantLocation?.type === 'multi-tree-registration'
                ? selectedPlantLocation
                : undefined
            }
            setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
            isMobile={isMobile}
          />
        )}

        {shouldShowOtherIntervention ? (
          <OtherInterventionInfo
            selectedPlantLocation={
              selectedPlantLocation &&
              selectedPlantLocation?.type !== 'single-tree-registration' &&
              selectedPlantLocation?.type !== 'multi-tree-registration'
                ? selectedPlantLocation
                : null
            }
            hoveredPlantLocation={
              hoveredPlantLocation &&
              hoveredPlantLocation?.type !== 'single-tree-registration' &&
              hoveredPlantLocation?.type !== 'multi-tree-registration'
                ? hoveredPlantLocation
                : null
            }
            setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
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

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
import { getRequest } from '../../../utils/apiRequests/api';
import { useTenant } from '../../common/Layout/TenantContext';
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
    plantLocations,
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
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const router = useRouter();
  const { p: projectSlug } = router.query;

  useEffect(() => {
    async function loadProject(
      projectSlug: string,
      locale: string,
      currency: string
    ) {
      setIsLoading(true);
      setIsError(false);
      try {
        const fetchedProject = await getRequest<ExtendedProject>(
          tenantConfig.id,
          `/app/projects/${projectSlug}`,
          {
            _scope: 'extended',
            currency: currency,
            locale: locale,
          }
        );
        const { purpose } = fetchedProject;
        if (purpose === 'conservation' || purpose === 'trees') {
          setSingleProject(fetchedProject);
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

    if (typeof projectSlug === 'string' && currencyCode)
      loadProject(projectSlug, locale, currencyCode);
  }, [projectSlug, locale, currencyCode]);

  useEffect(() => {
    async function loadPlantLocations() {
      setIsLoading(true);
      try {
        const result = await getRequest<PlantLocation[]>(
          tenantConfig.id,
          `/app/plantLocations/${singleProject?.id}`,
          {
            _scope: 'extended',
          },
          '1.0.4'
        );
        setPlantLocations(result);
      } catch (err) {
        setErrors(handleError(err as APIError | ClientError));
        setIsError(true);
        redirect('/');
      } finally {
        setIsLoading(false);
      }
    }

    if (
      singleProject &&
      singleProject?.purpose === 'trees' &&
      plantLocations === null
    )
      loadPlantLocations();
  }, [singleProject]);

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
            selectedPlantLocation={selectedPlantLocation && selectedPlantLocation?.type !== 'single-tree-registration' &&
              selectedPlantLocation?.type !== 'multi-tree-registration' ? selectedPlantLocation : null}
            hoveredPlantLocation={hoveredPlantLocation && hoveredPlantLocation?.type !== 'single-tree-registration' &&
              hoveredPlantLocation?.type !== 'multi-tree-registration' ? hoveredPlantLocation : null}
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

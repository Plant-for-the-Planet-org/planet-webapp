import { useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import ProjectSnippet from '../ProjectSnippet';
import { useProjects } from '../ProjectsContext';
import ProjectInfo from './components/ProjectInfo';
import { getRequest } from '../../../utils/apiRequests/api';
import { useTenant } from '../../common/Layout/TenantContext';
import { useLocale } from 'next-intl';
import { handleError, APIError, ClientError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import styles from './ProjectDetails.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PlantLocation } from '../../common/types/plantLocation';
import PlantLocationInfo from './components/PlantLocationInfo';
import { ExtendedProject } from '../../common/types/projectv2';
import SinglePlantInfo from './components/SinglePlantInfo';

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
    if (singleProject && singleProject?.purpose === 'trees')
      loadPlantLocations();
  }, [singleProject]);

  const shouldShowPlantLocationInfo =
    hoveredPlantLocation?.type === 'multi-tree-registration' ||
    selectedPlantLocation?.type === 'multi-tree-registration';
  !isMobile;
  const shouldShowSinglePlantInfo =
    (hoveredPlantLocation?.type === 'single-tree-registration' ||
      selectedPlantLocation?.type === 'single-tree-registration' ||
      selectedSamplePlantLocation) &&
    !isMobile;
  const shouldShowProjectInfo =
    !hoveredPlantLocation &&
    !selectedPlantLocation &&
    !selectedSamplePlantLocation;

  // clean up sample plant location when plant location change
  useEffect(() => {
    if (selectedSamplePlantLocation) {
      return setSelectedSamplePlantLocation(null);
    }
  }, [selectedPlantLocation?.hid]);

  const plantData = useMemo(() => {
    if (
      selectedPlantLocation?.type === 'single-tree-registration' ||
      hoveredPlantLocation?.type === 'single-tree-registration'
    )
      return hoveredPlantLocation
        ? hoveredPlantLocation
        : selectedPlantLocation;

    return selectedSamplePlantLocation;
  }, [
    selectedPlantLocation,
    hoveredPlantLocation,
    selectedSamplePlantLocation,
  ]);

  const singlePlantInfoProps = {
    plantData,
    setSelectedSamplePlantLocation,
  };

  const plantLocationInfoProps = {
    plantLocationInfo: hoveredPlantLocation
      ? hoveredPlantLocation
      : selectedPlantLocation,
    setSelectedSamplePlantLocation,
    isMobile,
  };

  const projectInfoProps = {
    project: singleProject,
    isMobile,
    setSelectedMode,
  };
  return singleProject ? (
    <div className={styles.projectDetailsContainer}>
      <ProjectSnippet
        project={singleProject}
        showTooltipPopups={false}
        isMobile={isMobile}
        page="project-details"
      />
      {shouldShowSinglePlantInfo && (
        <SinglePlantInfo {...singlePlantInfoProps} />
      )}
      {shouldShowPlantLocationInfo && !shouldShowSinglePlantInfo && (
        <PlantLocationInfo {...plantLocationInfoProps} />
      )}
      {shouldShowProjectInfo && <ProjectInfo {...projectInfoProps} />}
    </div>
  ) : (
    <Skeleton className={styles.projectDetailsSkeleton} />
  );
};

export default ProjectDetails;

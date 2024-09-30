import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectSnippet from '../ProjectSnippet';
import { useProjects } from '../ProjectsContext';
import ProjectInfoSection from './components/ProjectInfoSection';
import { getRequest } from '../../../utils/apiRequests/api';
import { useTenant } from '../../common/Layout/TenantContext';
import { useLocale } from 'next-intl';
import { handleError, APIError, ClientError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import styles from './ProjectDetails.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PlantLocation } from '../../common/types/plantLocation';
import PlantLocationInfoSection from './components/PlantLocationInfoSection';
import { ExtendedProject } from '../../common/types/projectv2';
import { updateUrlWithParams } from '../../../utils/projectV2';

const ProjectDetails = ({
  currencyCode,
  isMobile,
}: {
  currencyCode: string;
  isMobile: boolean;
}) => {
  const {
    singleProject,
    selectedSite,
    setSingleProject,
    setPlantLocations,
    setIsLoading,
    setIsError,
    setSelectedMode,
    selectedPlantLocation,
    hoveredPlantLocation,
  } = useProjects();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const router = useRouter();
  const {
    p: projectSlug,
    ploc: requestedPlantLocation,
    site: requestedSite,
  } = router.query;

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
  // add  project site query
  useEffect(() => {
    const projectSites = singleProject?.sites;
    if (!projectSites || !projectSites[selectedSite]) {
      return;
    }
    if (!router.isReady) return;

    const pushWithShallow = (pathname: string, queryParams = {}) => {
      router.push({ pathname, query: queryParams }, undefined, {
        shallow: true,
      });
    };

    // Case 1: If visit using direct link using wrong ploc),
    // Case 1.1: If the "ploc" and "site" query param exists then set site param,
    // Update url with the default site  param
    if (
      (requestedPlantLocation && !selectedPlantLocation && !requestedSite) ||
      (requestedPlantLocation && requestedSite)
    ) {
      const siteId =
        projectSites[requestedPlantLocation && requestedSite ? 0 : selectedSite]
          .properties.id;
      const pathname = `/${locale}/prd/${singleProject.slug}`;
      const updatedQueryParams = { site: siteId };
      pushWithShallow(pathname, updatedQueryParams);
      return;
    }

    // Case 2: no "ploc" query or plant location is selected (default route),
    // Update url with the selected site  param
    if (!requestedPlantLocation && !selectedPlantLocation) {
      const pathname = `/${locale}/prd/${singleProject.slug}`;
      const siteId = projectSites[selectedSite].properties.id;
      const updatedQueryParams = updateUrlWithParams(
        router.asPath,
        router.query,
        siteId
      );
      pushWithShallow(pathname, updatedQueryParams);
      return;
    }

    // Case 3: If a plant location (selectedPlantLocation) is selected,
    // Update url with the selected plant location  param
    if (selectedPlantLocation) {
      const pathname = `/${locale}/prd/${singleProject.slug}`;
      const updatedQueryParams = { ploc: selectedPlantLocation.hid };
      pushWithShallow(pathname, updatedQueryParams);
    }
  }, [
    singleProject,
    selectedSite,
    selectedPlantLocation,
    locale,
    requestedSite,
    requestedPlantLocation,
    router.isReady,
  ]);

  return singleProject ? (
    <div className={styles.projectDetailsContainer}>
      <ProjectSnippet
        project={singleProject}
        showTooltipPopups={false}
        isMobile={isMobile}
        page="project-details"
      />
      {selectedPlantLocation || hoveredPlantLocation ? (
        <PlantLocationInfoSection
          plantLocationInfo={
            hoveredPlantLocation ? hoveredPlantLocation : selectedPlantLocation
          }
        />
      ) : (
        <ProjectInfoSection
          project={singleProject}
          isMobile={isMobile}
          setSelectedMode={setSelectedMode}
        />
      )}
    </div>
  ) : (
    <Skeleton className={styles.projectDetailsSkeleton} />
  );
};

export default ProjectDetails;

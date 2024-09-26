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
    selectedPl,
    hoveredPl,
    samplePlantLocation,
    setSamplePlantLocation,
  } = useProjects();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const router = useRouter();
  const { query, asPath, isReady } = router;
  const projectSlug = query.p;

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

    if (!isReady) return;
    const pushWithShallow = (pathname: string, queryParams = {}) => {
      router.push({ pathname, query: queryParams }, undefined, {
        shallow: true,
      });
    };

    // Case 1: If visit using direct link using wrong ploc),
    // Case 1.1: If the "ploc" and "site" query param exists then set site param,
    // Update url with the default site  param
    if (
      (query.ploc && !selectedPl && !query.site) ||
      (query.ploc && query.site)
    ) {
      const siteId =
        projectSites[query.ploc && query.site ? 0 : selectedSite].properties.id;
      const pathname = `/${locale}/prd/${singleProject.slug}`;
      const updatedQueryParams = { site: siteId };
      pushWithShallow(pathname, updatedQueryParams);
      return;
    }

    // Case 2: no "ploc" query or plant location is selected (default route),
    // Update url with the selected site  param
    if (!query.ploc && !selectedPl) {
      const pathname = `/${locale}/prd/${singleProject.slug}`;
      const siteId = projectSites[selectedSite].properties.id;
      const updatedQueryParams = updateUrlWithParams(asPath, query, siteId);
      pushWithShallow(pathname, updatedQueryParams);
      return;
    }

    // Case 3: If a plant location (selectedPl) is selected,
    // Update url with the selected plant location  param
    if (selectedPl) {
      const pathname = `/${locale}/prd/${singleProject.slug}`;
      const updatedQueryParams = { ploc: selectedPl.hid };
      pushWithShallow(pathname, updatedQueryParams);
    }
  }, [
    singleProject,
    selectedSite,
    selectedPl,
    locale,
    query.site,
    query.ploc,
    isReady,
  ]);

  const getplantInfoToRender = useMemo(() => {
    if (hoveredPl?.hid === selectedPl?.hid && samplePlantLocation)
      return samplePlantLocation;
    if (hoveredPl) {
      return hoveredPl;
    } else if (samplePlantLocation) {
      return samplePlantLocation;
    } else {
      return selectedPl;
    }
  }, [samplePlantLocation, hoveredPl, selectedPl]);

  // clean up sample plant location state whenever parent plant location change
  useEffect(() => {
    if (samplePlantLocation) return setSamplePlantLocation(null);
  }, [selectedPl?.hid]);

  return singleProject ? (
    <div className={styles.projectDetailsContainer}>
      <ProjectSnippet
        project={singleProject}
        showTooltipPopups={false}
        isMobile={isMobile}
        page="project-details"
      />
      {selectedPl || hoveredPl || samplePlantLocation ? (
        <PlantLocationInfo plantLocationInfo={getplantInfoToRender} />
      ) : (
        <ProjectInfo
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

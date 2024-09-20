import { useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import ProjectSnippet from '../ProjectSnippet';
import { ProjectExtend, useProjects } from '../ProjectsContext';
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

const ProjectDetails = ({
  currencyCode,
  isMobile,
}: {
  currencyCode: string;
  isMobile: boolean;
}) => {
  const {
    singleProject,
    setSelectedSite,
    setSingleProject,
    setPlantLocations,
    setIsLoading,
    setIsError,
    setSelectedMode,
    setSelectedClassification,
    setDebouncedSearchValue,
    selectedSite,
    selectedPl,
    hoveredPl,
    samplePlantLocation,
    setSamplePlantLocation,
  } = useProjects();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    setSelectedSite(0); // default site value, will be removed in future
    if (setSelectedMode) setSelectedMode('list');
    setSelectedClassification([]);
    setDebouncedSearchValue('');
  }, []);

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      setIsError(false);
      try {
        const { p } = router.query;
        const fetchedProject = await getRequest<ProjectExtend>(
          tenantConfig.id,
          `/app/projects/${p}`,
          {
            _scope: 'extended',
            currency: currencyCode,
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

    if (router.query.p && currencyCode) loadProject();
  }, [router.query.p, locale, currencyCode]);

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
    if (!projectSites || !(projectSites && projectSites[selectedSite])) {
      return;
    }
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;
    searchParams.set('site', projectSites[selectedSite].properties.id);
    const newSearch = searchParams.toString();
    const newPath = `/${locale}/prd/${singleProject.slug}${
      newSearch.length > 0 ? `?${newSearch}` : ''
    }`;
    router.push(newPath);
  }, [singleProject?.slug, selectedSite, locale]);

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
        showBackButton={true}
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
    <Skeleton className={styles.projectInfoSkeleton} />
  );
};

export default ProjectDetails;

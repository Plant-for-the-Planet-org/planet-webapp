import Skeleton from 'react-loading-skeleton';
import { useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './ProjectsSection.module.scss';
import { useProjects } from './ProjectsContext';
import ProjectListControls, { type ProjectTabs } from './ProjectListControls';
import ProjectListControlForMobile from './ProjectListControls/ProjectListControlForMobile';
import ProjectList from './ProjectList';
import { useProjectsMap } from './ProjectsMapContext';
import ProjectsListMeta from '../../utils/getMetaTags/ProjectsListMeta';
import { useTenant } from '../common/Layout/TenantContext';

interface ProjectsSectionProps {
  isMobile: boolean;
}

const ProjectsSection = ({ isMobile }: ProjectsSectionProps) => {
  const {
    projects,
    topProjects,
    selectedClassification,
    setSelectedClassification,
    filteredProjects,
    debouncedSearchValue,
    setDebouncedSearchValue,
    isSearching,
    setIsSearching,
    isLoading,
    isError,
    setSelectedMode,
    selectedMode,
    showDonatableProjects,
    setShowDonatableProjects,
  } = useProjects();
  const { mapOptions, updateMapOption } = useProjectsMap();
  const { tenantConfig } = useTenant();

  const [tabSelected, setTabSelected] = useState<ProjectTabs>('topProjects');

  useEffect(() => {
    if (
      (selectedClassification.length > 0 || showDonatableProjects) &&
      tabSelected === 'topProjects'
    ) {
      setTabSelected('allProjects');
    }
  }, [selectedClassification, showDonatableProjects]);

  useEffect(() => {
    // When tenantConfig.topProjectsOnly is true, it indicates all projects returned by the projects endpoint are to be shown, without splitting them into top projects and all projects
    if (tenantConfig.topProjectsOnly === true) {
      setTabSelected('allProjects');
    }
  }, [tenantConfig.topProjectsOnly]);

  const shouldHideProjectTabs = tenantConfig.topProjectsOnly === true;

  if (
    (isLoading || isError || projects === null) &&
    filteredProjects?.length === 0
  ) {
    return <Skeleton className={styles.projectSectionSkeleton} />;
  }
  const projectCount = projects?.length;
  const topProjectCount = topProjects?.length;

  const projectListControlCommonProps = {
    projectCount,
    topProjectCount,
    tabSelected,
    setTabSelected,
    selectedClassification,
    setSelectedClassification,
    showDonatableProjects,
    setShowDonatableProjects,
    debouncedSearchValue,
    setDebouncedSearchValue,
    filteredProjects,
    shouldHideProjectTabs,
  };
  const projectListControlMobileProps = {
    debouncedSearchValue,
    setSelectedMode,
    selectedMode,
    isMobile,
    isSearching,
    setIsSearching,
    mapOptions,
    updateMapOption,
  };

  return (
    <>
      <ProjectsListMeta />
      {isMobile ? (
        <ProjectListControlForMobile
          {...projectListControlCommonProps}
          {...projectListControlMobileProps}
        />
      ) : (
        <ProjectListControls {...projectListControlCommonProps} />
      )}
      <ProjectList tabSelected={tabSelected} />
    </>
  );
};

export default ProjectsSection;

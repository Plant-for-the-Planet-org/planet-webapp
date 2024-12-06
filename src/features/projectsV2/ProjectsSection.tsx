import Skeleton from 'react-loading-skeleton';
import { useState } from 'react';
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
  } = useProjects();
  const { mapOptions, updateMapOption } = useProjectsMap();
  const [tabSelected, setTabSelected] = useState<ProjectTabs>('topProjects');
  const { tenantConfig } = useTenant();
  const isSalesforceTenant = tenantConfig.config.slug === 'salesforce';
  if ((isLoading || isError) && filteredProjects?.length === 0) {
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
    debouncedSearchValue,
    setDebouncedSearchValue,
    filteredProjects,
    isSalesforceTenant,
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

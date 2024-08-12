import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './ProjectsSection.module.scss';
import { useProjects } from './ProjectsContext';
import ProjectListControls from './ProjectListControls';
import ProjectListControlForMobile from './ProjectListControls/ProjectListControlForMobile';
import { SetState } from '../common/types/common';
import ProjectList from './ProjectList';
import { useState } from 'react';
import { MapProject } from '../common/types/projectv2';
import { ViewMode } from '../../../pages/_app';

interface ProjectsSectionProps {
  selectedMode: ViewMode;
  setSelectedMode: SetState<ViewMode>;
  isMobile: boolean;
}

const ProjectsSection = ({
  selectedMode,
  setSelectedMode,
  isMobile,
}: ProjectsSectionProps) => {
  const {
    projects,
    selectedClassification,
    setSelectedClassification,
    searchProjectResults,
    setTabSelected,
    topProjects,
    setDebouncedSearchValue,
    isLoading,
    isError,
    tabSelected,
    filteredProjects,
  } = useProjects();
  const [resultantProjectCount, setResultantProjectCount] = useState(0);
  if (isLoading || isError) {
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
    setDebouncedSearchValue,
    searchProjectResults,
    filteredProjects,
    resultantProjectCount,
  };
  const projectListControlMobileProps = {
    setSelectedMode,
    selectedMode,
    isMobile,
  };
  const handleResultantProjectCount = (projectList: MapProject[] | null) => {
    if (projectList && projectList?.length > 0)
      setResultantProjectCount(projectList?.length);
  };

  return (
    <>
      {isMobile ? (
        <ProjectListControlForMobile
          {...projectListControlCommonProps}
          {...projectListControlMobileProps}
        />
      ) : (
        <ProjectListControls {...projectListControlCommonProps} />
      )}
      <ProjectList
        selectedMode={selectedMode}
        handleResultantProjectCount={handleResultantProjectCount}
      />
    </>
  );
};

export default ProjectsSection;

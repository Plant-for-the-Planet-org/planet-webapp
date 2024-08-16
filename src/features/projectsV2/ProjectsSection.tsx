import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './ProjectsSection.module.scss';
import { useProjects } from './ProjectsContext';
import ProjectListControls from './ProjectListControls';
import ProjectListControlForMobile from './ProjectListControls/ProjectListControlForMobile';
import { SetState } from '../common/types/common';
import ProjectList from './ProjectList';
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
    topProjects,
    selectedClassification,
    setSelectedClassification,
    filteredProjects,
    tabSelected,
    setTabSelected,
    debouncedSearchValue,
    setDebouncedSearchValue,
    isSearching,
    setIsSearching,
    isLoading,
    isError,
  } = useProjects();

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
    setDebouncedSearchValue,
    filteredProjects,
  };
  const projectListControlMobileProps = {
    debouncedSearchValue,
    setSelectedMode,
    selectedMode,
    isMobile,
    isSearching,
    setIsSearching,
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
      <ProjectList />
    </>
  );
};

export default ProjectsSection;

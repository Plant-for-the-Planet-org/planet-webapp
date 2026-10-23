import Skeleton from 'react-loading-skeleton';
import { useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './ProjectsSection.module.scss';
import ProjectListControls, { type ProjectTabs } from './ProjectListControls';
import ProjectListControlForMobile from './ProjectListControls/ProjectListControlForMobile';
import ProjectList from './ProjectList';
import ProjectsListMeta from '../../utils/getMetaTags/ProjectsListMeta';
import {
  useProjectMapStore,
  useProjectStore,
  useTenantStore,
} from '../../stores';
import { useFilteredProjects } from '../../hooks/useFilteredProjects';

interface ProjectsSectionProps {
  isMobile: boolean;
}

const ProjectsSection = ({ isMobile }: ProjectsSectionProps) => {
  const { filteredProjectCount } = useFilteredProjects();

  // local state
  const [tabSelected, setTabSelected] = useState<ProjectTabs>('topProjects');
  // store: state
  const mapOptions = useProjectMapStore((state) => state.mapOptions);
  const showDonatableProjects = useProjectStore(
    (state) => state.showDonatableProjects
  );
  const isProjectsFetching = useProjectStore(
    (state) => state.isProjectsFetching
  );
  const isProjectsError = useProjectStore((state) => state.isProjectsError);
  const hasLoadedProjects = useProjectStore((state) => state.projects !== null);
  const isClassificationSelected = useProjectStore(
    (state) => state.selectedClassification.length > 0
  );
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  // store: action
  const updateMapOption = useProjectMapStore((state) => state.updateMapOption);

  const hasFilteredProjects = filteredProjectCount > 0;

  useEffect(() => {
    if (
      (isClassificationSelected || showDonatableProjects) &&
      tabSelected === 'topProjects'
    ) {
      setTabSelected('allProjects');
    }
  }, [isClassificationSelected, showDonatableProjects]);

  useEffect(() => {
    // When tenantConfig.topProjectsOnly is true, it indicates all projects returned by the projects endpoint are to be shown, without splitting them into top projects and all projects
    if (tenantConfig.topProjectsOnly === true) {
      setTabSelected('allProjects');
    }
  }, [tenantConfig.topProjectsOnly]);

  const shouldHideProjectTabs = tenantConfig.topProjectsOnly === true;

  // Wait for the first project list. Controls shown before it flash a count of 0 projects, and since the fetch waits for the currency, this skeleton replaces them once it starts, losing any search typed meanwhile. See #3227.
  if (
    !hasLoadedProjects ||
    ((isProjectsFetching || isProjectsError) && !hasFilteredProjects)
  ) {
    return <Skeleton className={styles.projectSectionSkeleton} />;
  }

  const projectListControlCommonProps = {
    tabSelected,
    setTabSelected,
    shouldHideProjectTabs,
  };
  const projectListControlMobileProps = {
    isMobile,
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

import Skeleton from 'react-loading-skeleton';
import { useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './ProjectsSection.module.scss';
import { useProjects } from './ProjectsContext';
import ProjectListControls, { type ProjectTabs } from './ProjectListControls';
import ProjectListControlForMobile from './ProjectListControls/ProjectListControlForMobile';
import ProjectList from './ProjectList';
import ProjectsListMeta from '../../utils/getMetaTags/ProjectsListMeta';
import { useTenant } from '../common/Layout/TenantContext';
import { useProjectMapStore } from '../../stores/projectMapStore';
import { useProjectStore } from '../../stores';
import { useFilteredProjects } from '../../hooks/useFilteredProjects';

interface ProjectsSectionProps {
  isMobile: boolean;
}

const ProjectsSection = ({ isMobile }: ProjectsSectionProps) => {
  const { isLoading, isError } = useProjects();
  const { filteredProjectCount } = useFilteredProjects();
  // store: state
  const mapOptions = useProjectMapStore((state) => state.mapOptions);
  const projects = useProjectStore((state) => state.projects);
  const showDonatableProjects = useProjectStore(
    (state) => state.showDonatableProjects
  );
  const isClassificationSelected = useProjectStore(
    (state) => state.selectedClassification.length > 0
  );
  const hasFilteredProjects = filteredProjectCount > 0;
  // store: action
  const updateMapOption = useProjectMapStore((state) => state.updateMapOption);
  const { tenantConfig } = useTenant();

  const [tabSelected, setTabSelected] = useState<ProjectTabs>('topProjects');

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

  if ((isLoading || isError || projects === null) && !hasFilteredProjects) {
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

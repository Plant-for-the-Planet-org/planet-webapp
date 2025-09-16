import type { ReactNode } from 'react';
import type { ProjectTabs } from '..';

import { useTranslations } from 'next-intl';
import StarIcon from '../../../../../public/assets/images/icons/projectV2/StarIcon';
import styles from '../styles/ProjectListControls.module.scss';

interface ProjectListTabForMobileProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  tabSelected?: ProjectTabs;
  setTabSelected?: (value: ProjectTabs) => void;
  setIsFilterOpen: (value: boolean) => void;
}
interface TabItemProps {
  selectedTab: ProjectTabs;
  icon?: ReactNode | undefined;
  label: ReactNode;
}
const ProjectListTabForMobile = ({
  projectCount,
  topProjectCount,
  tabSelected,
  setTabSelected,
  setIsFilterOpen,
}: ProjectListTabForMobileProps) => {
  const t = useTranslations('AllProjects');

  const selectTab = (tab: ProjectTabs) => {
    if (setTabSelected) {
      setTabSelected(tab);
    }
    setIsFilterOpen(false);
  };

  const TabItem = ({ selectedTab, icon, label }: TabItemProps) => {
    const tabButtonClass =
      tabSelected === selectedTab
        ? styles.selectedTabButton
        : styles.unselectedTabButton;
    return (
      <button className={tabButtonClass} onClick={() => selectTab(selectedTab)}>
        {icon && <div className={styles.iconContainer}>{icon}</div>}
        <div className={styles.label}>{label}</div>
      </button>
    );
  };

  return (
    <div className={styles.tabContainer}>
      <TabItem
        selectedTab="topProjects"
        icon={<StarIcon width={'12px'} />}
        label={t.rich('top', {
          noOfProjects: topProjectCount,
          projectCountContainer: (chunks) => (
            <span className={styles.projectCount}>{chunks}</span>
          ),
        })}
      />
      <TabItem
        selectedTab="allProjects"
        label={t.rich('allProjects', {
          noOfProjects: projectCount,
          projectCountContainer: (chunks) => (
            <span className={styles.projectCount}>{chunks}</span>
          ),
        })}
      />
    </div>
  );
};

export default ProjectListTabForMobile;

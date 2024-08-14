import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import StarIcon from '../../../../../public/assets/images/icons/projectV2/StarIcon';
import styles from '../styles/ProjectListControls.module.scss';
import themeProperties from '../../../../theme/themeProperties';

type ProjectTabs = 'topProjects' | 'allProjects';
interface ProjectListTabForMobileProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  tabSelected: ProjectTabs;
  setTabSelected: (value: ProjectTabs) => void;
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
  const { light, dark } = themeProperties;
  const t = useTranslations('AllProjects');

  const selectTab = (tab: ProjectTabs) => {
    setTabSelected(tab);
    setIsFilterOpen(false);
  };

  const TabItem = ({ selectedTab, icon, label }: TabItemProps) => {
    const tabButtonClass =
      tabSelected === selectedTab
        ? styles.selectedTabButton
        : styles.unselectedTabButton;
    return (
      <button className={tabButtonClass} onClick={() => selectTab(selectedTab)}>
        {icon && <div className={styles.starIconContainer}>{icon}</div>}
        <div className={styles.label}>{label}</div>
      </button>
    );
  };
  const starIconColor =
    tabSelected === 'topProjects' ? `${light.light}` : `${dark.darkNew}`;
  return (
    <div className={styles.tabContainer}>
      <TabItem
        selectedTab="topProjects"
        icon={<StarIcon width={'12px'} color={starIconColor} />}
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

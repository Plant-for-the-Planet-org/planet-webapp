import StarIcon from '../icons/StarIcon';
import style from './ProjectListControls.module.scss';
import { useTranslations } from 'next-intl';
import themeProperties from '../../theme/themeProperties';
import { ReactNode } from 'react';

type ProjectCollection = 'topProjects' | 'allProjects';
interface ProjectListTabForMobileProps {
  projectCount: number;
  topProjectCount: number;
  tabSelected: ProjectCollection;
  setTabSelected: (value: ProjectCollection) => void;
  setIsFilterOpen: (value: boolean) => void;
}
interface TabItemProps {
  selectedTab: 'topProjects' | 'allProjects';
  icon: ReactNode | undefined;
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

  const selectTab = (tab: 'topProjects' | 'allProjects') => {
    setTabSelected(tab);
    setIsFilterOpen(false);
  };

  const TabItem = ({ selectedTab, icon, label }: TabItemProps) => {
    const tabButtonClass =
      tabSelected === selectedTab
        ? style.selectedTabButton
        : style.unselectedTabButton;
    return (
      <button className={tabButtonClass} onClick={() => selectTab(selectedTab)}>
        <div className={style.starIconContainer}>{icon}</div>
        <div className={style.label}>{label}</div>
      </button>
    );
  };
  const starIconColor =
    tabSelected === 'topProjects' ? `${light.light}` : `${dark.darkNew}`;

  return (
    <div className={style.tabContainer}>
      <TabItem
        selectedTab="topProjects"
        icon={<StarIcon width={'12px'} color={starIconColor} />}
        label={t.rich('top', {
          noOfProjects: topProjectCount,
          projectCountContainer: (chunks) => (
            <span className={style.projectCount}>{chunks}</span>
          ),
        })}
      />
      <TabItem
        selectedTab="allProjects"
        icon={undefined}
        label={t.rich('allProjects', {
          noOfProjects: projectCount,
          projectCountContainer: (chunks) => (
            <span className={style.projectCount}>{chunks}</span>
          ),
        })}
      />
    </div>
  );
};

export default ProjectListTabForMobile;

import StarIcon from '../icons/StarIcon';
import style from '../Project/Search.module.scss';
import { useTranslations } from 'next-intl';
import themeProperties from '../../theme/themeProperties';
import { ReactNode } from 'react';

type ProjectCollection = 'topProjects' | 'allProjects';
interface ProjectListTabForMobileProps {
  numberOfProject: number;
  tabSelected: ProjectCollection;
  setTabSelected: (value: ProjectCollection) => void;
  setIsFilterOpen: (value: boolean) => void;
}
interface TabItemProps {
  tab: 'topProjects' | 'allProjects';
  icon: ReactNode | undefined;
  label: ReactNode;
}
const ProjectListTabForMobile = ({
  numberOfProject,
  tabSelected,
  setTabSelected,
  setIsFilterOpen,
}: ProjectListTabForMobileProps) => {
  const { light, dark } = themeProperties;
  const t = useTranslations('ProjectDetails');

  const selectTab = (tab: 'topProjects' | 'allProjects') => {
    setTabSelected(tab);
    setIsFilterOpen(false);
  };

  const TabItem = ({ tab, icon, label }: TabItemProps) => {
    return (
      <button
        className={
          tabSelected === tab
            ? style.selectedTabButton
            : style.unselectedTabButton
        }
        onClick={() => selectTab(tab)}
      >
        <div className={style.starIconContainer}>{icon}</div>
        <div className={style.label}>{label}</div>
      </button>
    );
  };

  return (
    <div className={style.tabContainer}>
      <TabItem
        tab={'topProjects'}
        icon={
          <StarIcon
            width={'12px'}
            color={
              tabSelected === 'topProjects'
                ? `${light.light}`
                : `${dark.darkNew}`
            }
          />
        }
        label={t.rich('topProjects', {
          noOfProjects: numberOfProject,
          projectCountContainer: (chunks) => (
            <span className={style.projectCount}>{chunks}</span>
          ),
        })}
      />
      <TabItem
        tab={'allProjects'}
        icon={undefined}
        label={t.rich('allProjects', {
          noOfProjects: numberOfProject,
          projectCountContainer: (chunks) => (
            <span className={style.projectCount}>{chunks}</span>
          ),
        })}
      />
    </div>
  );
};

export default ProjectListTabForMobile;

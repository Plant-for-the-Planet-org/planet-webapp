import StarIcon from '../icons/StarIcon';
import style from '../Project/Search.module.scss';
import { Trans } from 'next-i18next';
import themeProperties from '../../theme/themeProperties';

type ProjectCollection = 'topProjects' | 'allProjects';
interface ProjectListTabForMobileProps {
  numberOfProject: number;
  tabSelected: ProjectCollection;
  setTabSelected: (value: ProjectCollection) => void;
  setIsFilterOpen: (value: boolean) => void;
}

const ProjectListTabForMobile = ({
  numberOfProject,
  tabSelected,
  setTabSelected,
  setIsFilterOpen,
}: ProjectListTabForMobileProps) => {
  const { light, dark } = themeProperties;
  return (
    <div className={style.projectListTabs}>
      <button
        className={
          tabSelected === 'topProjects'
            ? style.activeTopProjectButton
            : style.topProjectButton
        }
        onClick={() => {
          setTabSelected('topProjects');
          setIsFilterOpen(false);
        }}
      >
        <div className={style.starIconContainer}>
          <StarIcon
            width={'12px'}
            color={
              tabSelected === 'topProjects'
                ? `${light.light}`
                : `${dark.darkNew}`
            }
          />
        </div>
        <div
          className={
            tabSelected === 'topProjects'
              ? style.activeTopProjectLabelConatiner
              : style.topProjectLabelConatiner
          }
        >
          <div className={style.topProjectLable}>
            <Trans i18nKey="topProjects">
              Top Projects<p>({{ noOfProjects: `${numberOfProject}` }})</p>
            </Trans>
          </div>
        </div>
      </button>
      <button
        className={
          tabSelected === 'allProjects'
            ? style.activeAllProjectButton
            : style.allProjectButton
        }
        onClick={() => {
          setIsFilterOpen(false);
          setTabSelected('allProjects');
        }}
      >
        <div className={style.allProjectLabel}>
          <Trans i18nKey="all">
            All<p>({{ noOfProjects: `${numberOfProject}` }})</p>
          </Trans>
        </div>
      </button>
    </div>
  );
};

export default ProjectListTabForMobile;

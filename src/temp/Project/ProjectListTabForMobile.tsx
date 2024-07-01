import StarIcon from '../icons/StarIcon';
import style from '../Project/Search.module.scss';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('ProjectDetails');

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
            {t.rich('topProjects', {
              noOfProjects: numberOfProject,
              projectCountContainer: (chunks) => (
                <span className={style.projectCount}>{chunks}</span>
              ),
            })}
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
          {t.rich('allProjects', {
            noOfProjects: numberOfProject,
            projectCountContainer: (chunks) => (
              <span className={style.projectCount}>{chunks}</span>
            ),
          })}
        </div>
      </button>
    </div>
  );
};

export default ProjectListTabForMobile;

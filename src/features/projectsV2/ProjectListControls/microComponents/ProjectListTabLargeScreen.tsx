import { Tabs } from '@mui/material';
import { useTranslations } from 'next-intl';
import CustomMuiTab from './CustomMuiTab';
import StarIcon from '../../../../../public/assets/images/icons/projectV2/StarIcon';
import themeProperties from '../../../../theme/themeProperties';
import styles from '../styles/ProjectListControls.module.scss';
import { SetState } from '../../../common/types/common';
import { ProjectTabs } from '..';

interface ProjectListTabLargeScreenProps {
  setIsFilterOpen: SetState<boolean>;
  topProjectCount: number | undefined;
  projectCount: number | undefined;
  setTabSelected: SetState<ProjectTabs>;
  tabSelected: ProjectTabs;
}

const ProjectListTabLargeScreen = ({
  setIsFilterOpen,
  topProjectCount,
  projectCount,
  setTabSelected,
  tabSelected,
}: ProjectListTabLargeScreenProps) => {
  const t = useTranslations('AllProjects');
  const { primaryColorNew, dark } = themeProperties;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabSelected(newValue);
    setIsFilterOpen(false);
  };
  return (
    <Tabs
      value={tabSelected}
      onChange={handleChange}
      TabIndicatorProps={{
        sx: { backgroundColor: `${primaryColorNew}` },
      }}
    >
      <CustomMuiTab
        icon={
          <StarIcon
            width={'16px'}
            color={`${tabSelected === 1 ? dark.darkNew : primaryColorNew}`}
          />
        }
        label={
          <div className={styles.projectLabel}>
            {t.rich('topProjects', {
              noOfProjects: topProjectCount,
              projectCountContainer: (chunks) => (
                <span className={styles.projectCount}>{chunks}</span>
              ),
            })}
          </div>
        }
        sx={{ fontWeight: '700' }}
      />
      <CustomMuiTab
        sx={{ fontWeight: '700', marginLeft: '0px' }}
        label={
          <div className={styles.projectLabel}>
            {t.rich('allProjects', {
              noOfProjects: projectCount,
              projectCountContainer: (chunks) => (
                <span className={styles.projectCount}>{chunks}</span>
              ),
            })}
          </div>
        }
      />
    </Tabs>
  );
};

export default ProjectListTabLargeScreen;
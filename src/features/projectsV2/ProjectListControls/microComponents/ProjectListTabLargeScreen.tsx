import type { SyntheticEvent } from 'react';
import type { SetState } from '../../../common/types/common';
import type { ProjectTabs } from '..';

import { Tabs } from '@mui/material';
import { useTranslations } from 'next-intl';
import CustomMuiTab from './CustomMuiTab';
import StarIcon from '../../../../../public/assets/images/icons/projectV2/StarIcon';
import themeProperties from '../../../../theme/themeProperties';
import styles from '../styles/ProjectListControls.module.scss';
import { useProjectStore } from '../../../../stores';

interface ProjectListTabLargeScreenProps {
  setIsFilterOpen: SetState<boolean>;
  setTabSelected: SetState<ProjectTabs>;
  tabSelected: ProjectTabs;
}

const ProjectListTabLargeScreen = ({
  setIsFilterOpen,
  setTabSelected,
  tabSelected,
}: ProjectListTabLargeScreenProps) => {
  const t = useTranslations('AllProjects');
  const { colors } = themeProperties.designSystem;
  const isTopProjectTab = tabSelected === 'topProjects';
  // store: state
  const topProjectCount = useProjectStore((state) => state.topProjects?.length);
  const projectCount = useProjectStore((state) => state.projects?.length);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabSelected(newValue === 0 ? 'topProjects' : 'allProjects');
    setIsFilterOpen(false);
  };
  return (
    <Tabs
      value={isTopProjectTab ? 0 : 1}
      onChange={handleChange}
      TabIndicatorProps={{
        sx: { backgroundColor: colors.primaryColor },
      }}
    >
      <CustomMuiTab
        icon={<StarIcon width={'16px'} />}
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

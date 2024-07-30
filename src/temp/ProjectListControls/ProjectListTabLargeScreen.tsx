import CustomMuiTab from './CustomMuiTab';
import { Tabs } from '@mui/material';
import StarIcon from '../icons/StarIcon';
import { useTranslations } from 'next-intl';
import themeProperties from '../../theme/themeProperties';
import style from './ProjectListControls.module.scss';
import { useState } from 'react';
import { SetState } from '../../features/common/types/common';

interface ProjectListTabLargeScreenProps {
  setIsFilterOpen: SetState<boolean>;
  topProjectCount: number;
  projectCount: number;
}

const ProjectListTabLargeScreen = ({
  setIsFilterOpen,
  topProjectCount,
  projectCount,
}: ProjectListTabLargeScreenProps) => {
  const t = useTranslations('AllProjects');
  const { primaryColorNew, dark } = themeProperties;
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setIsFilterOpen(false);
  };
  return (
    <Tabs
      value={value}
      onChange={handleChange}
      TabIndicatorProps={{
        sx: { backgroundColor: `${primaryColorNew}` },
      }}
    >
      <CustomMuiTab
        icon={
          <StarIcon
            width="16px"
            color={`${value === 1 ? dark.darkNew : primaryColorNew}`}
          />
        }
        label={
          <div className={style.projectLabel}>
            {t.rich('topProjects', {
              noOfProjects: topProjectCount,
              projectCountContainer: (chunks) => (
                <span className={style.projectCount}>{chunks}</span>
              ),
            })}
          </div>
        }
        sx={{ fontWeight: '700' }}
      />
      <CustomMuiTab
        sx={{ fontWeight: '700', marginLeft: '0px' }}
        label={
          <div className={style.projectLabel}>
            {t.rich('allProjects', {
              noOfProjects: projectCount,
              projectCountContainer: (chunks) => (
                <span className={style.projectCount}>{chunks}</span>
              ),
            })}
          </div>
        }
      />
    </Tabs>
  );
};

export default ProjectListTabLargeScreen;

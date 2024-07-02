import { useState } from 'react';
import FilterIcon from '../icons/FilterIcon';
import SearchIcon from '../icons/SearchIcon';
import StarIcon from '../icons/StarIcon';
import Tabs from '@mui/material/Tabs';
import style from './Search.module.scss';
import { useTranslations } from 'next-intl';
import CustomMuiTab from './CustomMuiTab';
import themeProperties from '../../theme/themeProperties';
import ActiveSearchField from './ActiveSearchField';
import { FilterDropDown } from './Filter';
import { Classification } from './Filter';

export interface ProjectListControlsProps {
  filterApplied: Classification | undefined;
  setFilterApplied: (newValue: Classification | undefined) => void;
  availableFilters: Classification[];
  projectCount: number;
  topProjectCount: number;
}

const ProjectListControls = ({
  filterApplied,
  setFilterApplied,
  availableFilters,
  projectCount,
  topProjectCount,
}: ProjectListControlsProps) => {
  const t = useTranslations('AllProjects');
  const [isSearching, setIsSearching] = useState(false);
  const [value, setValue] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { primaryColorNew, dark } = themeProperties;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setIsFilterOpen(false);
  };
  return (
    <>
      <div className={style.searchBarMainConatiner}>
        {isSearching ? (
          <ActiveSearchField
            setIsSearching={setIsSearching}
            setIsFilterOpen={setIsFilterOpen}
          />
        ) : (
          <div className={style.searchBarContainer}>
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
                    width={'16px'}
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
                sx={{ fontWeight: '700' }}
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
            <div className={style.iconsContainer}>
              <button
                className={style.icon}
                onClick={() => setIsSearching(!isSearching)}
              >
                <SearchIcon />
              </button>
              <button
                className={style.icon}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <FilterIcon width={'16px'} />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={style.filterDropDownContainer}>
        {isFilterOpen && !isSearching && (
          <FilterDropDown
            setFilterApplied={setFilterApplied}
            availableFilters={availableFilters}
            filterApplied={filterApplied}
          />
        )}
      </div>
    </>
  );
};

export default ProjectListControls;

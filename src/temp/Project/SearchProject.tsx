import { useState } from 'react';
import CrossIcon from '../icons/CrossIcon';
import FilterIcon from '../icons/FilterIcon';
import SearchIcon from '../icons/SearchIcon';
import StarIcon from '../icons/StarIcon';
import Tabs from '@mui/material/Tabs';
import { FilterDropDown } from './Filter';
import style from './Search.module.scss';
import { useTranslation, Trans } from 'next-i18next';
import CustomTab from './CustomTab';
import { SearchTextField } from './CustomSearchTextField';

interface SearchProjectInterface {
  activeFilter: boolean;
  projectList: string[];
  searchActive: boolean;
}
const SearchProject = ({
  activeFilter,
  projectList,
  searchActive,
}: SearchProjectInterface) => {
  const [input, setInput] = useState('');
  const [activeSearch, setSearchActive] = useState(searchActive);
  const { t } = useTranslation(['projectDetails']);
  const [value, setValue] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <div className={style.searchBarMainConatiner}>
        {searchActive || activeSearch ? (
          <>
            <div
              className={style.activeSearchIcon}
              onClick={() => setSearchActive(false)}
            >
              <SearchIcon />
            </div>
            <SearchTextField
              id="standard-search"
              variant="standard"
              placeholder={t('projectDetails:searchProject')}
              value={input}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setInput(event.target.value);
              }}
            />

            <button
              onClick={() => {
                setInput('');
                setSearchActive(false);
              }}
              className={style.crossIcon}
            >
              <CrossIcon width={'18px'} />
            </button>
          </>
        ) : (
          <div className={style.searchBarContainer}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="icon position tabs example"
              TabIndicatorProps={{
                sx: { backgroundColor: '#219653' },
              }}
            >
              <CustomTab
                icon={<StarIcon width={'16px'} color={'#219653'} />}
                label={
                  <Trans i18nKey={'topProject'}>
                    <div className={style.projectLabel}>
                      Top Projects
                      <p className={style.noOfProjects}>
                        ({{ noOfProjects: '34' }})
                      </p>
                    </div>
                  </Trans>
                }
                sx={{ fontWeight: '700' }}
              />
              <CustomTab
                sx={{ fontWeight: '700' }}
                label={
                  <Trans i18nKey={'all'}>
                    <div className={style.projectLabel}>
                      All
                      <p className={style.noOfProjects}>
                        ({{ noOfProjects: '556' }})
                      </p>
                    </div>
                  </Trans>
                }
              />
            </Tabs>
            <div className={style.iconsContainer}>
              <div className={style.icon}>
                <SearchIcon />
              </div>
              <div className={style.icon}>
                <FilterIcon width={'16px'} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={style.filterContainer}>
        <FilterDropDown activeFilter={activeFilter} projectList={projectList} />
      </div>
    </>
  );
};

export default SearchProject;

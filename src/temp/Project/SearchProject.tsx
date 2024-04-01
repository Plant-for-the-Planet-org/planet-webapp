import { useState } from 'react';
import CrossIcon from '../icons/CrossIcon';
import FilterIcon from '../icons/FilterIcon';
import SearchIcon from '../icons/SearchIcon';
import StarIcon from '../icons/StarIcon';
import Tabs from '@mui/material/Tabs';
import style from './Search.module.scss';
import { useTranslation, Trans } from 'next-i18next';
import CustomTab from './CustomTab';
import { SearchTextField } from './CustomSearchTextField';
import themeProperties from '../../theme/themeProperties';

interface SearchProjectInterface {
  isSearch: boolean;
}
const SearchProject = ({ isSearch }: SearchProjectInterface) => {
  const [input, setInput] = useState('');
  const [activeSearch, setSearchActive] = useState(isSearch);
  const { t } = useTranslation(['projectDetails']);
  const [value, setValue] = useState(0);
  const { primaryColorNew, dark } = themeProperties;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  console.log(value, '==1');
  return (
    <>
      <div className={style.searchBarMainConatiner}>
        {isSearch || activeSearch ? (
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
                sx: { backgroundColor: `${primaryColorNew}` },
              }}
            >
              <CustomTab
                icon={
                  <StarIcon
                    width={'16px'}
                    color={`${value === 1 ? dark.darkNew : primaryColorNew}`}
                  />
                }
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
              <button className={style.icon}>
                <SearchIcon />
              </button>
              <button className={style.icon}>
                <FilterIcon width={'16px'} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchProject;

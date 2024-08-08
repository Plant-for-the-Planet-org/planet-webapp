import { useState, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { SearchTextField } from './SearchTextField';
import CrossIcon from '../../../../../public/assets/images/icons/projectV2/CrossIcon';
import style from '../styles/ProjectListControls.module.scss';
import SearchIcon from '../../../../../public/assets/images/icons/projectV2/SearchIcon';
import { SetState } from '../../../common/types/common';
import { useDebouncedEffect } from '../../../../utils/useDebouncedEffect';

interface ActiveSearchFieldProps {
  setIsSearching: SetState<boolean>;
  setIsFilterOpen: SetState<boolean>;
  setDebouncedSearchValue: SetState<string>;
}

const ActiveSearchField = ({
  setIsSearching,
  setIsFilterOpen,
  setDebouncedSearchValue,
}: ActiveSearchFieldProps) => {
  const t = useTranslations('AllProjects');
  const [searchValue, setSearchValue] = useState('');

  useDebouncedEffect(
    () => {
      setDebouncedSearchValue(searchValue);
    },
    1000,
    [searchValue]
  );

  const resetSearchTab = () => {
    setDebouncedSearchValue('');
    setIsSearching(false);
    setIsFilterOpen(false);
  };

  return (
    <div className={style.activeSearchFieldContainer}>
      <button className={style.activeSearchIcon}>
        <SearchIcon />
      </button>
      <SearchTextField
        id="standard-search"
        variant="standard"
        placeholder={t('searchProject')}
        value={searchValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setSearchValue(event.target.value);
        }}
        autoFocus
      />

      <button onClick={resetSearchTab} className={style.crossIcon}>
        <CrossIcon />
      </button>
    </div>
  );
};

export default ActiveSearchField;

import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import { SearchTextField } from './SearchTextField';
import CrossIcon from '../icons/CrossIcon';
import style from './ProjectListControls.module.scss';
import SearchIcon from '../icons/SearchIcon';
import { useTranslations } from 'next-intl';
import { SetState } from '../../features/common/types/common';

interface ActiveSearchFieldProps {
  setIsSearching: SetState<boolean>;
  setIsFilterOpen: SetState<boolean>;
}

const ActiveSearchField = ({
  setIsSearching,
  setIsFilterOpen,
}: ActiveSearchFieldProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');

  useEffect(() => {
    window.alert(`${debouncedSearchValue} searched !`);
  }, [debouncedSearchValue]);

  const useDebouncedEffect = (
    effect: () => void,
    delay: number,
    deps: any[]
  ) => {
    const callback = useCallback(effect, deps);

    useEffect(() => {
      const handler = setTimeout(() => {
        callback();
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [callback, delay]);
  };

  useDebouncedEffect(
    () => {
      setDebouncedSearchValue(searchValue);
    },
    1000,
    [searchValue]
  );
  const t = useTranslations('AllProjects');

  const resetSearchTab = () => {
    setSearchValue('');
    setIsSearching(false);
    setIsFilterOpen(false);
  };

  return (
    <div className={style.projectListControls}>
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
      />

      <button onClick={resetSearchTab} className={style.crossIcon}>
        <CrossIcon />
      </button>
    </div>
  );
};

export default ActiveSearchField;

import type { ChangeEvent } from 'react';
import type { SetState } from '../../../common/types/common';

import { useContext, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SearchTextField } from './SearchTextField';
import CrossIcon from '../../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from '../styles/ProjectListControls.module.scss';
import SearchIcon from '../../../../../public/assets/images/icons/projectV2/SearchIcon';
import { useDebouncedEffect } from '../../../../utils/useDebouncedEffect';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import { clsx } from 'clsx';

interface ActiveSearchFieldProps {
  setIsSearching: SetState<boolean>;
  setIsFilterOpen: SetState<boolean>;
  debouncedSearchValue: string;
  setDebouncedSearchValue: SetState<string>;
}

const ActiveSearchField = ({
  setIsSearching,
  setIsFilterOpen,
  debouncedSearchValue,
  setDebouncedSearchValue,
}: ActiveSearchFieldProps) => {
  const t = useTranslations('AllProjects');
  const { embed, showProjectList } = useContext(ParamsContext);

  const [searchValue, setSearchValue] = useState(debouncedSearchValue);
  const onlyMapModeAllowed = embed === 'true' && showProjectList === 'false';

  useDebouncedEffect(
    () => {
      setDebouncedSearchValue(searchValue);
    },
    1000,
    [searchValue]
  );
  const resetSearch = () => {
    setDebouncedSearchValue('');
    setIsSearching(false);
    setIsFilterOpen(false);
  };
  return (
    <div
      className={clsx(
        styles.activeSearchFieldContainer,
        onlyMapModeAllowed && styles.onlyMapMode
      )}
    >
      <button className={styles.activeSearchIcon}>
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

      <button onClick={resetSearch} className={styles.crossIcon}>
        <CrossIcon />
      </button>
    </div>
  );
};

export default ActiveSearchField;

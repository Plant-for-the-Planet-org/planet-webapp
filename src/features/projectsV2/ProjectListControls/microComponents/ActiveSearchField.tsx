import type { ChangeEvent } from 'react';
import type { SetState } from '../../../common/types/common';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SearchTextField } from './SearchTextField';
import CrossIcon from '../../../../../public/assets/images/icons/projectV2/CrossIcon';
import IconButton from '../../../common/IconButton';
import styles from '../styles/ProjectListControls.module.scss';
import { useDebouncedEffect } from '../../../../utils/useDebouncedEffect';
import { clsx } from 'clsx';
import { useQueryParamStore } from '../../../../stores/queryParamStore';
import { useProjectStore } from '../../../../stores';

interface ActiveSearchFieldProps {
  setIsFilterOpen: SetState<boolean>;
}

const ActiveSearchField = ({ setIsFilterOpen }: ActiveSearchFieldProps) => {
  const t = useTranslations('AllProjects');
  const debouncedSearchValue = useProjectStore(
    (state) => state.debouncedSearchValue
  );
  const [searchValue, setSearchValue] = useState(debouncedSearchValue);

  const isEmbedMode = useQueryParamStore((state) => state.embed === 'true');
  const showProjectList = useQueryParamStore((state) => state.showProjectList);
  // store: action
  const setDebouncedSearchValue = useProjectStore(
    (state) => state.setDebouncedSearchValue
  );
  const setIsSearching = useProjectStore((state) => state.setIsSearching);

  const onlyMapModeAllowed = isEmbedMode && showProjectList === 'false';

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
      className={clsx(styles.activeSearchFieldContainer, {
        [styles.onlyMapMode]: onlyMapModeAllowed,
      })}
    >
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

      <IconButton
        label={t('clearSearch')}
        onClick={resetSearch}
        className={styles.crossIcon}
      >
        <CrossIcon />
      </IconButton>
    </div>
  );
};

export default ActiveSearchField;

import React, { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import { TextField } from '@mui/material';

interface Props {
  setSearchValue: Function;
  setSearchMode: Function;
  searchValue: any;
  searchRef: any;
}

function SearchBar({
  setSearchValue,
  setSearchMode,
  searchValue,
  searchRef,
}: Props): ReactElement {
  const { t, ready } = useTranslation(['donate']);
  return ready ? (
    <>
      <button id={'searchIconSearchB'} className={'searchIcon'}>
        <SearchIcon color={'primaryFontColor'} />
      </button>

      <div className={'searchInput'} data-test-id="searchIcon">
        <TextField
          ref={searchRef}
          fullWidth={true}
          autoFocus={true}
          placeholder={t('donate:searchProjects')}
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          variant="standard"
        />
      </div>
      <button
        id={'searchCancelIcon'}
        className={'cancelIcon'}
        onClick={() => {
          setSearchMode(false);
          setSearchValue('');
        }}
      >
        <CancelIcon color={'primaryFontColor'} />
      </button>
    </>
  ) : null;
}

export default SearchBar;

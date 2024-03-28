import React, { RefObject } from 'react';
import { useTranslations } from 'next-intl';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import { TextField } from '@mui/material';

interface Props {
  setSearchValue: Function;
  setSearchMode: Function;
  searchValue: string;
  searchRef: RefObject<HTMLDivElement>;
}

function SearchBar({
  setSearchValue,
  setSearchMode,
  searchValue,
  searchRef,
}: Props) {
  const t = useTranslations('Donate');
  return (
    <>
      <button id={'searchIconSearchB'} className={'searchIcon'}>
        <SearchIcon />
      </button>

      <div className={'searchInput'} data-test-id="searchIcon">
        <TextField
          ref={searchRef}
          fullWidth={true}
          autoFocus={true}
          placeholder={t('searchProjects')}
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
  );
}

export default SearchBar;

import { useState } from 'react';
import { SearchTextField } from './CustomSearchTextField';
import CrossIcon from '../icons/CrossIcon';
import style from './Search.module.scss';
import SearchIcon from '../icons/SearchIcon';
import { useTranslation } from 'next-i18next';

interface ActiveSearchFieldProps {
  setIsSearching: (value: boolean) => void;
  setIsFilterOpen: (value: boolean) => void;
}
const ActiveSearchField = ({
  setIsSearching,
  setIsFilterOpen,
}: ActiveSearchFieldProps) => {
  const [input, setInput] = useState('');
  const { t } = useTranslation(['projectDetails']);
  return (
    <>
      <button className={style.activeSearchIcon}>
        <SearchIcon />
      </button>
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
          setIsSearching(false);
          setIsFilterOpen(false);
        }}
        className={style.crossIcon}
      >
        <CrossIcon width={'18px'} />
      </button>
    </>
  );
};

export default ActiveSearchField;
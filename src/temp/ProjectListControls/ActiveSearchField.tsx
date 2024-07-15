import { useState, ChangeEvent } from 'react';
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
  const [input, setInput] = useState('');
  const t = useTranslations('AllProjects');

  const resetSearchTab = () => {
    setInput('');
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
        value={input}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setInput(event.target.value);
        }}
      />

      <button onClick={resetSearchTab} className={style.crossIcon}>
        <CrossIcon />
      </button>
    </div>
  );
};

export default ActiveSearchField;

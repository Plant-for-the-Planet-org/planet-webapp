import React, { ReactElement } from 'react'
import styles from '../../styles/Projects.module.scss';
import i18next from '../../../../../i18n/'
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import { TextField } from '@material-ui/core';

interface Props {
    setSearchValue: Function;
    setSearchMode: Function;
    searchValue: any;
    searchRef: any
}

const { useTranslation } = i18next;
function SearchBar({ setSearchValue, setSearchMode, searchValue, searchRef }: Props): ReactElement {
    const { t } = useTranslation(['donate']);
    return (
        <>
            <div className={styles.searchIcon}>
                <SearchIcon color={styles.primaryFontColor} />
            </div>

            <div className={styles.searchInput}>
                <TextField
                    ref={searchRef}
                    fullWidth={true}
                    autoFocus={true}
                    placeholder={t('donate:searchProjects')}
                    onChange={(e) => setSearchValue(e.target.value)}
                    value={searchValue}
                />
            </div>
            <div
                className={styles.cancelIcon}
                onClick={() => {
                    setSearchMode(false);
                    setSearchValue('');
                }}
            >
                <CancelIcon color={styles.primaryFontColor} />
            </div>
        </>
    )
}

export default SearchBar

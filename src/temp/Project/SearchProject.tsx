import { useState } from 'react';
import CrossIcon from '../icons/CrossIcon';
import FilterIcon from '../icons/FilterIcon';
import SearchIcon from '../icons/SearchIcon';
import StarIcon from '../icons/StarIcon';
import TextField from '@mui/material/TextField';
import {
  createTheme,
  ThemeProvider,
  Theme,
  useTheme,
} from '@mui/material/styles';
import { FilterDropDown } from './Filter';
import style from './Search.module.scss';
import { useTranslation, Trans } from 'next-i18next';

const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#fff',
            '--TextField-brandBorderHoverColor': '#fff',
            '--TextField-brandBorderFocusedColor': '#fff',
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&': {
              width: '240px',
            },
            '&::before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom:
                '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
    },
  });

interface SearchProjectInterface {
  activeFilter: boolean;
  projectList: string[];
  searchActive: boolean;
}
const SearchProject = ({
  activeFilter,
  projectList,
  searchActive,
}: SearchProjectInterface) => {
  const [input, setInput] = useState('');
  const [activeSearch, setSearchActive] = useState(searchActive);
  const { t } = useTranslation(['projectDetails']);
  const outerTheme = useTheme();

  return (
    <>
      <div className={style.searchBarMainConatiner}>
        {searchActive || activeSearch ? (
          <>
            <div
              className={style.activeSearchIcon}
              onClick={() => setSearchActive(false)}
            >
              <SearchIcon />
            </div>
            <ThemeProvider theme={customTheme(outerTheme)}>
              <TextField
                sx={{
                  '.MuiInput-input': {
                    marginTop: '4px',
                    marginLeft: '10px',
                  },
                }}
                id="standard-search"
                variant="standard"
                placeholder={t('projectDetails:searchProject')}
                value={input}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setInput(event.target.value);
                }}
                className={style.textField}
              />
            </ThemeProvider>

            <button
              onClick={() => {
                setInput('');
                setSearchActive(false);
              }}
              className={style.crossIcon}
            >
              <CrossIcon />
            </button>
          </>
        ) : (
          <div className={style.searchBarContainer}>
            <div className={style.allProjectLabelMainContainer}>
              <div>
                <StarIcon width={'16px'} height={'17px'} color={'#219653'} />
              </div>
              <div className={style.topProjectLabelContainer}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {t('projectDetails:topProjects', {
                    noOfProjects: 56,
                  })}
                </div>
              </div>
            </div>
            <div className={style.allProjectLabelContainer}>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {t('projectDetails:all', {
                  noOfProjects: 56,
                })}
              </div>
            </div>
            <div className={style.projectFeatureContainer}>
              <div
                className={style.selector}
                onClick={() => setSearchActive(true)}
              >
                <SearchIcon />
              </div>
              <div className={style.selector}>
                <FilterIcon width={'16px'} height={'16px'} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={style.filterContainer}>
        <FilterDropDown activeFilter={activeFilter} projectList={projectList} />
      </div>
    </>
  );
};

export default SearchProject;

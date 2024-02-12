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
                id="standard-search"
                variant="standard"
                placeholder="Search Project"
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
                <StarIcon />
              </div>
              <div className={style.topProjectLabelContainer}>
                <div className={style.label}>Top Projects</div>
                <div className={style.countProject}>(56)</div>
              </div>
            </div>
            <div className={style.allProjectLabelContainer}>
              <div className={style.label}>All</div>
              <div className={style.countProject}>(155)</div>
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

import {
  FormControl,
  NativeSelect,
  InputLabel,
  createStyles,
  makeStyles,
  withStyles,
  Theme,
  InputBase,
} from '@material-ui/core';
import React, { ReactElement } from 'react';
import styles from '../../styles/VegetationChange.module.scss';

interface Props {
  selectedYear1: any;
  setSelectedYear1: Function;
  selectedYear2: any;
  setSelectedYear2: Function;
}

export default function ImagerySwitcher({
  selectedYear1,
  setSelectedYear1,
  selectedYear2,
  setSelectedYear2,
}: Props): ReactElement {
  const handleChangeYear1 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedYear1(event.target.value as string);
  };
  const handleChangeYear2 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedYear2(event.target.value as string);
  };

  const BootstrapInput = withStyles((theme: Theme) =>
    createStyles({
      root: {
        'label + &': {
          marginTop: theme.spacing(3),
        },
      },
      input: {
        borderRadius: 13,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 3px 6px #00000029',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
          borderRadius: 4,
          borderColor: '#80bdff',
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
      },
    })
  )(InputBase);

  return (
    <>
      <div className={styles.dropdownContainer}>
        <div className={styles.beforeYear}>
          <FormControl>
            <NativeSelect
              id="customized-select-native"
              value={selectedYear1}
              onChange={handleChangeYear1}
              input={<BootstrapInput />}
            >
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
            </NativeSelect>
          </FormControl>
        </div>
        <div className={styles.afterYear}>
          <FormControl>
            <NativeSelect
              id="customized-select-native"
              value={selectedYear2}
              onChange={handleChangeYear2}
              input={<BootstrapInput />}
            >
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
            </NativeSelect>
          </FormControl>
        </div>
      </div>
    </>
  );
}

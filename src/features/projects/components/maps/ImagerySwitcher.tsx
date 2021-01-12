import { FormControl, NativeSelect, InputLabel, createStyles, makeStyles, withStyles, Theme, InputBase } from '@material-ui/core';
import React, { ReactElement } from 'react';
import styles from '../../styles/VegetationChange.module.scss';

interface Props {
}

export default function ImagerySwitcher({
}: Props): ReactElement {
  const [selectedYear1, setSelectedYear1] = React.useState('2017');
  const [selectedYear2, setSelectedYear2] = React.useState('2020');
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
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
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
    }),
  )(InputBase);

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      margin: {
        margin: theme.spacing(1),
      },
    }),
  );

  const classes = useStyles();

  return (
    <>
      <div className={styles.dropdownContainer}>
        <div className={styles.beforeYear}><FormControl className={classes.margin}>
          <InputLabel htmlFor="demo-customized-select-native">Image 1</InputLabel>
          <NativeSelect
            id="demo-customized-select-native"
            value={selectedYear1}
            onChange={handleChangeYear1}
            input={<BootstrapInput />}
          >
            <option value={2017}>2017</option>
            <option value={2018}>2018</option>
            <option value={2019}>2019</option>
            <option value={2020}>2020</option>
          </NativeSelect>
        </FormControl></div>
        <div className={styles.afterYear}><FormControl className={classes.margin}>
          <InputLabel htmlFor="demo-customized-select-native">Image 2</InputLabel>
          <NativeSelect
            id="demo-customized-select-native"
            value={selectedYear2}
            onChange={handleChangeYear2}
            input={<BootstrapInput />}
          >
            <option value={2017}>2017</option>
            <option value={2018}>2018</option>
            <option value={2019}>2019</option>
            <option value={2020}>2020</option>
          </NativeSelect>
        </FormControl></div>
      </div>
    </>
  );
}

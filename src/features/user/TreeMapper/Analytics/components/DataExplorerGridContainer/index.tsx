import { Grid } from '@mui/material';
import { Counter } from '../Counter';
import { Export } from '../Export';
import { SpeciesPlanted } from '../SpeciesPlanted';
import { TreePlanted } from '../TreePlanted';
import styles from './index.module.scss';
import { MapContainer } from '../Map';

export const DataExplorerGridContainer = () => {
  return (
    <div className={styles.graphsContainer}>
      <Grid container alignContent="center" justifyContent="center" spacing={6}>
        <Grid item xs={12} md={12}>
          <Counter />
        </Grid>
        <Grid item xs={12} md={12}>
          <MapContainer />
        </Grid>
        <Grid item xs={12} md={12}>
          <TreePlanted />
        </Grid>
        <Grid item xs={12} md={12}>
          <SpeciesPlanted />
        </Grid>
        <Grid item xs={12} md={12}>
          <Export />
        </Grid>
      </Grid>
    </div>
  );
};

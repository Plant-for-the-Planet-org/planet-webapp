import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import i18next from '../../../../../i18n';
import styles from './MapLoading.module.scss';

const { useTranslation } = i18next;

export default function MapLoading(isMapDataLoading: any) {
  const { t, ready } = useTranslation(['maps']);

  return ready ? (
    <Backdrop className={styles.progressBackdrop} open={isMapDataLoading}>
      <CircularProgress color="inherit" />
      <h2 className={styles.progressBackdropHeader}>Fetching Map Data</h2>
    </Backdrop>
  ) : null;
}

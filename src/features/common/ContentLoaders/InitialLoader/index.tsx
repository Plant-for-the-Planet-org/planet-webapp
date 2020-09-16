import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './../Donations/PaymentProgress.module.scss';
// import seeding from './../../../../assets/animations/seeding.gif'
export default function InitialLoader() {
  return (
    <Backdrop className={styles.progressBackdrop} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

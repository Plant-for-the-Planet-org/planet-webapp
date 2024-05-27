import { NoContributionsIcon } from '../../../../../public/assets/images/icons/ProfilePageV2Icons';
import styles from './communityContributions.module.scss';

const NoContributions = () => {
  return (
    <div className={styles.noContributionsContainer}>
      <NoContributionsIcon />
      <span>Oops! No contributions to show yet</span>
    </div>
  );
};

export default NoContributions;

import {
  MyContributionsSingleRegistration,
  MyForestProject,
} from '../../../common/types/myForestv2';
import ItemImage from './ItemImage';
import styles from './MyContributions.module.scss';
import RegistrationSummary from './RegistrationSummary';

interface Props {
  project?: MyForestProject;
  contributionDetails: MyContributionsSingleRegistration;
}

const RegistrationItemCard = ({ project, contributionDetails }: Props) => {
  return (
    <article className={styles.registrationItemCard}>
      <div className={styles.cardContent}>
        <ItemImage {...(project ? { imageUrl: project.image } : {})} />
        <div className={styles.itemInfo}>
          <RegistrationSummary
            treeCount={contributionDetails.totalContributionUnits}
            country={contributionDetails.country}
            registrationDate={contributionDetails.contributions[0].plantDate}
          />
        </div>
      </div>
    </article>
  );
};

export default RegistrationItemCard;

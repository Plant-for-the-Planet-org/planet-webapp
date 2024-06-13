import { ComponentProps } from 'react';
import getImageUrl from '../../../../utils/getImageURL';
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

export type RegistrationItemCardProps = ComponentProps<
  typeof RegistrationItemCard
>;

const RegistrationItemCard = ({ project, contributionDetails }: Props) => {
  const imageSource = project?.image
    ? getImageUrl('project', 'medium', project.image)
    : '';

  return (
    <article className={styles.registrationItemCard}>
      <div className={styles.cardContent}>
        <ItemImage {...(project ? { imageUrl: imageSource } : {})} />
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

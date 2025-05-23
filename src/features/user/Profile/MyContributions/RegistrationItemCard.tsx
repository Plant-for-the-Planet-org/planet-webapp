import type { ComponentProps } from 'react';
import type {
  MyContributionsSingleRegistration,
  MyForestProject,
} from '../../../common/types/myForest';
import getImageUrl from '../../../../utils/getImageURL';

import ItemImage from './ItemImage';
import styles from './MyContributions.module.scss';
import RegistrationSummary from './RegistrationSummary';

interface Props {
  project?: MyForestProject;
  registrationDetails: MyContributionsSingleRegistration;
}

export type RegistrationItemCardProps = ComponentProps<
  typeof RegistrationItemCard
>;

const RegistrationItemCard = ({ project, registrationDetails }: Props) => {
  const imageSource = project?.image
    ? getImageUrl('project', 'medium', project.image)
    : '';

  return (
    <article className={styles.registrationItemCard}>
      <div className={styles.cardContent}>
        <ItemImage {...(project ? { imageUrl: imageSource } : {})} />
        <div className={styles.itemInfo}>
          <RegistrationSummary
            treeCount={registrationDetails.totalRegisteredUnits}
            country={registrationDetails.country}
            registrationDate={registrationDetails.registrations[0].plantDate}
          />
        </div>
      </div>
    </article>
  );
};

export default RegistrationItemCard;

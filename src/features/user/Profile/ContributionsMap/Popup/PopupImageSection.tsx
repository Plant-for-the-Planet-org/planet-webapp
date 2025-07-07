import type { PointFeature } from 'supercluster';
import type { DonationProperties } from '../../../../common/types/myForest';

import { useTranslations } from 'next-intl';
import getImageUrl from '../../../../../utils/getImageURL';
import styles from '../ContributionsMap.module.scss';

const PopupImageSection = ({
  superclusterResponse,
}: {
  superclusterResponse: PointFeature<DonationProperties>;
}) => {
  const t = useTranslations('Profile.donatePopup');
  const { image, name } = superclusterResponse.properties.projectInfo;

  const truncateString = (str: string, maxLength: number) => {
    if (str.length <= maxLength) {
      return str;
    }
    return str.slice(0, maxLength) + '...';
  };
  const projectName = truncateString(name, 35);
  return (
    <div className={styles.imageContainer}>
      <img
        alt="projectImage"
        src={getImageUrl('project', 'medium', image)}
        width={'fit-content'}
        className={styles.popupProjectImage}
      />
      <div className={styles.projectImageInfoContainer}>
        <div className={styles.projectName}>
          {t('projectName', {
            name: projectName,
          })}
        </div>
      </div>
    </div>
  );
};

export default PopupImageSection;

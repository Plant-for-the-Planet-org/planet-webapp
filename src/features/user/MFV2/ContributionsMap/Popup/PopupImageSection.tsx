import { useTranslations } from 'next-intl';
import getImageUrl from '../../../../../utils/getImageURL';
import ProjectTypeIcon from '../../../../projects/components/ProjectTypeIcon';
import style from '../MyForestV2.module.scss';
import { PointFeature } from 'supercluster';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';

const PopupImageSection = ({
  superclusterResponse,
}: {
  superclusterResponse: PointFeature<DonationProperties>;
}) => {
  const t = useTranslations('Profile.donatePopup');
  const { image, classification, name, purpose } =
    superclusterResponse.properties.projectInfo;

  const truncateString = (str: string, maxLength: number) => {
    if (str.length <= maxLength) {
      return str;
    }
    return str.slice(0, maxLength) + '...';
  };
  const projectName = truncateString(name, 35);
  return (
    <div className={style.imageContainer}>
      <img
        alt="projectImage"
        src={getImageUrl('project', 'medium', image)}
        width={'fit-content'}
        className={style.popupProjctImage}
      />
      <div className={style.projectImageInfoContainer}>
        <div className={style.projectName}>
          {t('projectName', {
            name: projectName,
          })}
        </div>
      </div>
    </div>
  );
};

export default PopupImageSection;

import { useTranslations } from 'next-intl';
import getImageUrl from '../../../../../utils/getImageURL';
import style from '../ContributionsMap.module.scss';
import { PointFeature } from 'supercluster';
import { DonationProperties } from '../../../../common/types/myForestv2';

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
    <div className={style.imageContainer}>
      <img
        alt="projectImage"
        src={getImageUrl('project', 'medium', image)}
        width="fit-content"
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

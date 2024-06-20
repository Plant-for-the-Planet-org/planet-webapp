import { useTranslations } from 'next-intl';
import getImageUrl from '../../../../../utils/getImageURL';
import ProjectTypeIcon from '../../../../projects/components/ProjectTypeIcon';
import style from '../MyForestV2.module.scss';
import { PointFeature } from 'supercluster';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';

const ProjectimageSection = ({
  superclusterResponse,
}: {
  superclusterResponse: PointFeature<DonationProperties>;
}) => {
  const t = useTranslations('Profile');
  const {
    image,
    classification,
    name: projectName,
    purpose,
  } = superclusterResponse.properties.projectInfo;

  return (
    <div className={style.imageContainer}>
      <img
        alt="projectImage"
        src={getImageUrl('project', 'medium', image)}
        width={'fit-content'}
        className={style.popupProjctImage}
      />
      <div className={style.projectImageInfoContainer}>
        <div className={style.classificationContainer}>
          <div className={style.classificationIcon}>
            <ProjectTypeIcon
              projectType={
                purpose === 'conservation' ? purpose : classification
              }
            />
          </div>
          <div className={style.classification}>
            {t('myForestMapV.classification', {
              classification: classification,
            })}
          </div>
        </div>
        <div className={style.projectName}>
          {t('myForestMapV.projectName', {
            name: projectName,
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectimageSection;

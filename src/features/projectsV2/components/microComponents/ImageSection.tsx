import { useContext } from 'react';
import { useRouter } from 'next/router';
import { useTranslations, useLocale } from 'next-intl';
import getImageUrl from '../../../../utils/getImageURL';
import ProjectBadge from './ProjectBadge';
import ProjectTypeIcon from './ProjectTypeIcon';
import { truncateString } from '../../../../utils/getTruncatedString';
import CustomTooltip from '../../../common/Layout/CustomTooltip';
import VerifiedIcon from '@mui/icons-material/Verified';
import TopProjectReports from '../../../projects/components/projectDetails/TopProjectReports';
import style from '../../styles/ProjectSnippet.module.scss';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import { ImageSectionProps } from '../ProjectSnippet';

const ImageSection = (props: ImageSectionProps) => {
  const {
    projectName,
    image,
    slug,
    ecosystem,
    showPopup,
    projectReviews,
    purpose,
    classification,
    isApproved,
    isTopProject,
    allowDonations,
  } = props;
  const tManageProjects = useTranslations('ManageProjects');
  const tDonate = useTranslations('Donate');
  const router = useRouter();
  const locale = useLocale();
  const { embed, callbackUrl } = useContext(ParamsContext);

  const handleImageClick = () => {
    router.push(
      `/${locale}/prd/${slug}/${
        embed === 'true'
          ? `${
              callbackUrl != undefined
                ? `?embed=true&callback=${callbackUrl}`
                : '?embed=true'
            }`
          : ''
      }`
    );
  };
  const imageSource = image ? getImageUrl('project', 'medium', image) : '';
  return (
    <div onClick={handleImageClick} className={style.projectImage}>
      <ProjectBadge
        isApproved={isApproved}
        allowDonations={allowDonations}
        isTopProject={isTopProject}
      />
      {image && typeof image !== 'undefined' ? (
        <>
          <img
            alt="projectImage"
            src={imageSource}
            width={'fit-content'}
            className={style.projectImageFile}
          />
          <div className={style.gradientOverlay} />
        </>
      ) : null}

      <div className={style.projectImageBlock}>
        <div className={style.projectEcosystemOrTypeContainer}>
          <div className={style.projectTypeIcon}>
            <ProjectTypeIcon
              projectType={
                purpose === 'conservation' ? 'conservation' : classification
              }
            />
          </div>
          <div>
            {ecosystem !== null && (
              <div className={style.projectEcosystem}>
                {tManageProjects(`ecosystemTypes.${ecosystem}`)}
                {' /'}
              </div>
            )}
            <div className={style.projectType}>
              {classification && tDonate(classification)}
            </div>
          </div>
        </div>
        <p className={style.projectName}>
          {truncateString(projectName, 30)}
          {isApproved && (
            <CustomTooltip
              showPopup={showPopup}
              triggerElement={
                <span className={style.verifiedIcon}>
                  <VerifiedIcon sx={{ width: '100%' }} />
                </span>
              }
            >
              <div className={style.topProjectReportsContainer}>
                <TopProjectReports projectReviews={projectReviews} />
              </div>
            </CustomTooltip>
          )}
        </p>
      </div>
    </div>
  );
};

export default ImageSection;

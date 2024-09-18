import { useCallback, useContext, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { useTranslations, useLocale } from 'next-intl';
import getImageUrl from '../../../../utils/getImageURL';
import ProjectBadge from './ProjectBadge';
import ProjectTypeIcon from '../../../common/ProjectTypeIcon';
import { truncateString } from '../../../../utils/getTruncatedString';
import CustomTooltip from '../../../common/Layout/CustomTooltip';
import VerifiedIcon from '@mui/icons-material/Verified';
import TopProjectReports from '../../../projects/components/projectDetails/TopProjectReports';
import styles from '../styles/ProjectSnippet.module.scss';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import { ImageSectionProps } from '..';
import BackButton from '../../../../../public/assets/images/icons/BackButton';

const ImageSection = (props: ImageSectionProps) => {
  const {
    projectName,
    image,
    slug,
    ecosystem,
    showTooltipPopups,
    projectReviews,
    purpose,
    classification,
    isApproved,
    isTopProject,
    allowDonations,
    page,
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
  const handleBackButton = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    if (window.history.length > 0) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }, []);
  const imageSource = image ? getImageUrl('project', 'medium', image) : '';
  const imageContainerClasses = `${styles.projectImage} ${
    page === 'project-details' ? styles.projectImageSecondary : ''
  }`;
  return (
    <div onClick={handleImageClick} className={imageContainerClasses}>
      {page === 'project-details' && (
        <button onClick={handleBackButton} className={styles.backButton}>
          <BackButton />
        </button>
      )}
      <ProjectBadge
        isApproved={isApproved}
        allowDonations={allowDonations}
        isTopProject={isTopProject}
        showTooltipPopups={showTooltipPopups}
      />
      {image && typeof image !== 'undefined' ? (
        <>
          <img
            alt={'projectImage'}
            src={imageSource}
            width={'fit-content'}
            className={styles.projectImageFile}
          />
          <div className={styles.gradientOverlay} />
        </>
      ) : null}

      <div className={styles.projectImageBlock}>
        <div className={styles.projectEcosystemOrTypeContainer}>
          <div className={styles.projectTypeIcon}>
            <ProjectTypeIcon
              projectType={
                purpose === 'conservation' ? 'conservation' : classification
              }
            />
          </div>
          <div>
            {ecosystem !== null && (
              <div className={styles.projectEcosystem}>
                {tManageProjects(`ecosystemTypes.${ecosystem}`)}
                {' /'}
              </div>
            )}
            <div className={styles.projectType}>
              {classification && tDonate(classification)}
            </div>
          </div>
        </div>
        <div className={styles.projectName}>
          {truncateString(projectName, 30)}
          {isApproved && (
            <CustomTooltip
              showTooltipPopups={showTooltipPopups}
              triggerElement={
                <span className={styles.verifiedIcon}>
                  <VerifiedIcon sx={{ width: '100%' }} />
                </span>
              }
            >
              <div className={styles.topProjectReportsContainer}>
                <TopProjectReports projectReviews={projectReviews} />
              </div>
            </CustomTooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSection;

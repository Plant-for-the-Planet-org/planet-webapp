import type { MouseEvent } from 'react';
import type { ImageSectionProps } from '..';

import { useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import getImageUrl from '../../../../utils/getImageURL';
import ProjectBadge from './ProjectBadge';
import ProjectTypeIcon from '../../../common/ProjectTypeIcon';
import { truncateString } from '../../../../utils/getTruncatedString';
import CustomTooltip from '../../../common/Layout/CustomTooltip';
import VerifiedIcon from '@mui/icons-material/Verified';
import TopProjectReports from './TopProjectReports';
import styles from '../styles/ProjectSnippet.module.scss';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { clsx } from 'clsx';

const MAX_NAME_LENGTH = 32;

const ImageSection = (props: ImageSectionProps) => {
  const {
    projectName,
    image,
    ecosystem,
    showTooltipPopups,
    projectReviews,
    purpose,
    classification,
    isApproved,
    isTopProject,
    allowDonations,
    page,
    setPreventShallowPush,
  } = props;

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const tProjectsCommon = useTranslations('Project');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { embed, callbackUrl, showBackIcon } = useContext(ParamsContext);
  const isEmbed = embed === 'true';
  const showBackButton =
    page === 'project-details' && !(isEmbed && showBackIcon === 'false');

  const handleBackButton = () => {
    if (setPreventShallowPush) setPreventShallowPush(true);

    const previousPageRoute = sessionStorage.getItem('backNavigationUrl');
    const defaultRoute = `/`;

    const baseRoute = previousPageRoute || defaultRoute;
    const isAbsoluteUrl =
      baseRoute.startsWith('http://') || baseRoute.startsWith('https://');

    // Get the final route, localizing relative path
    const path = isAbsoluteUrl
      ? baseRoute.split('?')[0] // For absolute URLs, just strip query params
      : localizedPath(baseRoute);

    // Cleans up internal routing parameters like `locale`, `slug` etc.
    const pathWithoutQuery = path.split('?')[0];
    // Handle query parameters for the new navigation
    const queryParams = isEmbed
      ? {
          embed: 'true',
          ...(callbackUrl !== undefined && { callback: callbackUrl }),
        }
      : {};

    // Navigate and clean up
    router
      .push({
        pathname: pathWithoutQuery,
        query: isAbsoluteUrl ? {} : queryParams,
      })
      .then(() => sessionStorage.removeItem('backNavigationUrl'))
      .catch((error) => {
        console.error('Navigation failed:', error);
      });
  };

  const imageSource = image ? getImageUrl('project', 'medium', image) : '';
  const imageContainerClasses = clsx(styles.projectImage, {
    [styles.projectImageSecondary]: page === 'project-details',
  });
  const isNameTruncated = projectName.length >= MAX_NAME_LENGTH;
  const truncatedProjectName = truncateString(projectName, MAX_NAME_LENGTH);
  const isTouchDevice =
    typeof window !== 'undefined' && 'ontouchstart' in window;
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (isTouchDevice) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [isTouchDevice]
  );
  const projectNameElement = (
    <span onClick={handleClick}>
      {isNameTruncated ? truncatedProjectName : projectName}
    </span>
  );

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setHasError(true);
  };

  return (
    <div className={imageContainerClasses}>
      {showBackButton && (
        <button onClick={handleBackButton} className={styles.backButton}>
          <BackButton />
        </button>
      )}
      <ProjectBadge
        isApproved={isApproved}
        allowDonations={allowDonations}
        isTopProject={isTopProject}
        showTooltipPopups={showTooltipPopups}
        page={page}
      />

      {/* Loading state */}
      {isImageLoading && (
        <img
          alt="loading"
          src="/assets/images/project-contribution-default-landscape.png"
          className={styles.projectImageFile}
        />
      )}

      {/* Main image */}
      {image && typeof image !== 'undefined' && (
        <img
          alt={'projectImage'}
          src={imageSource}
          className={clsx(styles.projectImageFile, {
            [styles.hidden]: isImageLoading,
          })}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Error/fallback state */}
      {(hasError || !image) && (
        <img
          alt="fallback"
          src="/assets/images/project-contribution-default-landscape.png"
          className={styles.projectImageFile}
        />
      )}

      {/* Gradient overlay */}
      <div className={styles.gradientOverlay} />

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
                {tProjectsCommon(`ecosystem.${ecosystem}`)}
                {' /'}
              </div>
            )}
            <div className={styles.projectType}>
              {classification &&
                tProjectsCommon(`classification.${classification}`)}
            </div>
          </div>
        </div>
        <div className={styles.projectName}>
          {isNameTruncated ? (
            <CustomTooltip
              showTooltipPopups={showTooltipPopups}
              triggerElement={projectNameElement}
            >
              <div className={styles.projectNameTooltip}>{projectName}</div>
            </CustomTooltip>
          ) : (
            projectNameElement
          )}
          {isApproved && (
            <CustomTooltip
              showTooltipPopups={
                page !== 'project-details' && showTooltipPopups
              }
              triggerElement={
                <span className={styles.verifiedIcon} onClick={handleClick}>
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

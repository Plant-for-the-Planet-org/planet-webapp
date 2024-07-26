import { useRouter } from 'next/router';
import { useTranslations, useLocale } from 'next-intl';
import { CommonProps } from '../ProjectSnippet';
import { EcosystemTypes, Review } from '@planet-sdk/common';
import getImageUrl from '../../../../utils/getImageURL';
import ProjectBadge from './ProjectBadge';
import ProjectTypeIcon from './ProjectTypeIcon';
import { truncateString } from '../../../../utils/getTruncatedString';
import CustomTooltip from '../../../common/Layout/CustomTooltip';
import VerifiedIcon from '@mui/icons-material/Verified';
import TopProjectReports from '../../../projects/components/projectDetails/TopProjectReports';
import style from '../../styles/ProjectSnippet.module.scss';

type Classification =
  | 'large-scale-planting'
  | 'agroforestry'
  | 'natural-regeneration'
  | 'managed-regeneration'
  | 'urban-planting'
  | 'other-planting'
  | 'mangroves';
interface ImageProps extends CommonProps {
  projectName: string;
  image: string;
  ecosystem: EcosystemTypes | null;
  shouldDisplayPopup: boolean;
  projectReviews: Review[] | undefined;
  classification: Classification;
}

const ImageSection = (props: ImageProps) => {
  const {
    projectName,
    image,
    ecosystem,
    shouldDisplayPopup,
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

  const handleImageClick = () => {
    router.push(`/${locale}/prd/xyz`);
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
              shouldDisplayPopup={shouldDisplayPopup}
              badgeContent={
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

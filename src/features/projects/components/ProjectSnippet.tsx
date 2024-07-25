import React, { ReactElement, useContext } from 'react';
import {
  ConservationProjectConcise,
  ConservationProjectExtended,
  CountryCode,
  CurrencyCode,
  EcosystemTypes,
  Review,
  TreeProjectConcise,
  TreeProjectExtended,
} from '@planet-sdk/common';
import { useRouter } from 'next/router';
import { useLocale, useTranslations } from 'next-intl';
import getImageUrl from '../../../utils/getImageURL';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { truncateString } from '../../../utils/getTruncatedString';
import { useProjectProps } from '../../common/Layout/ProjectPropsContext';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { getDonationUrl } from '../../../utils/getDonationUrl';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import VerifiedBadge from './VerifiedBadge';
import ProjectTypeIcon from './ProjectTypeIcon';
import { useTenant } from '../../common/Layout/TenantContext';
import ProjectBadge from '../../../temp/ProjectBadge/ProjectBadge';
import WebappButton from '../../common/WebappButton';

interface Props {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
  displayPopup: boolean;
}

type Classification =
  | 'large-scale-planting'
  | 'agroforestry'
  | 'natural-regeneration'
  | 'managed-regeneration'
  | 'urban-planting'
  | 'other-planting'
  | 'mangroves';
interface CommonProps {
  slug: string;
  isApproved: boolean;
  isTopProject: boolean;
  allowDonations: boolean;
  purpose: 'trees' | 'conservation';
}
interface ImageProps extends CommonProps {
  projectName: string;
  image: string;
  ecosystem: EcosystemTypes | null;
  displayPopup: boolean;
  projectReviews: Review[] | undefined;
  classification: Classification;
}

interface ProjectInfoProps extends CommonProps {
  unitType: 'm2' | 'tree';
  countPlanted: number;
  unitCost: number;
  country: CountryCode;
  currency: CurrencyCode;
}

const ImageSection = (props: ImageProps) => {
  const {
    slug,
    projectName,
    image,
    ecosystem,
    displayPopup,
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
  const { selectedPl, hoveredPl, setSelectedSite } = useProjectProps();
  const { embed, callbackUrl } = useContext(ParamsContext);

  const handleImageClick = () => {
    setSelectedSite(0);
    router.push(
      `/${locale}/${slug}/${
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
    <div
      onClick={handleImageClick}
      className={`projectImage ${
        selectedPl || hoveredPl ? 'projectCollapsed' : ''
      }`}
    >
      {image && typeof image !== 'undefined' ? (
        <img
          alt="projectImage"
          src={imageSource}
          width={'fit-content'}
          className="projectImageFile"
        />
      ) : null}
      <ProjectBadge
        isApproved={isApproved}
        allowDonations={allowDonations}
        isTopProject={isTopProject}
      />
      <div className={'projectImageBlock'}>
        <div className={'projectEcosystemOrTypeContainer'}>
          <div className={'projectTypeIcon'}>
            <ProjectTypeIcon
              projectType={
                purpose === 'conservation' ? 'conservation' : classification
              }
            />
          </div>
          <div>
            {ecosystem !== null && (
              <div className={'projectEcosystem'}>
                {tManageProjects(`ecosystemTypes.${ecosystem}`)}
                {' /'}
              </div>
            )}
            <div className={'projectType'}>
              {classification && tDonate(classification)}
            </div>
          </div>
        </div>
        <p className={'projectName'}>
          {truncateString(projectName, 30)}
          {isApproved && (
            <VerifiedBadge
              displayPopup={displayPopup}
              projectReviews={projectReviews}
            />
          )}
        </p>
      </div>
    </div>
  );
};

const ProjectInfoSection = (props: ProjectInfoProps) => {
  const {
    slug,
    isApproved,
    isTopProject,
    countPlanted,
    purpose,
    unitType,
    unitCost,
    allowDonations,
    country,
    currency,
  } = props;
  const tDonate = useTranslations('Donate');
  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const { tenantConfig } = useTenant();
  const { token } = useUserProps();
  const locale = useLocale();
  const { embed, callbackUrl } = useContext(ParamsContext);

  const donateLink = getDonationUrl(
    tenantConfig.id,
    slug,
    token,
    embed || undefined,
    callbackUrl || undefined
  );

  const donateButtonClass =
    isTopProject && isApproved ? 'topApproved' : 'topUnapproved';

  return (
    <div className={'projectInfo'}>
      <div className={'projectData'}>
        <div className={'targetLocation'}>
          <div className={'target'}>
            {purpose === 'trees' && countPlanted > 0 && (
              <>
                {localizedAbbreviatedNumber(locale, Number(countPlanted), 1)}{' '}
                {unitType === 'tree'
                  ? tCommon('tree', {
                      count: Number(countPlanted),
                    })
                  : tCommon('m2')}{' '}
                •{' '}
              </>
            )}
            <span className="country">
              {tCountry(country.toLowerCase() as Lowercase<CountryCode>)}
            </span>
          </div>
        </div>
        {allowDonations && (
          <div className={'perUnitCost'}>
            {getFormatedCurrency(locale, currency, unitCost)}{' '}
            <span>
              {unitType === 'tree' ? tDonate('perTree') : tDonate('perM2')}
            </span>
          </div>
        )}
      </div>

      {allowDonations && (
        <WebappButton
          variant="primary"
          text={tCommon('donate')}
          elementType="link"
          href={donateLink}
          target={embed ? '_top' : '_blank'}
          buttonClasses={donateButtonClass}
        />
      )}
    </div>
  );
};

export default function ProjectSnippet({
  project,
  displayPopup,
}: Props): ReactElement {
  const router = useRouter();
  const tCommon = useTranslations('Common');
  const { embed } = useContext(ParamsContext);
  const progressPercentage =
    project.purpose === 'trees' && project.countTarget
      ? Math.min((project.countPlanted / project.countTarget) * 100, 100)
      : 0;
  const ecosystem =
    project._scope === 'map' ? project.ecosystem : project.metadata.ecosystem;
  const _isTopProject = (project as TreeProjectConcise).isTopProject;
  const _isApproved = (project as TreeProjectConcise).isApproved;

  const handleClick = () => {
    if (embed === 'true') {
      window.open(`/t/${project.tpo.slug}`, '_top');
    } else {
      router.push(`/t/${project.tpo.slug}`);
    }
  };

  const getBackgroundClass = () => {
    if (!project.allowDonations) return 'no-donation';
    if (_isTopProject && _isApproved) return 'top-approved';
    return '';
  };

  const progressBarBackgroundColor =
    _isTopProject && _isApproved
      ? 'topApproved'
      : project.allowDonations
      ? 'topUnapproved'
      : 'notDonatable';
  const commonProps = {
    slug: project.slug,
    isApproved: _isApproved,
    isTopProject: _isTopProject,
    allowDonations: project.allowDonations,
    purpose: project.purpose,
  };
  const imageProps = {
    ...commonProps,
    projectName: project.name,
    image: project.image,
    ecosystem: ecosystem,
    displayPopup: displayPopup,
    projectReviews: project.reviews,
    classification: (project as TreeProjectConcise).classification,
  };
  const projectInfoProps = {
    ...commonProps,
    unitType: project.unitType,
    countPlanted: (project as TreeProjectConcise).countPlanted,
    unitCost: project.unitCost,
    country: project.country,
    currency: project.currency,
  };

  return (
    <div className={'singleProject'}>
      <ImageSection {...imageProps} />
      <div className={'progressBar'}>
        <div
          className={`progressBarHighlight ${progressBarBackgroundColor}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <ProjectInfoSection {...projectInfoProps} />
      <div
        className={`projectTPOName ${getBackgroundClass()}`}
        onClick={handleClick}
      >
        {tCommon('by', {
          tpoName: project.tpo.name,
        })}
      </div>
    </div>
  );
}

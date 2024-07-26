import React, { ReactElement, useContext } from 'react';
import {
  ConservationProjectConcise,
  ConservationProjectExtended,
  TreeProjectConcise,
  TreeProjectExtended,
} from '@planet-sdk/common';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import ProjectInfoSection from './microComponents/ProjectInfoSection';
import ImageSection from './microComponents/ImageSection';
import style from '../styles/ProjectSnippet.module.scss';

interface Props {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
  shouldDisplayPopup: boolean;
}

export interface CommonProps {
  slug: string;
  isApproved: boolean;
  isTopProject: boolean;
  allowDonations: boolean;
  purpose: 'trees' | 'conservation';
}

export default function ProjectSnippet({
  project,
  shouldDisplayPopup,
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
    if (!project.allowDonations) return `${style.noDonation}`;
    if (_isTopProject && _isApproved) return `${style.tpoBackground}`;
    return '';
  };

  const progressBarClass =
    _isTopProject && _isApproved
      ? `${style.topApproved}`
      : project.allowDonations
      ? `${style.topUnapproved}`
      : `${style.notDonatable}`;

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
    shouldDisplayPopup: shouldDisplayPopup,
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
    <div className={style.singleProject}>
      <ImageSection {...imageProps} />
      <div className={style.progressBar}>
        <div
          className={`${style.progressBarHighlight} ${progressBarClass}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <ProjectInfoSection {...projectInfoProps} />
      <div
        className={`${style.projectTPOName} ${getBackgroundClass()}`}
        onClick={handleClick}
      >
        {tCommon('by', {
          tpoName: project.tpo.name,
        })}
      </div>
    </div>
  );
}

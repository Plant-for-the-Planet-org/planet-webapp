import React, { ReactElement, useContext, useMemo } from 'react';
import {
  ConservationProjectConcise,
  ConservationProjectExtended,
  TreeProjectConcise,
  TreeProjectExtended,
  EcosystemTypes,
  Review,
  TreeProjectClassification,
  CountryCode,
  CurrencyCode,
} from '@planet-sdk/common';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import ProjectInfoSection from './microComponents/ProjectInfoSection';
import ImageSection from './microComponents/ImageSection';
import style from '../styles/ProjectSnippet.module.scss';
import { getProjectCategory } from '../ProjectsMap/utils';

interface Props {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
  showPopup: boolean;
}

export interface CommonProps {
  slug: string;
  isApproved: boolean;
  isTopProject: boolean;
  allowDonations: boolean;
  purpose: 'trees' | 'conservation';
}

export interface ImageSectionProps extends CommonProps {
  projectName: string;
  image: string;
  ecosystem: EcosystemTypes | null;
  showPopup: boolean;
  projectReviews: Review[] | undefined;
  classification: TreeProjectClassification;
}

export interface ProjectInfoProps extends CommonProps {
  unitType: 'm2' | 'tree';
  unitsContributed: number;
  unitCost: number;
  country: CountryCode;
  currency: CurrencyCode;
  slug: string;
}

export default function ProjectSnippet({
  project,
  showPopup,
}: Props): ReactElement {
  const router = useRouter();
  const tCommon = useTranslations('Common');
  const { embed } = useContext(ParamsContext);

  const ecosystem =
    project._scope === 'map' ? project.ecosystem : project.metadata.ecosystem;
  const isTopProject = project.purpose === 'trees' && project.isTopProject;
  const isApproved = project.purpose === 'trees' && project.isApproved;

  const progressPercentage = useMemo(() => {
    if (project.purpose === 'trees' && project.countTarget) {
      return Math.min((project.countPlanted / project.countTarget) * 100, 100);
    }
    return 0;
  }, [
    project.purpose === 'trees' && project.countPlanted,
    project.countTarget,
  ]);

  const tpoNameBackgroundClass = useMemo(() => {
    if (!project.allowDonations) return `${style.noDonation}`;
    if (isTopProject && isApproved) return `${style.tpoBackground}`;
    return '';
  }, [isTopProject, isApproved, project.allowDonations]);

  const progressBarClass = useMemo(() => {
    if (project.purpose === 'trees') {
      return `${style[getProjectCategory(project as TreeProjectConcise)]}`;
    }
  }, [
    project.purpose,
    project.purpose === 'trees' && (project.isTopProject, project.isApproved),
    project.allowDonations,
  ]);

  const handleClick = () => {
    if (embed === 'true') {
      window.open(`/t/${project.tpo.slug}`, '_top');
    } else {
      router.push(`/t/${project.tpo.slug}`);
    }
  };

  const commonProps: CommonProps = {
    slug: project.slug,
    isApproved: isApproved,
    isTopProject: isTopProject,
    allowDonations: project.allowDonations,
    purpose: project.purpose,
  };
  const imageProps: ImageSectionProps = {
    ...commonProps,
    projectName: project.name,
    image: project.image,
    ecosystem: ecosystem,
    showPopup: showPopup,
    projectReviews: project.reviews,
    classification: (project as TreeProjectConcise).classification,
  };
  const projectInfoProps: ProjectInfoProps = {
    ...commonProps,
    unitType: project.unitType,
    unitsContributed:
      project.unitsContributed?.m2 || project.unitsContributed?.tree,
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
        className={`${style.projectTPOName} ${tpoNameBackgroundClass}`}
        onClick={handleClick}
      >
        {tCommon('by', {
          tpoName: project.tpo.name,
        })}
      </div>
    </div>
  );
}

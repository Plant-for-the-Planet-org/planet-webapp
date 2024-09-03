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
import styles from './styles/ProjectSnippet.module.scss';
import { getProjectCategory } from '../ProjectsMap/utils';

interface Props {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
  showBackButton: boolean;
  showTooltipPopups: boolean;
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
  showBackButton: boolean;
  showTooltipPopups: boolean;
  projectReviews: Review[] | undefined;
  classification: TreeProjectClassification;
}

export interface ProjectInfoProps extends CommonProps {
  unitType: 'm2' | 'tree';
  unitCount: number | undefined;
  unitCost: number;
  country: CountryCode;
  currency: CurrencyCode;
  slug: string;
}

export default function ProjectSnippet({
  project,
  showTooltipPopups,
  showBackButton,
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
    if (!project.allowDonations) return `${styles.noDonation}`;
    if (isTopProject && isApproved) return `${styles.tpoBackground}`;
    return '';
  }, [isTopProject, isApproved, project.allowDonations]);

  const progressBarClass = useMemo(() => {
    return `${styles[getProjectCategory(project)]}`;
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
    showTooltipPopups: showTooltipPopups,
    projectReviews: project.reviews,
    classification: (project as TreeProjectConcise).classification,
    showBackButton,
  };
  const projectInfoProps: ProjectInfoProps = {
    ...commonProps,
    unitType: project.unitType,
    unitCount:
      project.unitType === 'tree'
        ? project.unitsContributed?.tree
        : project.unitsContributed?.m2,
    unitCost: project.unitCost,
    country: project.country,
    currency: project.currency,
  };

  return (
    <div className={styles.singleProject}>
      <ImageSection {...imageProps} />
      <div className={styles.progressBar}>
        <div
          className={`${styles.progressBarHighlight} ${progressBarClass}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <ProjectInfoSection {...projectInfoProps} />
      <div
        className={`${styles.projectTPOName} ${tpoNameBackgroundClass}`}
        onClick={handleClick}
      >
        {tCommon('by', {
          tpoName: project.tpo.name,
        })}
      </div>
    </div>
  );
}

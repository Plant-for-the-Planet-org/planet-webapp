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
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import ProjectInfoSection from './microComponents/ProjectInfoSection';
import ImageSection from './microComponents/ImageSection';
import styles from './styles/ProjectSnippet.module.scss';
import { getProjectCategory } from '../../../utils/projectV2';
import TpoName from './microComponents/TpoName';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/router';

interface Props {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
  showTooltipPopups: boolean;
  isMobile?: boolean;
  page?: 'project-list' | 'project-details';
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
  showTooltipPopups: boolean;
  projectReviews: Review[] | undefined;
  classification: TreeProjectClassification;
  page?: 'project-list' | 'project-details';
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
  isMobile,
  page,
}: Props): ReactElement {
  const { embed, callbackUrl } = useContext(ParamsContext);
  const locale = useLocale();
  const router = useRouter();
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

  const progressBarClass = useMemo(() => {
    return `${styles[getProjectCategory(project)]}`;
  }, [
    project.purpose,
    project.purpose === 'trees' && (project.isTopProject, project.isApproved),
    project.allowDonations,
  ]);

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
    page,
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
  const projectSnippetContainerClasses = `${styles.singleProject} ${
    page === 'project-details' && isMobile
      ? styles.projectDetailsSnippetMobile
      : ''
  }`;

  const navigateToProjectDetails = () => {
    let path = `/${locale}/prd/${project.slug}`;
    if (embed === 'true') {
      const params = new URLSearchParams({ embed: 'true' });
      if (callbackUrl !== undefined && typeof callbackUrl === 'string') {
        params.append('callback', callbackUrl);
      }
      path += `?${params.toString()}`;
    }
    router.push(path);
  };

  return (
    <>
      <div className={projectSnippetContainerClasses}>
        <button onClick={navigateToProjectDetails}>
          <ImageSection {...imageProps} />
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressBarHighlight} ${progressBarClass}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <ProjectInfoSection {...projectInfoProps} />
        </button>
        {!isMobile && (
          <TpoName
            projectTpoName={project.tpo.name}
            allowDonations={project.allowDonations}
            isTopProject={isTopProject}
            isApproved={isApproved}
            page={page}
            tpoSlug={project.tpo.slug}
            embed={embed}
          />
        )}
      </div>
      {isMobile && (
        <TpoName
          page={page}
          projectTpoName={project.tpo.name}
          allowDonations={project.allowDonations}
          isTopProject={isTopProject}
          isApproved={isApproved}
          tpoSlug={project.tpo.slug}
          embed={embed}
        />
      )}
    </>
  );
}

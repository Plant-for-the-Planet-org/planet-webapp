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
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import ProjectInfoSection from './microComponents/ProjectInfoSection';
import ImageSection from './microComponents/ImageSection';
import styles from './styles/ProjectSnippet.module.scss';
import { getProjectCategory } from '../ProjectsMap/utils';
import TpoName from './microComponents/TpoName';

interface Props {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
  showBackButton: boolean;
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
  showBackButton: boolean;
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
  showBackButton,
  isMobile,
  page,
}: Props): ReactElement {
  const router = useRouter();
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
    const url = `/t/${project.tpo.slug}`;
    if (embed === 'true') {
      window.open(url, '_top');
    } else {
      router.push(url);
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

  return (
    <>
      <div className={styles.singleProject}>
        <ImageSection {...imageProps} />
        {!isMobile && (
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressBarHighlight} ${progressBarClass}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
        <ProjectInfoSection {...projectInfoProps} />
        {!isMobile && (
          <TpoName
            tpoNameBackgroundClass={tpoNameBackgroundClass}
            handleClick={handleClick}
            projectTpoName={project.tpo.name}
          />
        )}
      </div>
      {isMobile && (
        <TpoName
          additionalClass={
            page === 'project-list' ? undefined : styles.projectTpoNameSecondary
          }
          tpoNameBackgroundClass={tpoNameBackgroundClass}
          handleClick={handleClick}
          projectTpoName={project.tpo.name}
        />
      )}
    </>
  );
}

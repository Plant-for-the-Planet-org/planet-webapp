import type { ReactElement } from 'react';
import type {
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

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ProjectInfoSection from './microComponents/ProjectInfoSection';
import ImageSection from './microComponents/ImageSection';
import styles from './styles/ProjectSnippet.module.scss';
import {
  generateProjectLink,
  getProjectCategory,
} from '../../../utils/projectV2';
import TpoName from './microComponents/TpoName';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { clsx } from 'clsx';
import { useQueryParamStore } from '../../../stores/queryParamStore';
import { useViewStore } from '../../../stores';

interface Props {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
  showTooltipPopups: boolean;
  isMobile?: boolean;
  utmCampaign?: string;
  disableDonations?: boolean;
}

type ProjectSnippetContentProps = Omit<Props, 'isMobile'>;
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
}

export interface ProjectInfoProps extends CommonProps {
  unitType: 'm2' | 'tree';
  unitCount: number | undefined;
  unitCost: number;
  country: CountryCode;
  currency: CurrencyCode;
  slug: string;
  utmCampaign?: string;
  disableDonations?: boolean;
}

const ProjectSnippetContent = ({
  project,
  showTooltipPopups,
  utmCampaign,
  disableDonations,
}: ProjectSnippetContentProps) => {
  const isTopProject = project.purpose === 'trees' && project.isTopProject;
  const isApproved = project.purpose === 'trees' && project.isApproved;
  const ecosystem =
    project._scope === 'map' ? project.ecosystem : project.metadata.ecosystem;
  const progressPercentage = useMemo(() => {
    if (
      project.purpose === 'trees' &&
      project.unitType === 'tree' &&
      project.unitsContributed?.tree &&
      project.unitsTargeted?.tree
    ) {
      return Math.min(
        (project.unitsContributed.tree / project.unitsTargeted.tree) * 100,
        100
      );
    }
    return 0;
  }, [
    project.purpose,
    project.unitType,
    project.unitsContributed,
    project.unitsTargeted,
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
    isApproved,
    isTopProject,
    allowDonations: project.allowDonations,
    purpose: project.purpose,
  };
  const imageProps: ImageSectionProps = {
    ...commonProps,
    projectName: project.name,
    image: project.image,
    ecosystem,
    showTooltipPopups,
    projectReviews: project.reviews,
    classification: (project as TreeProjectConcise).classification,
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
    utmCampaign,
    disableDonations,
  };
  return (
    <>
      <ImageSection {...imageProps} />
      <div className={styles.progressBar}>
        <div
          className={clsx(styles.progressBarHighlight, progressBarClass)}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <ProjectInfoSection {...projectInfoProps} />
    </>
  );
};

export default function ProjectSnippet({
  project,
  showTooltipPopups,
  isMobile,
  utmCampaign,
  disableDonations,
}: Props): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  const embed = useQueryParamStore((state) => state.embed);
  const callbackUrl = useQueryParamStore((state) => state.callbackUrl);
  const currentPage = useViewStore((state) => state.page);

  const isTopProject = project.purpose === 'trees' && project.isTopProject;
  const isApproved = project.purpose === 'trees' && project.isApproved;

  const projectSnippetContainerClasses = clsx(styles.singleProject, {
    [styles.projectDetailsSnippetMobile]:
      currentPage === 'project-details' && isMobile,
  });
  const ProjectSnippetContentProps = {
    showTooltipPopups,
    project,
    utmCampaign,
    disableDonations,
  };

  const tpoNameProps = {
    projectTpoName: project.tpo.name,
    allowDonations: project.allowDonations,
    isTopProject,
    isApproved,
    tpoSlug: project.tpo.slug,
    embed,
  };

  const projectPath = useMemo(() => {
    let path = generateProjectLink(project.slug, router.asPath);
    const params = new URLSearchParams();

    if (embed === 'true') {
      params.append('embed', 'true');
      if (callbackUrl !== undefined && typeof callbackUrl === 'string') {
        params.append('callback', callbackUrl);
      }
    }

    const paramsString = params.toString();
    if (paramsString)
      path += `${path.includes('?') ? '&' : '?'}${paramsString}`;

    return path;
  }, [project.slug, embed, callbackUrl, router.asPath]);

  // The useEffect hook checks if the backNavigationUrl query parameter exists and is a string, and if so,
  // it decodes this value and stores it in session storage
  useEffect(() => {
    if (
      router.query.backNavigationUrl &&
      typeof router.query.backNavigationUrl === 'string'
    ) {
      sessionStorage.setItem(
        'backNavigationUrl',
        decodeURIComponent(router.query.backNavigationUrl)
      );
    }
  }, [router.query]);
  return (
    <>
      <div className={projectSnippetContainerClasses}>
        {currentPage === 'project-details' ? (
          <ProjectSnippetContent {...ProjectSnippetContentProps} />
        ) : (
          <Link href={localizedPath(projectPath)} style={{ cursor: 'pointer' }}>
            <ProjectSnippetContent {...ProjectSnippetContentProps} />
          </Link>
        )}

        {!isMobile && <TpoName {...tpoNameProps} />}
      </div>
      {isMobile && <TpoName {...tpoNameProps} />}
    </>
  );
}

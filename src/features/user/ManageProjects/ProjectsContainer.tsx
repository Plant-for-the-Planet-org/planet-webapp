import type {
  APIError,
  CountryCode,
  ProfileProjectFeature,
  ProfileProjectPropertiesConservation,
  ProfileProjectPropertiesFund,
  ProfileProjectPropertiesTrees,
} from '@planet-sdk/common';
import type { VerificationStatus } from '../../common/types/project';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../public/assets/images/NotFound';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import getImageUrl from '../../../utils/getImageURL';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import styles from './ProjectsContainer.module.scss';
import GlobeContentLoader from '../../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import { useLocale, useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import DashboardView from '../../common/Layout/DashboardView';
import SingleColumnView from '../../common/Layout/SingleColumnView';
import { useRouter } from 'next/router';
import { generateProjectLink } from '../../../utils/projectV2';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useErrorHandlingStore } from '../../../stores/errorHandlingStore';

type ProjectProperties = (
  | ProfileProjectPropertiesFund
  | ProfileProjectPropertiesTrees
  | ProfileProjectPropertiesConservation
) & {
  /**
   * Sent by `/app/profile/projects` for the owner's own projects. Optional
   * because the SDK types describe the public listing, which omits it.
   */
  verificationStatus?: VerificationStatus;
};

/**
 * Label and colour for the review status shown on each card. Pre-rename statuses
 * map onto the same badge as the value that replaced them, so older projects read
 * the same as new ones.
 */
const VERIFICATION_STATUS_BADGES = {
  draft: { labelKey: 'statusDraft', tone: 'statusNeutral' },
  incomplete: { labelKey: 'statusDraft', tone: 'statusNeutral' },
  submitted: { labelKey: 'statusSubmitted', tone: 'statusInfo' },
  pending: { labelKey: 'statusSubmitted', tone: 'statusInfo' },
  in_review: { labelKey: 'statusInReview', tone: 'statusInfo' },
  processing: { labelKey: 'statusInReview', tone: 'statusInfo' },
  revision_requested: {
    labelKey: 'statusRevisionRequested',
    tone: 'statusWarning',
  },
  accepted: { labelKey: 'statusAccepted', tone: 'statusSuccess' },
  denied: { labelKey: 'statusRejected', tone: 'statusDanger' },
  rejected: { labelKey: 'statusRejected', tone: 'statusDanger' },
} as const satisfies Record<
  VerificationStatus,
  { labelKey: string; tone: string }
>;

/**
 * Maps API classification values to `ManageProjects` translation keys.
 * Both the current and the pre-rename values are listed, since older projects
 * still carry `large-scale-planting` / `other-planting` in the database.
 */
const CLASSIFICATION_LABEL_KEYS = {
  'restoration-tree-planting': 'largeScalePlanting',
  'large-scale-planting': 'largeScalePlanting',
  agroforestry: 'agroforestry',
  'natural-regeneration': 'naturalRegeneration',
  'managed-regeneration': 'managedRegeneration',
  mangroves: 'mangroves',
  'urban-planting': 'urbanPlanting',
  'other-restoration': 'otherPlanting',
  'other-planting': 'otherPlanting',
} as const;

type ClassificationValue = keyof typeof CLASSIFICATION_LABEL_KEYS;

/**
 * Fallback label for the type slot in the card subtitle. Only tree projects carry
 * a `classification`, so conservation and funds projects fall back to their
 * purpose and would otherwise leave the subtitle showing a bare country.
 */
const PURPOSE_LABEL_KEYS = {
  conservation: 'purposeConservation',
  funds: 'purposeFunds',
  trees: 'purposeRestoration',
} as const;

function SingleProject({ project }: { project: ProjectProperties }) {
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';
  const tDonate = useTranslations('Donate');
  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const tManageProjects = useTranslations('ManageProjects');
  const locale = useLocale();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const count =
    project.unitType === 'tree'
      ? project.unitsContributed?.tree
      : project.unitsContributed?.m2;
  const formattedCount = useMemo(
    () => localizedAbbreviatedNumber(locale, Number(count), 1),
    [count]
  );
  const classification = (project as ProfileProjectPropertiesTrees)
    ?.classification as ClassificationValue | undefined;
  const labelKey = classification
    ? CLASSIFICATION_LABEL_KEYS[classification]
    : undefined;
  const classificationLabel = labelKey
    ? tManageProjects(labelKey)
    : classification;
  // Falls back to the purpose so the subtitle never starts with a bare country.
  // Only tree projects carry a `classification`. This slot used to read
  // `metadata.ecosystem` for conservation, which is nullable, is an ecosystem
  // rather than a project type, and rendered as a raw slug when it was set.
  const typeLabel =
    classificationLabel ?? tManageProjects(PURPOSE_LABEL_KEYS[project.purpose]);
  const countryLabel = project.country
    ? tCountry(project.country.toLowerCase() as Lowercase<CountryCode>)
    : undefined;
  // Joined rather than hardcoding the separator, so a project without a
  // classification (e.g. a funds project) doesn't render a dangling "• ".
  const subtitleParts = [typeLabel, countryLabel].filter(Boolean);
  const statusBadge = project.verificationStatus
    ? VERIFICATION_STATUS_BADGES[project.verificationStatus]
    : undefined;
  return (
    <div className={styles.singleProject} key={project.id}>
      {ImageSource ? (
        <img
          src={ImageSource}
          className={styles.projectImage}
          alt={project.name}
        />
      ) : (
        <div className={styles.noProjectImage}></div>
      )}
      <div className={styles.projectInformation}>
        <div className={styles.projectHeader}>
          {statusBadge && (
            <span
              className={`${styles.statusChip} ${styles[statusBadge.tone]}`}
            >
              {tManageProjects(statusBadge.labelKey)}
            </span>
          )}
          <p className={styles.projectName}>{project.name}</p>
        </div>
        <p className={styles.projectClassification}>
          {subtitleParts.join(' • ')}
        </p>
        <p className={styles.projectUnitsAchieved}>
          {count !== undefined &&
            project.unitType !== 'currency' &&
            tCommon(`unitTypes.${project.unitType}`, { formattedCount, count })}
        </p>
        <div className={styles.projectLabels}>
          {/* Needed in future */}
          {/* {!project.isFeatured && (
            <div className={styles.projectLabel}>🛰 ️TreeMapper</div>
          )} */}
          {project.isFeatured ? (
            <div className={styles.projectLabel}>🌟 {tCommon('featured')}</div>
          ) : (
            ''
          )}
          {project.allowDonations ? (
            <div className={styles.projectLabel}>
              💸 {tDonate('acceptingDonations')}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className={styles.projectLinksContainer}>
        <Link
          href={localizedPath(generateProjectLink(project.id, router.asPath))}
        >
          <button className={styles.secondaryLink}>{tCommon('view')}</button>
        </Link>
        <Link
          href={localizedPath(
            `/profile/projects/${project.id}?type=basic-details`
          )}
        >
          <button className={styles.primaryLink}>{tCommon('edit')}</button>
        </Link>
      </div>
    </div>
  );
}

export default function ProjectsContainer() {
  const router = useRouter();
  const tDonate = useTranslations('Donate');
  const tManageProjects = useTranslations('ManageProjects');
  const { getApiAuthenticated } = useApi();
  const [projects, setProjects] = useState<ProfileProjectFeature[]>([]);
  const { user, contextLoaded, token } = useUserProps();
  const { localizedPath } = useLocalizedPath();
  // local state
  const [loader, setLoader] = useState(true);
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  async function loadProjects() {
    if (user) {
      try {
        const projects = await getApiAuthenticated<ProfileProjectFeature[]>(
          '/app/profile/projects',
          { queryParams: { version: '1.2' } }
        );
        setProjects(projects);
      } catch (err) {
        setErrors(handleError(err as APIError));
        router.push(localizedPath('/profile'));
      }
      setLoader(false);
    }
  }
  // This effect is used to get and update UserInfo if the isAuthenticated changes
  useEffect(() => {
    if (contextLoaded && token) {
      loadProjects();
    }
  }, [contextLoaded, token]);

  return (
    <DashboardView
      title={tManageProjects('manageProject')}
      subtitle={
        <div>
          <p>{tManageProjects('descriptionForManageProjects')}</p>
        </div>
      }
    >
      <SingleColumnView>
        <div className={styles.headerCTAs}>
          <Link href={localizedPath('/profile/projects/new-project')}>
            <button
              // id={'addProjectBut'}
              className="primaryButton"
            >
              {tManageProjects('addProject')}
            </button>
          </Link>
          <Link href={localizedPath('/profile/payouts')}>
            <button className="primaryButton">
              {tManageProjects('managePayoutsButton')}
            </button>
          </Link>
        </div>

        <div className={styles.projectsContainer} id="projectsContainer">
          {loader && <GlobeContentLoader />}
          {projects?.length < 1 && !loader ? (
            <div className={styles.projectNotFound}>
              <LazyLoad>
                <NotFound className={styles.projectNotFoundImage} />
                <h5>{tDonate('noProjectsFound')}</h5>
              </LazyLoad>
            </div>
          ) : (
            <div className={styles.listProjects}>
              {projects.map((project, index) => {
                return (
                  <SingleProject key={index} project={project.properties} />
                );
              })}
            </div>
          )}
        </div>
      </SingleColumnView>
    </DashboardView>
  );
}

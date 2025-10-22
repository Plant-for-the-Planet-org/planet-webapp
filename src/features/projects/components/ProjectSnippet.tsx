import type { ReactElement } from 'react';
import type {
  ConservationProjectConcise,
  ConservationProjectExtended,
  TreeProjectConcise,
  TreeProjectExtended,
} from '@planet-sdk/common';

import { useContext } from 'react';
import getImageUrl from '../../../utils/getImageURL';
import { useLocale, useTranslations } from 'next-intl';
import getFormattedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import EditIcon from '../../../../public/assets/images/icons/manageProjects/Pencil';
import Link from 'next/link';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { truncateString } from '../../../utils/getTruncatedString';
import { useProjectProps } from '../../common/Layout/ProjectPropsContext';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { getDonationUrl } from '../../../utils/getDonationUrl';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import VerifiedBadge from './VerifiedBadge';
import TopProjectBadge from './TopProjectBadge';
import ProjectTypeIcon from '../../common/ProjectTypeIcon';
import ProjectInfo from '../../../../public/assets/images/icons/project/ProjectInfo';
import {
  bindHover,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { useTenant } from '../../common/Layout/TenantContext';
import styles from '../styles/ProjectSnippet.module.scss';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

interface Props {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
  editMode: boolean;
  displayPopup: boolean;
  utmCampaign?: string;
  disableDonations?: boolean;
}

export default function ProjectSnippet({
  project,
  editMode,
  displayPopup,
  utmCampaign,
  disableDonations = false,
}: Props): ReactElement {
  const locale = useLocale();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const tDonate = useTranslations('Donate');
  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const tManageProjects = useTranslations('ManageProjects');
  const storedCampaign = sessionStorage.getItem('campaign');
  const { embed, callbackUrl } = useContext(ParamsContext);
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';

  const { selectedPl, hoveredPl, setSelectedSite } = useProjectProps();
  const { tenantConfig } = useTenant();

  let progressPercentage = 0;

  if (project.purpose === 'trees' && project.countTarget !== null)
    progressPercentage = (project.countPlanted / project.countTarget) * 100;

  if (progressPercentage > 100) {
    progressPercentage = 100;
  }

  const ecosystem =
    project._scope === 'map' ? project.ecosystem : project.metadata.ecosystem;

  const { token } = useUserProps();
  const handleOpen = () => {
    const url = getDonationUrl(
      tenantConfig.id,
      project.slug,
      token,
      embed || undefined,
      callbackUrl || undefined,
      utmCampaign || storedCampaign || undefined
    );
    embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  };

  const projectInfoPopupState = usePopupState({
    variant: 'popover',
    popupId: 'projectInfoPopover',
  });

  const donateButtonBackgroundColor =
    project.isTopProject && project.isApproved
      ? `${styles.topApproved}`
      : `${styles.topUnapproved}`;

  const progressBarBackgroundColor =
    project.isTopProject && project.isApproved
      ? `${styles.topApproved}`
      : project.allowDonations
      ? `${styles.topUnapproved}`
      : `${styles.notDonatable}`;

  return (
    <div className={styles.singleProject}>
      {editMode ? (
        <Link href={`/profile/projects/${project.id}`}>
          <button id={'projectSnipEdit'} className={'projectEditBlock'}>
            <EditIcon></EditIcon>
          </button>
        </Link>
      ) : null}
      <div
        onClick={() => {
          setSelectedSite(0);
          if (utmCampaign) sessionStorage.setItem('campaign', utmCampaign);
          router.push(
            localizedPath(
              `/projects-archive/${project.slug}${
                embed === 'true'
                  ? `${
                      callbackUrl != undefined
                        ? `?embed=true&callback=${callbackUrl}`
                        : '?embed=true'
                    }`
                  : ''
              }`
            )
          );
        }}
        className={`${styles.projectImage} ${
          selectedPl || hoveredPl ? styles.projectCollapsed : ''
        }`}
      >
        {project.image && typeof project.image !== 'undefined' ? (
          <div
            className={styles.projectImageFile}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`,
              backgroundPosition: 'center',
            }}
          ></div>
        ) : null}
        {project.purpose === 'trees' &&
          project.isTopProject &&
          project.isApproved && <TopProjectBadge displayPopup={true} />}
        <div className={styles.projectImageBlock}>
          <div className={styles.projectEcosystemOrTypeContainer}>
            <div className={styles.projectTypeIcon}>
              <ProjectTypeIcon
                projectType={
                  project.purpose === 'conservation'
                    ? 'conservation'
                    : project.classification
                }
              />
            </div>
            <div>
              {ecosystem !== null && (
                <div className={styles.projectEcosystem}>
                  {tManageProjects(`ecosystemTypes.${ecosystem}`)}
                  {project.purpose === 'trees' && ' /'}
                </div>
              )}
              <div className={styles.projectType}>
                {project.purpose === 'trees' &&
                  project.classification &&
                  tDonate(project.classification)}
              </div>
            </div>
          </div>
          <p className={styles.projectName}>
            {truncateString(project.name, 54)}
            {project.purpose === 'trees' && project.isApproved && (
              <VerifiedBadge displayPopup={displayPopup} project={project} />
            )}
          </p>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={`${styles.progressBarHighlight} ${progressBarBackgroundColor}`}
          style={{ width: progressPercentage + '%' }}
        />
      </div>
      <div className={styles.projectInfo}>
        <div className={styles.projectData}>
          <div className={styles.targetLocation}>
            <div className={styles.target}>
              {project.purpose === 'trees' && project.countPlanted > 0 && (
                <>
                  {localizedAbbreviatedNumber(
                    locale,
                    Number(project.countPlanted),
                    1
                  )}{' '}
                  {project.unitType === 'tree'
                    ? tCommon('tree', {
                        count: Number(project.countPlanted),
                      })
                    : tCommon('m2')}{' '}
                  •{' '}
                </>
              )}
              <span style={{ fontWeight: 400 }}>
                {tCountry(project.country.toLowerCase())}
              </span>
            </div>
          </div>
          {!project.allowDonations ? (
            <div
              className={styles.projectHoverIcon}
              {...bindHover(projectInfoPopupState)}
            >
              <ProjectInfo color={'#828282'} />
              <HoverPopover
                {...bindPopover(projectInfoPopupState)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className={styles.projectInfoPopupContainer}>
                  {tenantConfig.config.slug === 'salesforce'
                    ? `${tCommon('salesforceDisabledDonateButtonText')}`
                    : `${tCommon('disabledDonateButtonText')}`}
                </div>
              </HoverPopover>
              {tCommon('notDonatable')}
            </div>
          ) : (
            <div className={styles.perUnitCost}>
              {getFormattedCurrency(locale, project.currency, project.unitCost)}{' '}
              <span>
                {project.unitType === 'tree' && tDonate('perTree')}
                {project.unitType === 'm2' && tDonate('perM2')}
              </span>
            </div>
          )}
        </div>

        <div className={styles.projectCost}>
          {project.allowDonations && !disableDonations && (
            <button
              id={`ProjSnippetDonate_${project.id}`}
              onClick={handleOpen}
              className={`${styles.donateButton} ${donateButtonBackgroundColor}`}
              data-test-id="donateButton"
            >
              {tCommon('donate')}
            </button>
          )}
        </div>
      </div>
      <div
        className={styles.projectTPOName}
        onClick={() => {
          embed === 'true'
            ? window.open(localizedPath(`/t/${project.tpo.slug}`), '_top')
            : router.push(localizedPath(`/t/${project.tpo.slug}`));
        }}
        style={{
          background: `${
            !project.allowDonations
              ? '#82828233'
              : project.isTopProject && project.isApproved
              ? '#e7b24c33'
              : '#21965333'
          }`,
        }}
      >
        {tCommon('by', {
          tpoName: project.tpo.name,
        })}
      </div>
    </div>
  );
}

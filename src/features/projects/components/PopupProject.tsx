import type { ReactElement, RefObject } from 'react';
import type {
  ConservationProjectConcise,
  TreeProjectConcise,
} from '@planet-sdk/common/build/types/project/map';

import { useContext } from 'react';
import getImageUrl from '../../../utils/getImageURL';
import { useLocale, useTranslations } from 'next-intl';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { truncateString } from '../../../utils/getTruncatedString';
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

interface Props {
  project: TreeProjectConcise | ConservationProjectConcise;
  buttonRef: RefObject<HTMLButtonElement>;
}

export default function PopupProject({
  project,
  buttonRef,
}: Props): ReactElement {
  const tDonate = useTranslations('Donate');
  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const tManageProjects = useTranslations('ManageProjects');
  const locale = useLocale();
  const { token } = useUserProps();
  const { embed } = useContext(ParamsContext);
  const { tenantConfig } = useTenant();

  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';

  let progressPercentage = 0;

  if (project.purpose === 'trees' && project.countTarget !== null)
    progressPercentage = (project.countPlanted / project.countTarget) * 100;

  if (progressPercentage > 100) {
    progressPercentage = 100;
  }

  const handleDonationOpen = () => {
    const url = getDonationUrl(tenantConfig.id, project.slug, token);
    embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  };

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

  const popupProjectInfoPopover = usePopupState({
    variant: 'popover',
    popupId: 'popupProjectInfoPopover',
  });

  return (
    <div className={styles.singleProject}>
      <div className={styles.projectImage}>
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
          project.isApproved && <TopProjectBadge displayPopup={false} />}
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
              {project.ecosystem !== null && (
                <div className={styles.projectEcosystem}>
                  {tManageProjects(`ecosystemTypes.${project.ecosystem}`)}
                  {project.purpose === 'trees' && ' /'}
                </div>
              )}
              {project.purpose === 'trees' && (
                <div className={styles.projectType}>
                  {project.classification && tDonate(project.classification)}
                </div>
              )}
            </div>
          </div>

          <p className={styles.projectName}>
            {truncateString(project.name, 54)}
            {project.purpose === 'trees' && project.isApproved && (
              <VerifiedBadge displayPopup={false} project={project} />
            )}
          </p>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={`${styles.progressBarHighlight} ${progressBarBackgroundColor}`}
          style={{ width: progressPercentage }}
        />
      </div>
      <div
        className={styles.projectInfo}
        style={{
          padding: '0 16px',
        }}
      >
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
              {...bindHover(popupProjectInfoPopover)}
            >
              <ProjectInfo color={'#828282'} />
              <HoverPopover
                {...bindPopover(popupProjectInfoPopover)}
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
              {getFormatedCurrency(locale, project.currency, project.unitCost)}{' '}
              <span>
                {project.unitType === 'tree' && tDonate('perTree')}
                {project.unitType === 'm2' && tDonate('perM2')}
              </span>
            </div>
          )}
        </div>
        {project.allowDonations && (
          <div className={styles.projectCost}>
            {project.unitCost ? (
              <button
                id={`ProjPopDonate${project.id}`}
                ref={buttonRef}
                onClick={handleDonationOpen}
                className={`${styles.donateButton} ${donateButtonBackgroundColor}`}
              >
                {tCommon('donate')}
              </button>
            ) : null}
          </div>
        )}
      </div>
      <div
        className={styles.projectTPOName}
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

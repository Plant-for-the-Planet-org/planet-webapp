import React, { ReactElement } from 'react';
import getImageUrl from '../../../utils/getImageURL';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
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
import ProjectTypeIcon from './ProjectTypeIcon';
import {
  ConservationProjectConcise,
  ConservationProjectExtended,
  TreeProjectConcise,
  TreeProjectExtended,
} from '@planet-sdk/common';
import ProjectInfo from '../../../../public/assets/images/icons/project/ProjectInfo';
import {
  bindHover,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { useTenant } from '../../common/Layout/TenantContext';

interface Props {
  project:
    | TreeProjectConcise
    | ConservationProjectConcise
    | TreeProjectExtended
    | ConservationProjectExtended;
  editMode: boolean;
  displayPopup: boolean;
}

export default function ProjectSnippet({
  project,
  editMode,
  displayPopup,
}: Props): ReactElement {
  const router = useRouter();
  const { t, i18n, ready } = useTranslation([
    'donate',
    'common',
    'country',
    'manageProjects',
  ]);
  const { embed, callbackUrl } = React.useContext(ParamsContext);
  const ImageSource = project.image
    ? getImageUrl('project', 'medium', project.image)
    : '';

  const { selectedPl, hoveredPl } = useProjectProps();
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
      callbackUrl || undefined
    );
    embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  };

  const projectInfoPopupState = usePopupState({
    variant: 'popover',
    popupId: 'projectInfoPopover',
  });

  const donateButtonBackgroundColor =
    project.isTopProject && project.isApproved
      ? 'topApproved'
      : 'topUnapproved';

  const progressBarBackgroundColor =
    project.isTopProject && project.isApproved
      ? 'topApproved'
      : project.allowDonations
      ? 'topUnapproved'
      : 'notDonatable';

  return ready ? (
    <div className={'singleProject'}>
      {editMode ? (
        <Link href={`/profile/projects/${project.id}`}>
          <button id={'projectSnipEdit'} className={'projectEditBlock'}>
            <EditIcon></EditIcon>
          </button>
        </Link>
      ) : null}
      <div
        onClick={() => {
          router.push(
            `/${project.slug}/${
              embed === 'true'
                ? `${
                    callbackUrl != undefined
                      ? `?embed=true&callback=${callbackUrl}`
                      : '?embed=true'
                  }`
                : ''
            }`
          );
        }}
        className={`projectImage ${
          selectedPl || hoveredPl ? 'projectCollapsed' : ''
        }`}
      >
        {project.image && typeof project.image !== 'undefined' ? (
          <div
            className={'projectImageFile'}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`,
              backgroundPosition: 'center',
            }}
          ></div>
        ) : null}
        {project.purpose === 'trees' &&
          project.isTopProject &&
          project.isApproved && <TopProjectBadge displayPopup={true} />}
        <div className={'projectImageBlock'}>
          <div className={'projectEcosystemOrTypeContainer'}>
            <div className={'projectTypeIcon'}>
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
                <div className={'projectEcosystem'}>
                  {t(`manageProjects:ecosystemTypes.${ecosystem}`)}
                  {project.purpose === 'trees' && ' /'}
                </div>
              )}
              <div className={'projectType'}>
                {project.purpose === 'trees' &&
                  project.classification &&
                  t(`donate:${project.classification}`)}
              </div>
            </div>
          </div>
          <p className={'projectName'}>
            {truncateString(project.name, 54)}
            {project.purpose === 'trees' && project.isApproved && (
              <VerifiedBadge displayPopup={displayPopup} project={project} />
            )}
          </p>
        </div>
      </div>

      <div className={'progressBar'}>
        <div
          className={`progressBarHighlight ${progressBarBackgroundColor}`}
          style={{ width: progressPercentage + '%' }}
        />
      </div>
      <div className={'projectInfo'}>
        <div className={'projectData'}>
          <div className={'targetLocation'}>
            <div className={'target'}>
              {project.purpose === 'trees' && project.countPlanted > 0 && (
                <>
                  {localizedAbbreviatedNumber(
                    i18n.language,
                    Number(project.countPlanted),
                    1
                  )}{' '}
                  {project.unitType === 'tree'
                    ? t('common:tree', {
                        count: Number(project.countPlanted),
                      })
                    : t('common:m2')}{' '}
                  •{' '}
                </>
              )}
              <span style={{ fontWeight: 400 }}>
                {t('country:' + project.country.toLowerCase())}
              </span>
            </div>
          </div>
          {!project.allowDonations ? (
            <div
              className={'projectHoverIcon'}
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
                <div className="projectInfoPopupContainer">
                  {tenantConfig.config.slug === 'salesforce'
                    ? `${t('common:salesforceDisabledDonateButtonText')}`
                    : `${t('common:disabledDonateButtonText')}`}
                </div>
              </HoverPopover>
              {t('common:notDonatable')}
            </div>
          ) : (
            <div className={'perUnitCost'}>
              {getFormatedCurrency(
                i18n.language,
                project.currency,
                project.unitCost
              )}{' '}
              <span>
                {project.purpose === 'conservation'
                  ? t('donate:perM2')
                  : t('donate:perTree')}
              </span>
            </div>
          )}
        </div>

        <div className={'projectCost'}>
          {project.allowDonations && (
            <button
              id={`ProjSnippetDonate_${project.id}`}
              onClick={handleOpen}
              className={`donateButton ${donateButtonBackgroundColor}`}
              data-test-id="donateButton"
            >
              {t('common:donate')}
            </button>
          )}
        </div>
      </div>
      <div
        className={'projectTPOName'}
        onClick={() => {
          embed === 'true'
            ? window.open(`/t/${project.tpo.slug}`, '_top')
            : router.push(`/t/${project.tpo.slug}`);
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
        {t('common:by', {
          tpoName: project.tpo.name,
        })}
      </div>
    </div>
  ) : (
    <></>
  );
}

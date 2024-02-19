import React, { ReactElement, RefObject } from 'react';
import getImageUrl from '../../../utils/getImageURL';
import { useTranslation } from 'next-i18next';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { truncateString } from '../../../utils/getTruncatedString';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { getDonationUrl } from '../../../utils/getDonationUrl';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import VerifiedBadge from './VerifiedBadge';
import TopProjectBadge from './TopProjectBadge';
import ProjectTypeIcon from './ProjectTypeIcon';
import {
  ConservationProjectConcise,
  TreeProjectConcise,
} from '@planet-sdk/common/build/types/project/map';
import ProjectInfo from '../../../../public/assets/images/icons/project/ProjectInfo';
import {
  bindHover,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { useTenant } from '../../common/Layout/TenantContext';

interface Props {
  project: TreeProjectConcise | ConservationProjectConcise;
  buttonRef: RefObject<HTMLButtonElement>;
}

export default function PopupProject({
  project,
  buttonRef,
}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);
  const { token } = useUserProps();
  const { embed } = React.useContext(ParamsContext);
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
      ? 'topApproved'
      : 'topUnapproved';

  const progressBarBackgroundColor =
    project.isTopProject && project.isApproved
      ? 'topApproved'
      : project.allowDonations
      ? 'topUnapproved'
      : 'notDonatable';

  const popupProjectInfoPopover = usePopupState({
    variant: 'popover',
    popupId: 'popupProjectInfoPopover',
  });

  return ready ? (
    <div className={'singleProject'}>
      <div className={'projectImage'}>
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
          project.isApproved && <TopProjectBadge displayPopup={false} />}
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
              {project.ecosystem !== null && (
                <div className={'projectEcosystem'}>
                  {t(`manageProjects:ecosystemTypes.${project.ecosystem}`)}
                  {project.purpose === 'trees' && ' /'}
                </div>
              )}
              {project.purpose === 'trees' && (
                <div className={'projectType'}>
                  {project.classification &&
                    t(`donate:${project.classification}`)}
                </div>
              )}
            </div>
          </div>

          <p className={'projectName'}>
            {truncateString(project.name, 54)}
            {project.purpose === 'trees' && project.isApproved && (
              <VerifiedBadge displayPopup={false} project={project} />
            )}
          </p>
        </div>
      </div>

      <div className={'progressBar'}>
        <div
          className={`progressBarHighlight ${progressBarBackgroundColor}`}
          style={{ width: progressPercentage }}
        />
      </div>
      <div
        className={'projectInfo'}
        style={{
          padding: '0 16px',
        }}
      >
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
                {project.unitType === 'tree' && t('donate:perTree')}
                {project.unitType === 'm2' && t('donate:perM2')}
              </span>
            </div>
          )}
        </div>
        {project.allowDonations && (
          <div className={'projectCost'}>
            {project.unitCost ? (
              <button
                id={`ProjPopDonate${project.id}`}
                ref={buttonRef}
                onClick={handleDonationOpen}
                className={`donateButton ${donateButtonBackgroundColor}`}
              >
                {t('common:donate')}
              </button>
            ) : null}
          </div>
        )}
      </div>
      <div
        className={'projectTPOName'}
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

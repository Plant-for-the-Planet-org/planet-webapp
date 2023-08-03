import React, { ReactElement } from 'react';
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
import {
  ConservationProjectConcise,
  TreeProjectConcise,
} from '@planet-sdk/common/build/types/project/map';

interface Props {
  project: TreeProjectConcise | ConservationProjectConcise;
  open: boolean;
  handleOpen: Function;
  handleClose: Function;
  buttonRef: any;
  popupRef: any;
}

export default function PopupProject({
  project,
  buttonRef,
}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);
  const { token } = useUserProps();
  const { embed } = React.useContext(ParamsContext);

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
    const url = getDonationUrl(project.slug, token);
    embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  };

  return ready ? (
    <>
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
          {project.purpose === 'trees' && (
            <div className={'projectType'}>
              {project.classification && t(`donate:${project.classification}`)}
            </div>
          )}

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
          className={'progressBarHighlight'}
          style={{ width: progressPercentage }}
        />
      </div>
      <div
        className={'projectInfo'}
        style={{ padding: '16px', backgroundColor: 'var(--background-color)' }}
      >
        <div className={'projectData'}>
          <div className={'targetLocation'}>
            <div className={'target'}>
              {project.purpose === 'trees' && (
                <>
                  {localizedAbbreviatedNumber(
                    i18n.language,
                    Number(project.countPlanted),
                    1
                  )}{' '}
                  {t('common:tree', {
                    count: Number(project.countPlanted),
                  })}{' '}
                  •{' '}
                </>
              )}
              <span style={{ fontWeight: 400 }}>
                {t('country:' + project.country.toLowerCase())}
              </span>
            </div>
          </div>
          <div className={'projectTPOName'}>
            {t('common:by', {
              tpoName: project.tpo.name,
            })}
          </div>
        </div>
        {project.allowDonations && (
          <div className={'projectCost'}>
            {project.unitCost ? (
              <>
                <button
                  id={`ProjPopDonate${project.id}`}
                  ref={buttonRef}
                  onClick={handleDonationOpen}
                  className={'donateButton'}
                >
                  {t('common:donate')}
                </button>
                <div className={'perTreeCost'}>
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
              </>
            ) : null}
          </div>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}

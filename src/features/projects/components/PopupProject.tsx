import React, { ReactElement } from 'react';
import getImageUrl from '../../../utils/getImageURL';
import { useTranslation } from 'next-i18next';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { truncateString } from '../../../utils/getTruncatedString';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import { getDonationUrl } from '../../../utils/getDonationUrl';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import VerifiedIcon from '@mui/icons-material/Verified';

interface Props {
  project: any;
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
  const { token } = React.useContext(UserPropsContext);
  const { embed } = React.useContext(ParamsContext);

  const ImageSource = project.properties.image
    ? getImageUrl('project', 'medium', project.properties.image)
    : '';
  const progressPercentage =
    (project.properties.countPlanted / project.properties.countTarget) * 100 +
    '%';

  const handleDonationOpen = () => {
    const url = getDonationUrl(project.properties.slug, token);
    embed === 'true' ? window.open(url, '_top') : (window.location.href = url);
  };

  return ready ? (
    <>
      <div className={'projectImage'}>
        {project.properties.image &&
        typeof project.properties.image !== 'undefined' ? (
          <div
            className={'projectImageFile'}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`,
              backgroundPosition: 'center',
            }}
          ></div>
        ) : null}
        {project.properties.isTopProject && project.properties.isApproved && (
          <div className={'topProjectBadge'}>{t('common:topProject')}</div>
        )}
        <div className={'projectImageBlock'}>
          <div className={'projectType'}>
            {project.properties.classification &&
              t(`donate:${project.properties.classification}`)}
          </div>

          <div className={'projectName'}>
            {truncateString(project.properties.name, 54)}
            {project.properties.isApproved && (
              <VerifiedIcon
                sx={{ color: '#42A5F5' }}
                className={'verifiedIcon'}
              />
            )}
          </div>
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
              {project.properties.purpose === 'trees' && (
                <>
                  {localizedAbbreviatedNumber(
                    i18n.language,
                    Number(project.properties.countPlanted),
                    1
                  )}{' '}
                  {t('common:tree', {
                    count: Number(project.properties.countPlanted),
                  })}{' '}
                  •{' '}
                </>
              )}
              <span style={{ fontWeight: 400 }}>
                {t('country:' + project.properties.country.toLowerCase())}
              </span>
            </div>
          </div>
          <div className={'projectTPOName'}>
            {t('common:by', {
              tpoName: project.properties.tpo.name,
            })}
          </div>
        </div>
        {project.properties.allowDonations && (
          <div className={'projectCost'}>
            {project.properties.unitCost ? (
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
                    project.properties.currency,
                    project.properties.unitCost
                  )}{' '}
                  <span>
                    {project.properties.purpose === 'conservation'
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

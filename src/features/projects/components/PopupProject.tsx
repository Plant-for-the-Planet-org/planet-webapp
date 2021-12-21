import Modal from '@material-ui/core/Modal';
import React, { ReactElement, Ref } from 'react';
import getImageUrl from '../../../utils/getImageURL';
import { ThemeContext } from '../../../theme/themeContext';
import DonationsPopup from '../../donations';
import i18next from '../../../../i18n/'
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';
import { truncateString } from '../../../utils/getTruncatedString';
import getStoredCurrency from '../../../utils/countryCurrency/getStoredCurrency';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';

const { useTranslation } = i18next;
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
  open,
  handleOpen,
  handleClose,
  buttonRef,
  popupRef,
}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);
  const { theme } = React.useContext(ThemeContext);
  const { user } = React.useContext(UserPropsContext);


  const ImageSource = project.properties.image
    ? getImageUrl('project', 'medium', project.properties.image)
    : '';
  const progressPercentage =
    (project.properties.countPlanted / project.properties.countTarget) * 100 +
    '%';

  const projectDetails = project.properties;

  const currency = getStoredCurrency();
  const country = localStorage.getItem('countryCode');
  const language = localStorage.getItem('language');

  const getSourceUrl = React.useCallback((): string => {
    var sourceUrl = `${process.env.NEXT_PUBLIC_DONATION_URL}/?to=${projectDetails.slug}&returnToUrl=${window.location.href}&country=${country}&currency=${currency}&locale=${language}${user ? '&autoLogin=true' : ''}&tenant=${process.env.TENANTID}`;
    return sourceUrl;
  }, [project, country, currency, language, user]);

  const url = getSourceUrl();

  const handleDonationOpen = () => {
    window.location.href = url;
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

        <div className={'projectImageBlock'}>
          <div className={'projectType'}>
            {project.properties.classification &&
              t(`donate:${project.properties.classification}`)}
          </div>

          <div className={'projectName'}>
            {truncateString(project.properties.name, 54)}
          </div>
        </div>
      </div>

      <div className={'progressBar'}>
        <div
          className={'progressBarHighlight'}
          style={{ width: progressPercentage }}
        />
      </div>
      <div className={'projectInfo'} style={{ padding: '16px', backgroundColor: 'var(--background-color)' }}>
        <div className={'projectData'}>
          <div className={'targetLocation'}>
            <div className={'target'}>
              {localizedAbbreviatedNumber(i18n.language, Number(project.properties.countPlanted), 1)}{' '}
              {t('common:tree', { count: Number(project.properties.countPlanted) })} •{' '}
              <span style={{ fontWeight: 400 }}>
                {t('country:' + project.properties.country.toLowerCase())}
              </span>
            </div>
          </div>
          <div className={'projectTPOName'}>
            {t('common:by', {
              tpoName: project.properties.tpo.name
            })}
          </div>
        </div>
        {project.properties.allowDonations && (
          <div className={'projectCost'}>
            {project.properties.treeCost ? (
              <>
                <button id={`ProjPopDonate${project.id}`} ref={buttonRef} onClick={handleDonationOpen} className={'donateButton'}
                >
                  {t('common:donate')}
                </button>
                <div className={'perTreeCost'}>
                  {getFormatedCurrency(
                    i18n.language,
                    project.properties.currency,
                    project.properties.treeCost
                  )}{' '}
                  <span>{t('donate:perTree')}</span>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </>
  ) : <></>;
}
import { useTranslation } from 'next-i18next';
import myForestStyles from '../../styles/MyForest.module.scss';
import {
  ProjectsSvg,
  CountriesSvg,
  DonationsSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import { ReactElement } from 'react';
import { DonationInfoProps } from '../../../../common/types/contribution';

const DonationInfo = ({
  projects,
  countries,
  donations,
}: DonationInfoProps): ReactElement => {
  const { t } = useTranslation(['maps', 'me']);
  return (
    <div className={myForestStyles.donationDetailContainer}>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <ProjectsSvg />
          </div>
          <div className={myForestStyles.label}>{t('maps:projects')}</div>
        </div>
        <div className={myForestStyles.value}>{`${
          projects ? projects : 0
        }`}</div>
      </div>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <CountriesSvg />
          </div>
          <div className={myForestStyles.label}>{t('maps:countries')}</div>
        </div>
        <div className={myForestStyles.value}>{`${
          countries ? countries : 0
        }`}</div>
      </div>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <DonationsSvg />
          </div>
          <div className={myForestStyles.label}>{t('me:donations')}</div>
        </div>
        <div className={myForestStyles.value}>{`${
          donations ? donations : 0
        }`}</div>
      </div>
    </div>
  );
};

export default DonationInfo;

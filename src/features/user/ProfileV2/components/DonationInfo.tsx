import { useTranslation } from 'next-i18next';
import myForestStyles from '../styles/MyForest.module.scss';
import {
  ProjectsSvg,
  CountriesSvg,
  DonationsSvg,
} from '../../../../../public/assets/images/ProfilePageIcons';

const DonationInfo = ({ projects, countries, donations }) => {
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
        <div className={myForestStyles.value}>{`${projects}`}</div>
      </div>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <CountriesSvg />
          </div>
          <div className={myForestStyles.label}>{t('maps:countries')}</div>
        </div>
        <div className={myForestStyles.value}>{`${countries}`}</div>
      </div>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <DonationsSvg />
          </div>
          <div className={myForestStyles.label}>{t('me:donations')}</div>
        </div>
        <div className={myForestStyles.value}>{`${donations}`}</div>
      </div>
    </div>
  );
};

export default DonationInfo;

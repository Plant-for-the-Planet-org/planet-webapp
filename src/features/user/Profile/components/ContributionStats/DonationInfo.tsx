import { useTranslations } from 'next-intl';
import myForestStyles from '../../styles/MyForest.module.scss';
import {
  ProjectsSvg,
  CountriesSvg,
  DonationsSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import { ReactElement } from 'react';
import { DonationInfoProps } from '../../../../common/types/myForest';
import theme from '../../../../../theme/themeProperties';

const DonationInfo = ({
  projects,
  countries,
  donations,
}: DonationInfoProps): ReactElement => {
  const { darkBlackColor } = theme;
  const t = useTranslations('Profile');
  return (
    <div className={myForestStyles.donationDetailContainer}>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <ProjectsSvg color={`${darkBlackColor}`} />
          </div>
          <div className={myForestStyles.label}>
            {t('myForestMap.projects')}
          </div>
        </div>
        <div className={myForestStyles.value}>{`${
          projects ? projects : 0
        }`}</div>
      </div>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <CountriesSvg color={`${darkBlackColor}`} />
          </div>
          <div className={myForestStyles.label}>
            {t('myForestMap.countries')}
          </div>
        </div>
        <div className={myForestStyles.value}>{`${
          countries ? countries : 0
        }`}</div>
      </div>
      <div className={myForestStyles.InfoContainer}>
        <div className={myForestStyles.labelContainer}>
          <div className={myForestStyles.svgContainer}>
            <DonationsSvg color={`${darkBlackColor}`} />
          </div>
          <div className={myForestStyles.label}>
            {t('myForestMap.donations')}
          </div>
        </div>
        <div className={myForestStyles.value}>{`${
          donations ? donations : 0
        }`}</div>
      </div>
    </div>
  );
};

export default DonationInfo;

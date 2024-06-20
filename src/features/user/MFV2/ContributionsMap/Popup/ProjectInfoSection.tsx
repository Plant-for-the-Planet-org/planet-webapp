import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { useContext } from 'react';
import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { getDonationUrl } from '../../../../../utils/getDonationUrl';
import style from '../MyForestV2.module.scss';
import format from 'date-fns/format';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { CountryCode } from '@planet-sdk/common';
import { PointFeature } from 'supercluster';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';

const ProjectInfoSection = ({
  superclusterResponse,
}: {
  superclusterResponse: PointFeature<DonationProperties>;
}) => {
  const { totalContributionUnits, contributionCount, latestContributions } =
    superclusterResponse.properties.contributionInfo;
  const { tpoName, guid, country } =
    superclusterResponse.properties.projectInfo;

  const tProfile = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const router = useRouter();
  const locale = useLocale();
  const { tenantConfig } = useTenant();
  const { embed } = useContext(ParamsContext);
  const { token, user } = useUserProps();
  const plantDate = Number(latestContributions[0].plantDate);
  const _country: Lowercase<CountryCode> =
    country.toLocaleLowerCase() as Lowercase<CountryCode>;

  const handleDonation = (id: string, tenant: string) => {
    if (user) {
      const url = getDonationUrl(
        tenant,
        id,
        token,
        undefined,
        undefined,
        router.asPath !== `/${locale}/profile` ? user.slug : undefined
      );
      embed === 'true'
        ? window.open(encodeURI(url), '_blank')
        : (window.location.href = encodeURI(url));
    }
  };

  return (
    <div className={style.projectInfoMainContainer}>
      <div className={style.projectInfoContainer}>
        <div className={style.donationContainer}>
          <div className={style.treesAndCountry}>
            <p className={style.trees}>
              {tProfile('myForestMapV.plantedTree', {
                count: Number.isInteger(totalContributionUnits)
                  ? totalContributionUnits
                  : totalContributionUnits.toFixed(2),
              })}
            </p>
            <p className={style.seperator}>•</p>
            <p>{tCountry(_country)}</p>
          </div>
          <button
            className={style.popupDonateButton}
            onClick={() => handleDonation(guid, tenantConfig.id)}
          >
            {tCommon('donate')}
          </button>
        </div>
        <div className={style.countryAndTpo}>
          {tCountry(_country)}
          <p className={style.seperator}>•</p>
          <p>
            {tProfile('myForestMapV.tpoName', {
              tpo: tpoName,
            })}
          </p>
        </div>
        {contributionCount === 1 && (
          <div className={style.singleContributionDate}>
            {format(plantDate, 'PP', {
              locale:
                localeMapForDate[localStorage.getItem('language') || 'en'],
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectInfoSection;

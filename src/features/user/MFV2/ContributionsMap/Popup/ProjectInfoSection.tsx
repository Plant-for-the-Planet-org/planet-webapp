import { useTranslations, e } from 'next-intl';
import style from '../MyForestV2.module.scss';
import format from 'date-fns/format';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { CountryCode } from '@planet-sdk/common';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';
import DonateButton from '../../MyContributions/DonateButton';
import { PointFeature } from 'supercluster';

interface ProjectInfoSectionProps {
  superclusterResponse: PointFeature<DonationProperties>;
  profilePageType: 'public' | 'private';
  supportedTreecounter?: string;
}
const ProjectInfoSection = ({
  superclusterResponse,
  profilePageType,
  supportedTreecounter,
}: ProjectInfoSectionProps) => {
  const { totalContributionUnits, contributionCount, latestContributions } =
    superclusterResponse.properties.contributionInfo;
  const { tpoName, country, purpose, slug, unitType } =
    superclusterResponse.properties.projectInfo;
  const tProfile = useTranslations('Profile');
  const tCountry = useTranslations('Country');
  const plantDate = Number(latestContributions[0].plantDate);
  const _country: Lowercase<CountryCode> =
    country.toLocaleLowerCase() as Lowercase<CountryCode>;

  return (
    <div className={style.projectInfoMainContainer}>
      <div className={style.projectInfoContainer}>
        <div className={style.donationContainer}>
          <div className={style.treesAndCountry}>
            <p className={style.trees}>
              {tProfile('myForestMap.plantedTree', {
                count: Number.isInteger(totalContributionUnits)
                  ? totalContributionUnits
                  : totalContributionUnits.toFixed(2),
              })}
            </p>
            <p className={style.seperator}>•</p>
            <p>{tCountry(_country)}</p>
          </div>
          <div>
            <DonateButton
              {...(profilePageType === 'public' &&
              supportedTreecounter !== undefined
                ? { type: 'supported', supportedTreecounter }
                : { type: 'unsupported' })}
              projectPurpose={purpose}
              buttonText={
                profilePageType === 'private'
                  ? tProfile('myContributions.donateAgain')
                  : tProfile('myContributions.donate')
              }
              projectSlug={slug}
              contributionUnitType={unitType}
              customClass={style.customDonateButton}
            />
          </div>
        </div>
        <div className={style.countryAndTpo}>
          {tCountry(_country)}
          <p className={style.seperator}>•</p>
          <p>
            {tProfile('myForestMap.tpoName', {
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

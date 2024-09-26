import { useTranslations } from 'next-intl';
import style from '../ContributionsMap.module.scss';
import { CountryCode } from '@planet-sdk/common';
import DonateButton from '../../MyContributions/DonateButton';
import { PointFeature } from 'supercluster';
import {
  ProfilePageType,
  DonationProperties,
} from '../../../../common/types/myForest';

interface ProjectInfoSectionProps {
  superclusterResponse: PointFeature<DonationProperties>;
  profilePageType: ProfilePageType;
  supportedTreecounter?: string;
}
const ProjectInfoSection = ({
  superclusterResponse,
  profilePageType,
  supportedTreecounter,
}: ProjectInfoSectionProps) => {
  const { totalContributionUnits, contributionUnitType } =
    superclusterResponse.properties.contributionInfo;
  const { tpoName, country, purpose, slug, unitType } =
    superclusterResponse.properties.projectInfo;
  const tProfile = useTranslations('Profile');
  const tCountry = useTranslations('Country');
  const _country: Lowercase<CountryCode> =
    country.toLocaleLowerCase() as Lowercase<CountryCode>;

  const totalContributedUnits =
    contributionUnitType === 'tree'
      ? tProfile('myForestMap.plantedTree', {
          count: Number.isInteger(totalContributionUnits)
            ? totalContributionUnits
            : totalContributionUnits.toFixed(2),
        })
      : tProfile('myForestMap.savedArea', {
          area: Number.isInteger(totalContributionUnits)
            ? totalContributionUnits
            : totalContributionUnits.toFixed(2),
        });

  return (
    <div className={style.projectInfoMainContainer}>
      <p className={style.trees}>{totalContributedUnits}</p>
      <div className={style.countryAndTpo}>
        <span>{tCountry(_country)}</span>
        <span className={style.seperator}>•</span>
        <span>
          {tProfile('myForestMap.tpoName', {
            tpo: tpoName,
          })}
        </span>
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
        />
      </div>
    </div>
  );
};

export default ProjectInfoSection;

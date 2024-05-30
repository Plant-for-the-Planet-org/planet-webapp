import { Popup } from 'react-map-gl-v7';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { AnyProps, PointFeature } from 'supercluster';
import { useTranslations, useLocale } from 'next-intl';
import format from 'date-fns/format';
import style from '../MyForestV2.module.scss';
import getImageUrl from '../../../../../utils/getImageURL';
import ProjectTypeIcon from '../../../../projects/components/ProjectTypeIcon';
import { getDonationUrl } from '../../../../../utils/getDonationUrl';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { SetState } from '../../../../common/types/common';

interface ProjectProps {
  superclusterResponse: PointFeature<AnyProps>;
}

const Projectimage = ({ superclusterResponse }: ProjectProps) => {
  const t = useTranslations('Profile');
  const { classification, image, name } =
    superclusterResponse.properties.projectInfo;
  return (
    <div className={style.imageContainer}>
      <img
        alt="projectImage"
        src={getImageUrl('project', 'medium', image)}
        width={'fit-content'}
        className={style.popupProjctImage}
      />
      <div className={style.projectImageInfoContainer}>
        <div className={style.classificationContainer}>
          <div className={style.classificationIcon}>
            <ProjectTypeIcon projectType={classification} />
          </div>
          <div className={style.classification}>
            {t('myForestMapV.classification', {
              classification: classification,
            })}
          </div>
        </div>
        <div className={style.projectName}>
          {t('myForestMapV.projectName', {
            name: name,
          })}
        </div>
      </div>
    </div>
  );
};

const ProjectInfo = ({ superclusterResponse }: ProjectProps) => {
  const { totalContributionUnits, contributionCount, latestContributions } =
    superclusterResponse.properties.contributionInfo;
  const tProfile = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const { name, tpoName, guid } = superclusterResponse.properties.projectInfo;
  const router = useRouter();
  const locale = useLocale();
  const { embed } = useContext(ParamsContext);
  const { token, user } = useUserProps();
  const { tenantConfig } = useTenant(); //default tenant
  const _plantDate = latestContributions[0].plantDate;
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
  function truncateString(str: string, maxLength: number) {
    if (maxLength <= 18) {
      return str.slice(0, maxLength);
    }
    if (str.length > maxLength) {
      return str.slice(0, maxLength - 3) + '...';
    } else {
      return str;
    }
  }
  return (
    <div className={style.contributionInfoContainer}>
      <div>
        <div className={style.treesAndCountry}>
          <p className={style.trees}>
            {tProfile('myForestMapV.plantedTree', {
              count: Number.isInteger(totalContributionUnits)
                ? totalContributionUnits
                : totalContributionUnits.toFixed(2),
            })}
          </p>
          <p className={style.seperator}>.</p>
          <p>{truncateString(name, 19)}</p>
        </div>
        <div className={style.countryAndTpo}>
          <p>{truncateString(name, 19)}</p>
          <p className={style.seperator}>.</p>
          <p>
            {tProfile('myForestMapV.tpoName', {
              tpo: tpoName,
            })}
          </p>
        </div>
        {contributionCount === 1 && (
          <div className={style.singleContributionDate}>
            {format(_plantDate, 'PP', {
              locale:
                localeMapForDate[localStorage.getItem('language') || 'en'],
            })}
          </div>
        )}
      </div>
      <button
        className={style.popupDonateButton}
        onClick={() => handleDonation(guid, tenantConfig.id)}
      >
        {tCommon('donate')}
      </button>
    </div>
  );
};

const ContributionList = ({ superclusterResponse }: ProjectProps) => {
  const tProfile = useTranslations('Profile');
  const { contributionCount, latestContributions } =
    superclusterResponse.properties.contributionInfo;

  return contributionCount === 1 ? (
    <></>
  ) : (
    <div className={style.listOfContributionsContainer}>
      {latestContributions
        .slice(0, 3)
        .map((singleContribution: any, key: number) => {
          return (
            <div className={style.contributionInfoContainer} key={key}>
              <p className={style.trees}>
                {' '}
                {tProfile('myForestMapV.plantedTree', {
                  count: Number.isInteger(singleContribution.quantity)
                    ? singleContribution.quantity
                    : singleContribution.quantity.toFixed(2),
                })}
              </p>
              <p className={style.contributionDate}>
                {format(singleContribution.plantDate, 'PP', {
                  locale:
                    localeMapForDate[localStorage.getItem('language') || 'en'],
                })}{' '}
              </p>
            </div>
          );
        })}

      {contributionCount >= 4 && (
        <div className={style.totalContribution}>
          {tProfile('myForestMapV.totalContribution', {
            count: Number(contributionCount) - 3,
          })}
        </div>
      )}
    </div>
  );
};

interface ContributionPopupProps {
  superclusterResponse: PointFeature<AnyProps>;
  setShowPopUp: SetState<boolean>;
}

const ContributionPopup = ({
  superclusterResponse,
  setShowPopUp,
}: ContributionPopupProps) => {
  if (!superclusterResponse) return null;
  const { coordinates } = superclusterResponse.geometry;
  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      className={style.contributionPopup}
      offset={30}
      closeButton={false}
    >
      <div
        className={style.contributionPopupContainer}
        onMouseEnter={() => setShowPopUp(true)}
      >
        <Projectimage superclusterResponse={superclusterResponse} />
        <ProjectInfo superclusterResponse={superclusterResponse} />
        <ContributionList superclusterResponse={superclusterResponse} />
      </div>
    </Popup>
  );
};

export default ContributionPopup;

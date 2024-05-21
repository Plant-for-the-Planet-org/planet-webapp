import { Popup } from 'react-map-gl-v7';
import { useContext } from 'react';
import style from '../MyForestV2.module.scss';
import getImageUrl from '../../../../../utils/getImageURL';
import ProjectTypeIcon from '../../../../projects/components/ProjectTypeIcon';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { getDonationUrl } from '../../../../../utils/getDonationUrl';
import { useTenant } from '../../../../common/Layout/TenantContext';
import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/router';

const Projectimage = ({ superclusterResponse }) => {
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
          <div className={style.classification}>{classification}</div>
        </div>
        <div className={style.projectName}>{name}</div>
      </div>
    </div>
  );
};

const ProjectInfo = ({ superclusterResponse }) => {
  const { totalContributionUnits, contributionCount } =
    superclusterResponse.properties.contributionInfo;
  const { name, tpoName, guid } = superclusterResponse.properties.projectInfo;
  const router = useRouter();
  const locale = useLocale();
  const { embed } = useContext(ParamsContext);
  const { token, user } = useUserProps();
  const { tenantConfig } = useTenant(); //default tenant

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
    <div className={style.contributionInfoContainer}>
      <div>
        <div className={style.treesAndCountry}>
          <p className={style.trees}>{`${totalContributionUnits.toFixed(
            2
          )} trees`}</p>
          <p className={style.seperator}>.</p>
          <p>{name.replace(/^(.{11}[^\s]*).*/, '$1')}...</p>
        </div>
        <div className={style.countryAndTpo}>
          <p>{name.replace(/^(.{11}[^\s]*).*/, '$1')}...</p>
          <p className={style.seperator}>.</p>
          <p>{tpoName}</p>
        </div>
        {contributionCount === 1 && (
          <div className={style.singleContributionDate}>Aug 25, 2021</div> // need to do integaration
        )}
      </div>
      <button
        className={style.popupDonateButton}
        onClick={() => handleDonation(guid, tenantConfig.id)}
      >
        Donate
      </button>
    </div>
  );
};

const ContributionList = ({ superclusterResponse }) => {
  const { contributionCount, latestContributions } =
    superclusterResponse.properties.contributionInfo;
  console.log(
    superclusterResponse.properties.contributionInfo,
    superclusterResponse.properties.projectInfo,
    '==1'
  );
  return contributionCount === 1 ? (
    <></>
  ) : (
    <div className={style.listOfContributionsContainer}>
      {latestContributions
        .slice(0, 3)
        .map((singleContribution: any, key: any) => {
          return (
            <div className={style.contributionInfoContainer} key={key}>
              <p className={style.trees}>{singleContribution.quantity} trees</p>
              <p className={style.contributionDate}>Aug 25, 2025</p>
            </div>
          );
        })}

      {contributionCount >= 4 && (
        <div className={style.totalContribution}>{`+${
          Number(contributionCount) - 3
        } contribution`}</div>
      )}
    </div>
  );
};

const ContributionPopup = ({ superclusterResponse }) => {
  if (!superclusterResponse) return null;
  const { coordinates } = superclusterResponse.geometry;
  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      className={style.contributionPopup}
      offset={65}
      closeButton={false}
    >
      <div className={style.contributionPopupContainer}>
        <Projectimage superclusterResponse={superclusterResponse} />
        <ProjectInfo superclusterResponse={superclusterResponse} />
        <ContributionList superclusterResponse={superclusterResponse} />
      </div>
    </Popup>
  );
};

export default ContributionPopup;

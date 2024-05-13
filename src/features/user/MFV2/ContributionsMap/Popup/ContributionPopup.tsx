import { Popup } from 'react-map-gl-v7';
import style from '../MyForestV2.module.scss';
import getImageUrl from '../../../../../utils/getImageURL';
import ProjectTypeIcon from '../../../../projects/components/ProjectTypeIcon';

const Projectimage = ({ singleLocation }) => {
  return (
    <div className={style.imageContainer}>
      <img
        alt="projectImage"
        src={getImageUrl(
          'project',
          'medium',
          singleLocation?.properties?.project.image
        )}
        width={'fit-content'}
        className={style.popupProjctImage}
      />
      <div className={style.projectImageInfoContainer}>
        <div className={style.classificationContainer}>
          <div className={style.classificationIcon}>
            <ProjectTypeIcon
              projectType={singleLocation?.properties.project.classification}
            />
          </div>
          <div className={style.classification}>Natural Regeneration</div>
        </div>
        <div className={style.projectName}>Costa Rica - Ridge to Reef</div>
      </div>
    </div>
  );
};

const ProjectInfo = ({ singleLocation }) => {
  return (
    <div className={style.contributionInfoContainer}>
      <div>
        <div className={style.treesAndCountry}>
          <p className={style.trees}>
            {`${singleLocation?.properties.totalTrees} trees`}
          </p>
          <p className={style.seperator}>.</p>
          <p>Costa Rica</p>
        </div>
        <div className={style.countryAndTpo}>
          <p>Costa Rica</p>
          <p className={style.seperator}>.</p>
          <p>By One Tree Planted</p>
        </div>
        {singleLocation?.properties?.contributionCount === 1 && (
          <div className={style.singleContributionDate}>Aug 25, 2021</div>
        )}
      </div>
      <button className={style.popupDonateButton}>Donate</button>
    </div>
  );
};

const ContributionList = ({ singleLocation }) => {
  return singleLocation.properties.contributionCount === 1 ? (
    <></>
  ) : (
    <div className={style.listOfContributionsContainer}>
      {singleLocation?.properties.contributions
        .slice(0, 3)
        .map((singleContribution: any, key: any) => {
          return (
            <div className={style.contributionInfoContainer} key={key}>
              <p className={style.trees}>{singleContribution.quantity} trees</p>
              <p className={style.contributionDate}>Aug 25, 2025</p>
            </div>
          );
        })}

      {singleLocation?.properties.contributionCount >= 4 && (
        <div className={style.totalContribution}>{`+${
          singleLocation?.properties.contributionCount - 3
        } contribution`}</div>
      )}
    </div>
  );
};

const ContributionPopup = ({ singleLocation }) => {
  return (
    <Popup
      latitude={singleLocation?.geometry?.coordinates[1]}
      longitude={singleLocation?.geometry?.coordinates[0]}
      className={style.contributionPopup}
      offset={65}
      closeButton={false}
    >
      <div className={style.contributionPopupContainer}>
        <Projectimage singleLocation={singleLocation} />
        <ProjectInfo singleLocation={singleLocation} />
        <ContributionList singleLocation={singleLocation} />
      </div>
    </Popup>
  );
};

export default ContributionPopup;

import { Popup } from 'react-map-gl-v7';
import style from '../MyForestV2.module.scss';
import getImageUrl from '../../../../../utils/getImageURL';

const ContributionPopup = ({ singleLocation }) => {
  console.log(singleLocation?.properties.contributions, '==1');
  return (
    <Popup
      latitude={singleLocation?.geometry?.coordinates[1]}
      longitude={singleLocation?.geometry?.coordinates[0]}
      className={style.contributionPopup}
      offset={65}
      closeButton={false}
    >
      <div className={style.contributionPopupContainer}>
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
        </div>
        <div className={style.contributionInfoContainer}>
          <div>
            <div className={style.treesAndCountry}>
              <p className={style.trees}>
                {singleLocation?.properties.totalTrees}
              </p>
              <p className={style.seperator}>.</p>
              <p>Costa Rica</p>
            </div>
            <div className={style.countryAndTpo}>
              <p>Costa Rica</p>
              <p className={style.seperator}>.</p>
              <p>By One Tree Planted</p>
            </div>
            {singleLocation?.properties?.contributionCount.lenght > 1 && (
              <div className={style.singleContributionDate}>Aug 25, 2021</div>
            )}
          </div>
          <button className={style.popupDonateButton}>Donate</button>
        </div>

        <div className={style.listOfContributionsContainer}>
          {singleLocation?.properties.contributions
            .slice(0, 3)
            .map((singleContribution: any, key: any) => {
              return (
                <div className={style.contributionInfoContainer} key={key}>
                  <p className={style.trees}>{singleContribution.quantity}</p>
                  <p className={style.contributionDate}>Aug 25, 2025</p>
                </div>
              );
            })}
          {singleLocation?.properties.contributions.lenght > 3 && (
            <div className={style.totalContribution}>
              +234,003 contributions
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default ContributionPopup;

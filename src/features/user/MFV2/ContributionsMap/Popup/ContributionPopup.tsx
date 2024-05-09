import { Popup } from 'react-map-gl-v7';
import style from '../MyForestV2.module.scss';

const ContributionPopup = ({ singleLocation }) => {
  return (
    <Popup
      latitude={singleLocation?.geometry?.coordinates[1]}
      longitude={singleLocation?.geometry?.coordinates[0]}
      className={style.contributionPopup}
      offset={34}
    >
      <div className={style.contributionPopupContainer}></div>
    </Popup>
  );
};

export default ContributionPopup;

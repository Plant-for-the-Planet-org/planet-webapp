import { Popup } from 'react-map-gl-v7';
import { PointFeature } from 'supercluster';
import style from '../MyForestV2.module.scss';
import { SetState } from '../../../../common/types/common';
import ProjectInfoSection from './ProjectInfoSection';
import ContributionInfoList from './ContributionInfoList';
import ProjectimageSection from './ProjectImageSection';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';

interface DonationPopupProps {
  superclusterResponse: PointFeature<DonationProperties>;
  setShowPopUp: SetState<boolean>;
  handleMouseLeave: () => void;
}

const DonationPopup = ({
  superclusterResponse,
  setShowPopUp,
  handleMouseLeave,
}: DonationPopupProps) => {
  if (!superclusterResponse) return null;
  const { coordinates } = superclusterResponse.geometry;
  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      className={style.contributionPopup}
      offset={35}
      closeButton={false}
    >
      <div
        className={style.contributionPopupContainer}
        onMouseEnter={() => setShowPopUp(true)}
        onMouseLeave={handleMouseLeave}
      >
        <ProjectimageSection superclusterResponse={superclusterResponse} />
        <ProjectInfoSection superclusterResponse={superclusterResponse} />
        <ContributionInfoList superclusterResponse={superclusterResponse} />
      </div>
    </Popup>
  );
};

export default DonationPopup;

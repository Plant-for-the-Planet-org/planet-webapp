import { Popup } from 'react-map-gl-v7';
import { PointFeature } from 'supercluster';
import style from '../MyForestV2.module.scss';
import { SetState } from '../../../../common/types/common';
import ProjectInfoSection from './ProjectInfoSection';
import ContributionInfoList from './ContributionInfoList';
import PopupImageSection from './PopupImageSection';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';
import { ProfilePageType } from '../../../../common/types/myForestv2';

interface DonationPopupProps {
  superclusterResponse: PointFeature<DonationProperties>;
  profilePageType: ProfilePageType;
  supportedTreecounter: string | undefined;
  setIsCursorOnPopup: SetState<boolean>;
}

const DonationPopup = ({
  superclusterResponse,
  profilePageType,
  supportedTreecounter,
  setIsCursorOnPopup,
}: DonationPopupProps) => {
  if (!superclusterResponse) return null;
  const { coordinates } = superclusterResponse.geometry;
  const ProjectInfoSectionProps = {
    superclusterResponse,
    profilePageType,
    supportedTreecounter,
  };
  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      className={style.contributionPopup}
      offset={30}
      closeButton={false}
      anchor="bottom"
    >
      <div
        className={style.donationPopupContainer}
        onMouseEnter={() => setIsCursorOnPopup(true)}
        onMouseLeave={() => setIsCursorOnPopup(false)}
      >
        <PopupImageSection superclusterResponse={superclusterResponse} />
        <ProjectInfoSection {...ProjectInfoSectionProps} />
        <ContributionInfoList superclusterResponse={superclusterResponse} />
      </div>
    </Popup>
  );
};

export default DonationPopup;

import type { PointFeature } from 'supercluster';
import type { SetState } from '../../../../common/types/common';
import type {
  ProfilePageType,
  DonationProperties,
} from '../../../../common/types/myForest';

import { Popup } from 'react-map-gl-v7';
import style from '../ContributionsMap.module.scss';
import ProjectInfoSection from './ProjectInfoSection';
import PopupImageSection from './PopupImageSection';

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
      closeButton={false}
    >
      <div
        className={style.donationPopupContainer}
        onMouseEnter={() => setIsCursorOnPopup(true)}
        onMouseLeave={() => setIsCursorOnPopup(false)}
      >
        <PopupImageSection superclusterResponse={superclusterResponse} />
        <ProjectInfoSection {...ProjectInfoSectionProps} />
      </div>
    </Popup>
  );
};

export default DonationPopup;

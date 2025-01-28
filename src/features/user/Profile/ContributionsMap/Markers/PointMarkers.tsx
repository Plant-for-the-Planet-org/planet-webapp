import type { PointFeature } from 'supercluster';
import type {
  DonationProperties,
  MyContributionsSingleRegistration,
  ProfilePageType,
} from '../../../../common/types/myForest';

import { Marker } from 'react-map-gl-v7';
import style from '../Common/common.module.scss';
import ProjectTypeIcon from './ProjectTypeIcon';
import { useState } from 'react';
import { RegisteredTreeIcon } from '../../../../../../public/assets/images/icons/myForestMapIcons/PointMarkerIcons';
import DonationPopup from '../Popup/DonationPopup';
import RegisteredTreesPopup from '../Popup/RegisteredTreesPopup';

interface PointMarkersProps {
  superclusterResponse: PointFeature<
    DonationProperties | MyContributionsSingleRegistration
  >;
  profilePageType: ProfilePageType;
  supportedTreecounter: string | undefined;
}

function isRegistration(
  properties: DonationProperties | MyContributionsSingleRegistration
): properties is MyContributionsSingleRegistration {
  return (
    (properties as MyContributionsSingleRegistration).type === 'registration'
  );
}

const PointMarkers = ({
  superclusterResponse,
  profilePageType,
  supportedTreecounter,
}: PointMarkersProps) => {
  if (!superclusterResponse) return null;
  const [isCursorOnMarker, setIsCursorOnMarker] = useState(false);
  const [isCursorOnPopup, setIsCursorOnPopup] = useState(false);

  const donationPopupProps = {
    superclusterResponse:
      superclusterResponse as PointFeature<DonationProperties>,
    profilePageType,
    supportedTreecounter,
    setIsCursorOnPopup,
  };

  const handleMouseLeaveFromMarker = () => {
    setTimeout(() => setIsCursorOnMarker(false), 800);
  };

  return (
    <div
      onMouseLeave={handleMouseLeaveFromMarker}
      onMouseEnter={() => setIsCursorOnMarker(true)}
    >
      <Marker
        longitude={superclusterResponse.geometry.coordinates[0]}
        latitude={superclusterResponse.geometry.coordinates[1]}
        offset={[0, 0]}
        anchor="bottom"
      >
        {isRegistration(superclusterResponse.properties) ? (
          <>
            {(isCursorOnMarker || isCursorOnPopup) && (
              <RegisteredTreesPopup
                superclusterResponse={
                  superclusterResponse as PointFeature<MyContributionsSingleRegistration>
                }
                setIsCursorOnPopup={setIsCursorOnPopup}
              />
            )}
            <div className={style.registeredTreeMarkerContainer}>
              <RegisteredTreeIcon />
            </div>
          </>
        ) : (
          <>
            {(isCursorOnMarker || isCursorOnPopup) && (
              <DonationPopup {...donationPopupProps} />
            )}
            <div className={style.pointMarkerContainer}>
              <ProjectTypeIcon
                purpose={
                  (superclusterResponse as PointFeature<DonationProperties>)
                    .properties.projectInfo.purpose
                }
                classification={
                  (superclusterResponse as PointFeature<DonationProperties>)
                    .properties.projectInfo.classification
                }
                unitType={
                  (superclusterResponse as PointFeature<DonationProperties>)
                    .properties.projectInfo.unitType
                }
              />
            </div>
          </>
        )}
      </Marker>
    </div>
  );
};

export default PointMarkers;

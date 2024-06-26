import { Marker } from 'react-map-gl-v7';
import { PointFeature } from 'supercluster';
import style from '.././Common/common.module.scss';
import ProjectTypeIcon from './ProjectTypeIcon';
import { useState } from 'react';
import { RegisteredTreeIcon } from '../../../../../../public/assets/images/icons/myForestMapIcons/PointMarkerIcons';
import DonationPopup from '../Popup/DonationPopup';
import RegisterTreePopup from '../Popup/RegistertreePopUp';
import {
  DonationProperties,
  MyContributionsSingleRegistration,
  ProfilePageType,
} from '../../../../common/types/myForestv2';

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

  return (
    <div
      onMouseLeave={() => setIsCursorOnMarker(false)}
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
              <RegisterTreePopup
                superclusterResponse={
                  superclusterResponse as PointFeature<MyContributionsSingleRegistration>
                }
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

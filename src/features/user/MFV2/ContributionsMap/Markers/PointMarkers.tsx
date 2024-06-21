import { Marker } from 'react-map-gl-v7';
import { PointFeature } from 'supercluster';
import style from '.././Common/common.module.scss';
import ProjectTypeIcon from './ProjectTypeIcon';
import { useState } from 'react';
import { RegisteredTreeIcon } from '../../../../../../public/assets/images/icons/myForestMapIcons/PointMarkerIcons';
import DonationPopup from '../Popup/DonationPopup';
import RegisterTreePopup from '../Popup/RegistertreePopUp';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';
import {
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

  const isDonation = 'projectInfo' in superclusterResponse.properties;

  return (
    <div
      onMouseLeave={() => setIsCursorOnMarker(false)}
      onMouseEnter={() => setIsCursorOnMarker(true)}
    >
      <Marker
        longitude={superclusterResponse.geometry.coordinates[0]}
        latitude={superclusterResponse.geometry.coordinates[1]}
        offset={[0, -15]}
      >
        {isDonation ? (
          <>
            {(isCursorOnMarker || isCursorOnPopup) && (
              <DonationPopup {...donationPopupProps} />
            )}
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
          </>
        ) : (
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
        )}
      </Marker>
    </div>
  );
};

export default PointMarkers;

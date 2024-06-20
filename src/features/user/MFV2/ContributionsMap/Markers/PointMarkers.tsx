import { Marker } from 'react-map-gl-v7';
import { PointFeature } from 'supercluster';
import style from '.././Common/common.module.scss';
import ProjectTypeIcon from './ProjectTypeIcon';
import { useState } from 'react';
import { RegisteredTreeIcon } from '../../../../../../public/assets/images/icons/myForestMapIcons/PointMarkerIcons';
import DonationPopup from '../Popup/DonationPopup';
import RegisterTreePopup from '../Popup/RegistertreePopUp';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';
import { MyContributionsSingleRegistration } from '../../../../common/types/myForestv2';

interface PointMarkersProps {
  superclusterResponse: PointFeature<
    DonationProperties | MyContributionsSingleRegistration
  >;
  pageType: 'public' | 'private';
  supportedTreecounter: string | undefined;
}

const PointMarkers = ({
  superclusterResponse,
  pageType,
  supportedTreecounter,
}: PointMarkersProps) => {
  if (!superclusterResponse) return null;
  const [showPopup, setShowPopUp] = useState(false);

  const handlePopupOpen = () => {
    setShowPopUp(true);
  };

  const handlePopupClose = () => {
    setTimeout(() => {
      setShowPopUp(false);
    }, 1500);
  };

  const donationPopupProps = {
    superclusterResponse:
      superclusterResponse as PointFeature<DonationProperties>,
    setShowPopUp,
    handlePopupClose,
    pageType,
    supportedTreecounter,
  };

  const isDonation = 'projectInfo' in superclusterResponse.properties;

  return (
    <Marker
      longitude={superclusterResponse.geometry.coordinates[0]}
      latitude={superclusterResponse.geometry.coordinates[1]}
      offset={[0, -15]}
    >
      {isDonation ? (
        <>
          {true && <DonationPopup {...donationPopupProps} />}
          <div onMouseEnter={handlePopupOpen}>
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
      ) : (
        <>
          {showPopup && (
            <RegisterTreePopup
              superclusterResponse={
                superclusterResponse as PointFeature<MyContributionsSingleRegistration>
              }
            />
          )}
          <div
            className={style.registeredTreeMarkerContainer}
            onMouseEnter={handlePopupOpen}
            onMouseLeave={() => setShowPopUp(false)}
          >
            <RegisteredTreeIcon />
          </div>
        </>
      )}
    </Marker>
  );
};

export default PointMarkers;

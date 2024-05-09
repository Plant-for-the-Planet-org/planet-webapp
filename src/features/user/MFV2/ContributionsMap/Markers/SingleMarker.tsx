import { Marker } from 'react-map-gl-v7';
import RegisterTreePopup from '../Popup/RegistertreePopUp';
import { renderIcons } from './CustomMarkers';
import { useState } from 'react';
import ContributionPopup from '../Popup/ContributionPopup';

const SingleMarker = ({ singleLocation }) => {
  const [showPopup, setShowPopUp] = useState(false);
  return (
    <>
      {showPopup && !singleLocation.properties.isTreeRegistered && (
        <ContributionPopup singleLocation={singleLocation} />
      )}
      {true && singleLocation.properties.isTreeRegistered && (
        <RegisterTreePopup singleLocation={singleLocation} />
      )}

      <Marker
        longitude={singleLocation?.geometry.coordinates[0]}
        latitude={singleLocation?.geometry.coordinates[1]}
      >
        <div
          onMouseEnter={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          {renderIcons(singleLocation.properties)}
        </div>
      </Marker>
    </>
  );
};

export default SingleMarker;

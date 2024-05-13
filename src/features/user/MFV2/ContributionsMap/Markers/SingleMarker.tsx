import { Marker } from 'react-map-gl-v7';
import RegisterTreePopup from '../Popup/RegistertreePopUp';
import { ProjectTypeIcon } from './Markers';
import RegisteredTreeIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/RegisteredTreeIcon';
import { useState } from 'react';
import ContributionPopup from '../Popup/ContributionPopup';

const SingleMarker = ({ singleLocation }) => {
  const [showPopup, setShowPopUp] = useState(false);

  const handleMouseEnter = () => {
    setShowPopUp(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setShowPopUp(false);
    }, 3000);
  };

  const renderIcons = (properties: any) => {
    if (properties.type !== 'registration') {
      return (
        <ProjectTypeIcon
          purpose={properties.project.purpose}
          classification={properties.project.classification}
        />
      );
    } else {
      return <RegisteredTreeIcon />;
    }
  };
  return (
    <>
      {showPopup && singleLocation.properties.type !== 'registration' && (
        <ContributionPopup singleLocation={singleLocation} />
      )}
      {showPopup && singleLocation.properties.type === 'registration' && (
        <RegisterTreePopup singleLocation={singleLocation} />
      )}

      <Marker
        longitude={singleLocation?.geometry.coordinates[0]}
        latitude={singleLocation?.geometry.coordinates[1]}
      >
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {renderIcons(singleLocation.properties)}
        </div>
      </Marker>
    </>
  );
};

export default SingleMarker;

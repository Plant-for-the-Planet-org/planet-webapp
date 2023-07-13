import { Marker, Popup } from 'react-map-gl';
import { useState } from 'react';
import { PlantedTreesGreenSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';

const SingleMarker = ({ geoJson }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  return (
    <div className={MyForestMapStyle.singleMarkerContainer}>
      {showPopUp && (
        <Popup
          className={MyForestMapStyle.mapboxglPopup}
          latitude={geoJson.geometry.coordinates[1]}
          longitude={geoJson?.geometry.coordinates[0]}
          offsetTop={-15}
          offsetLeft={20}
          anchor="bottom"
          closeButton={false}
        >
          <div className={MyForestMapStyle.popUpContainer}>
            <div>
              <p className={MyForestMapStyle.popUpLabel}>Donated</p>
              <p className={MyForestMapStyle.popUpDate}>April 4, 2023</p>
            </div>
          </div>
        </Popup>
      )}
      <Marker
        latitude={geoJson?.geometry.coordinates[1]}
        longitude={geoJson?.geometry.coordinates[0]}
      >
        <div
          className={MyForestMapStyle.markerContainer}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            <PlantedTreesGreenSvg />
          </div>
          <div className={MyForestMapStyle.trees}>
            {geoJson.properties?.quantity}
          </div>
        </div>
      </Marker>
    </div>
  );
};

export default SingleMarker;

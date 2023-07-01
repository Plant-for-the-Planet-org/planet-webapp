import { Marker } from 'react-map-gl';
import { useState } from 'react';
import { PlantedTreesGreenSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import CustomPopUp from './CustomPopUp';

const ClusterMarker = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  return (
    <>
      {showPopUp && (
        <CustomPopUp
          latitude={20.488315723965606}
          longitude={78.06945962979997}
        />
      )}
      <Marker latitude={20.488315723965606} longitude={78.06945962979997}>
        <div
          className={MyForestMapStyle.clusterMarkerContainer}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            <PlantedTreesGreenSvg />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>4 trees</div>
        </div>
      </Marker>
    </>
  );
};

export default ClusterMarker;

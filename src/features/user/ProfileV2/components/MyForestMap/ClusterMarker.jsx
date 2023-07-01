import { Marker } from 'react-map-gl';
import { PlantedTreesGreenSvg } from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';

const ClusterMarker = () => {
  return (
    <Marker latitude={20.488315723965606} longitude={78.06945962979997}>
      <div className={MyForestMapStyle.clusterMarkerContainer}>
        <div className={MyForestMapStyle.svgContainer}>
          <PlantedTreesGreenSvg />
        </div>
        <div className={MyForestMapStyle.totalTreeCount}>4 trees</div>
      </div>
    </Marker>
  );
};

export default ClusterMarker;

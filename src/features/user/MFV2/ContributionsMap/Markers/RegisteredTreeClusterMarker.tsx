import { Marker } from 'react-map-gl-v7';
import RegisteredTreeClusterMarkerIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/ClusterMarker/RegisteredTreeClusterMarkerIcon';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';

const RegisteredTreeClusterMarker = ({ geoJson, viewport, mapRef }) => {
  return (
    <Marker
      longitude={geoJson?.geometry.coordinates[0]}
      latitude={geoJson?.geometry.coordinates[1]}
    >
      <RegisteredTreeClusterMarkerIcon width={68} />
    </Marker>
  );
};

export default RegisteredTreeClusterMarker;

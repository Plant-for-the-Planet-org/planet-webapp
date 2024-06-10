import { Marker } from 'react-map-gl-v7';
import RegisteredTreeClusterMarkerIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/ClusterMarker/RegisteredTreeClusterMarkerIcon';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { ClusterMarkerProps } from './ClusterMarker';

type RegisteredTreeClusterMarkerProp = Omit<
  ClusterMarkerProps,
  'viewport' | 'mapRef'
>;

const RegisteredTreeClusterMarker = ({
  superclusterResponse,
}: RegisteredTreeClusterMarkerProp) => {
  return (
    <Marker
      longitude={superclusterResponse?.geometry.coordinates[0]}
      latitude={superclusterResponse?.geometry.coordinates[1]}
    >
      <RegisteredTreeClusterMarkerIcon width={68} />
    </Marker>
  );
};

export default RegisteredTreeClusterMarker;

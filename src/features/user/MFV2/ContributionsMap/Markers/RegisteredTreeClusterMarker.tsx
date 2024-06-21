import { Marker } from 'react-map-gl-v7';
import { ClusterMarkerProps } from './ClusterMarker';
import { RegisteredTreeClusterMarkerIcon } from '../../../../../../public/assets/images/icons/myForestMapIcons/ClusterMarkerIcons';

type RegisteredTreeClusterMarkerProp = Omit<
  ClusterMarkerProps,
  'viewport' | 'mapRef'
>;

const RegisteredTreeClusterMarker = ({
  superclusterResponse,
}: RegisteredTreeClusterMarkerProp) => {
  const longitude = superclusterResponse?.geometry.coordinates[0];
  const latitude = superclusterResponse?.geometry.coordinates[1];
  return (
    <Marker longitude={longitude} latitude={latitude}>
      <RegisteredTreeClusterMarkerIcon width={68} />
    </Marker>
  );
};

export default RegisteredTreeClusterMarker;

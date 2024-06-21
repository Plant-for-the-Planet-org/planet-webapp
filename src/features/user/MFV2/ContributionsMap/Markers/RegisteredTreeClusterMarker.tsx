import { Marker } from 'react-map-gl-v7';
import { RegisteredTreeClusterMarkerIcon } from '../../../../../../public/assets/images/icons/myForestMapIcons/ClusterMarkerIcons';
import { ClusterProperties, PointFeature } from 'supercluster';

type RegisteredTreeClusterMarkerProp = {
  superclusterResponse: PointFeature<ClusterProperties>;
};

const RegisteredTreeClusterMarker = ({
  superclusterResponse,
}: RegisteredTreeClusterMarkerProp) => {
  const longitude = superclusterResponse.geometry.coordinates[0];
  const latitude = superclusterResponse.geometry.coordinates[1];
  return (
    <Marker longitude={longitude} latitude={latitude}>
      <RegisteredTreeClusterMarkerIcon width={68} />
    </Marker>
  );
};

export default RegisteredTreeClusterMarker;

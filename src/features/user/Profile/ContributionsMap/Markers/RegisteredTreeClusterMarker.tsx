import type { ClusterProperties, PointFeature } from 'supercluster';

import { Marker } from 'react-map-gl-v7';
import { RegisteredTreeClusterMarkerIcon } from '../../../../../../public/assets/images/icons/myForestMapIcons/ClusterMarkerIcons';
import styles from '../Common/common.module.scss';

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
      <div className={styles.registeredTreeClusterMarkerContainer}>
        <RegisteredTreeClusterMarkerIcon />
      </div>
    </Marker>
  );
};

export default RegisteredTreeClusterMarker;

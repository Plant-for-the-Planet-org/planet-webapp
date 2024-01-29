import { ConservAreaClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import { useEffect, useState, ReactElement } from 'react';
import { ClusterMarkerProps, Cluster } from '../../../../common/types/map';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { useMyForest } from '../../../../common/Layout/MyForestContext';

const ConservationMarker = ({ mapRef }: ClusterMarkerProps): ReactElement => {
  const { conservationProjectGeoJson, viewport } = useMyForest();
  const [clusters, setClusters] = useState<Cluster[] | undefined>(undefined);
  const { viewState } = viewport;

  useEffect(() => {
    if (conservationProjectGeoJson && viewState) {
      const data = _getClusterGeojson(
        viewState,
        mapRef,
        conservationProjectGeoJson,
        undefined
      );
      setClusters(data);
    }
  }, [viewport, conservationProjectGeoJson]);
  return (
    <>
      {clusters &&
        viewState &&
        clusters.map((singleCluster, key) => {
          if (
            viewState?.zoom <= 4 &&
            (singleCluster.id ||
              singleCluster.properties._type === 'contribution')
          ) {
            return (
              <ConservAreaClusterMarker
                mapRef={mapRef}
                geoJson={singleCluster}
                key={key}
              />
            );
          } else {
            return <SingleMarker key={key} geoJson={singleCluster} />;
          }
        })}
    </>
  );
};

export default ConservationMarker;

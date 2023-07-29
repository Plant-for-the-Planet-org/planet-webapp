import { ConservAreaClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import Supercluster from 'supercluster';
import { useEffect, useState, useContext, ReactElement } from 'react';
import { ProjectPropsContext } from '../../../../common/Layout/ProjectPropsContext';
import { _clusterConfig } from './TreesPlantedMarkers';
import {
  ClusterMarkerProps,
  Cluster,
  Bound,
} from '../../../../common/types/map';

const ConservationMarker = ({
  viewport,
  mapRef,
}: ClusterMarkerProps): ReactElement => {
  const { conservationProjects } = useContext(ProjectPropsContext);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const superclusterConserv = new Supercluster(_clusterConfig);
  const _fetch = () => {
    superclusterConserv.load(conservationProjects);
    const { viewState } = viewport;
    const zoom = viewState?.zoom;
    if (mapRef && mapRef?.current !== null) {
      const map = mapRef.current.getMap();
      const bounds = map.getBounds().toArray().flat();
      const bound: Bound = bounds && [
        bounds[0],
        bounds[1],
        bounds[2],
        bounds[3],
      ];
      if (viewport?.viewState?.zoom) {
        const _clusters = superclusterConserv?.getClusters(bound, zoom);
        setClusters(_clusters);
        return _clusters;
      }
    }
  };
  useEffect(() => {
    if (conservationProjects) {
      _fetch();
    }
  }, [viewport, conservationProjects]);

  return (
    <>
      {clusters.map((singleCluster) => {
        if (singleCluster.id) {
          return (
            <ConservAreaClusterMarker
              key={singleCluster.id}
              totalTrees={singleCluster.properties.totalTrees}
              coordinates={singleCluster.geometry.coordinates}
            />
          );
        }
      })}

      {clusters.map((singleCluster, key) => {
        if (!singleCluster.id) {
          return <SingleMarker key={key} geoJson={singleCluster} />;
        }
      })}
    </>
  );
};

export default ConservationMarker;

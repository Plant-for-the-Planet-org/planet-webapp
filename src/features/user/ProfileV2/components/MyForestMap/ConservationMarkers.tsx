import { ConservAreaClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import Supercluster from 'supercluster';
import { useEffect, useState, useContext } from 'react';
import { ProjectPropsContext } from '../../../../common/Layout/ProjectPropsContext';
import { _clusterConfig } from './TreesPlantedMarkers';

const ConservationMarker = ({ viewport, mapRef }) => {
  const { conservationProjects } = useContext(ProjectPropsContext);
  const [clusters, setClusters] = useState([]);
  const superclusterConserv = new Supercluster(_clusterConfig);
  const _fetch = () => {
    superclusterConserv.load(conservationProjects);
    const { viewState } = viewport;
    const zoom = viewState?.zoom;
    const map = mapRef.current ? mapRef.current.getMap() : null;
    const bounds = map ? map.getBounds().toArray().flat() : null;
    const bound = bounds ? [bounds[0], bounds[1], bounds[2], bounds[3]] : null;
    if (viewport?.viewState?.zoom) {
      const _clusters = superclusterConserv?.getClusters(bound, zoom);
      setClusters(_clusters);
      return _clusters;
    }
  };
  useEffect(() => {
    if (conservationProjects) {
      _fetch();
    }
  }, [viewport]);

  return (
    <>
      {clusters.map((singleCluster, key) => {
        if (singleCluster.id) {
          return (
            <ConservAreaClusterMarker
              key={singleCluster.id}
              totalTrees={singleCluster.properties.totalTrees}
              coordinates={singleCluster.geometry.coordinates}
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

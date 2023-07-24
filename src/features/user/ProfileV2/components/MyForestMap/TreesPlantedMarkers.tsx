import { TreePlantedClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import Supercluster from 'supercluster';
import { useState, useEffect, useContext } from 'react';
import { ProjectPropsContext } from '../../../../common/Layout/ProjectPropsContext';

export const _clusterConfig = {
  radius: 40,
  maxZoom: 5,
  map: (props) => ({
    totalTrees: props.quantity,
  }),
  reduce: (accumulator, props) => {
    if (props.totalTrees) {
      accumulator.totalTrees = accumulator.totalTrees + props.totalTrees;
    }
  },
};
const TreesPlantedMarkers = ({ viewport, mapRef }) => {
  const { treePlantedProjects } = useContext(ProjectPropsContext);
  const [clusters, setClusters] = useState([]);
  const supercluster = new Supercluster(_clusterConfig);

  const _fetch = () => {
    supercluster.load(treePlantedProjects);
    const { viewState } = viewport;
    const zoom = viewState?.zoom;
    const map = mapRef.current ? mapRef.current.getMap() : null;
    const bounds = map ? map.getBounds().toArray().flat() : null;
    const bound = bounds ? [bounds[0], bounds[1], bounds[2], bounds[3]] : null;
    if (viewport?.viewState?.zoom) {
      const _clusters = supercluster?.getClusters(bound, zoom);
      setClusters(_clusters);
      return _clusters;
    }
  };
  useEffect(() => {
    if (treePlantedProjects) {
      _fetch();
    }
  }, [viewport]);

  return (
    clusters && (
      <>
        {clusters.map((singleCluster, key) => {
          if (singleCluster.id) {
            return (
              <TreePlantedClusterMarker
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
    )
  );
};

export default TreesPlantedMarkers;

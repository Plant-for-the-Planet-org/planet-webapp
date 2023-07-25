import { TreePlantedClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import Supercluster from 'supercluster';
import { useState, useEffect, useContext, ReactElement } from 'react';
import { ProjectPropsContext } from '../../../../common/Layout/ProjectPropsContext';
import React from 'react';
import {
  TestPointProps,
  TestClusterProps,
  Cluster,
  ClusterMarkerProps,
  Bound,
} from '../../../../common/types/map';

export const _clusterConfig = {
  radius: 40,
  maxZoom: 5,
  map: (props: TestPointProps): TestClusterProps => ({
    totalTrees: props.quantity,
  }),
  reduce: (accumulator: any, props: any) => {
    if (props.totalTrees) {
      accumulator.totalTrees = accumulator.totalTrees + props.totalTrees;
    }
  },
};

const TreesPlantedMarkers = ({
  viewport,
  mapRef,
}: ClusterMarkerProps): ReactElement => {
  const { treePlantedProjects } = useContext(ProjectPropsContext);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const superclusterConserv = new Supercluster(_clusterConfig);

  const _fetch = () => {
    superclusterConserv.load(treePlantedProjects);
    const { viewState } = viewport;
    const zoom = viewState?.zoom;
    if (mapRef && mapRef.current !== null) {
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

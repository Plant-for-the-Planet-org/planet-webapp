import { TreePlantedClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import Supercluster from 'supercluster';
import { useState, useEffect, ReactElement } from 'react';
import React from 'react';
import {
  TestPointProps,
  TestClusterProps,
  Cluster,
  ClusterMarkerProps,
  Bound,
} from '../../../../common/types/map';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';

export const _clusterConfig = {
  radius: 40,
  maxZoom: 5,
  map: (props: TestPointProps): TestClusterProps => ({
    totalTrees: props.quantity,
  }),
  reduce: (accumulator: any, props: any) => {
    if (props.totalTrees) {
      accumulator.totalTrees =
        Number(accumulator.totalTrees) + Number(props.totalTrees);
    }
  },
};

const TreesPlantedMarkers = ({
  viewport,
  mapRef,
}: ClusterMarkerProps): ReactElement => {
  const { treePlantedProjects } = useProjectProps();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const supercluster = new Supercluster(_clusterConfig);

  supercluster.load(treePlantedProjects);
  const _fetch = () => {
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
        const _clusters = supercluster?.getClusters(bound, zoom);
        setClusters(_clusters);
        return _clusters;
      }
    }
  };
  useEffect(() => {
    if (treePlantedProjects) {
      _fetch();
    }
  }, [viewport, treePlantedProjects]);

  return (
    clusters && (
      <>
        {clusters.map((singleCluster) => {
          if (
            singleCluster.id ||
            singleCluster?.properties?.totalContribution > 1
          ) {
            return (
              <TreePlantedClusterMarker
                key={singleCluster.id}
                geoJson={singleCluster}
              />
            );
          }
        })}
        {clusters.map((singleCluster, key) => {
          if (
            !singleCluster.id &&
            singleCluster?.properties?.totalContribution < 2
          ) {
            return <SingleMarker key={key} geoJson={singleCluster} />;
          }
        })}
      </>
    )
  );
};

export default TreesPlantedMarkers;

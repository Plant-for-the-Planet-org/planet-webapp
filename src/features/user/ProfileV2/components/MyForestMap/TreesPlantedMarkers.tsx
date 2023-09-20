import { TreePlantedClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import { useState, useEffect, ReactElement } from 'react';
import React from 'react';
import {
  ClusterMarkerProps,
  TestClusterProps,
  TestPointProps,
} from '../../../../common/types/map';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { ClusterFeature, PointFeature } from 'supercluster';

const TreesPlantedMarkers = ({
  viewport,
  mapRef,
}: ClusterMarkerProps): ReactElement => {
  const { treePlantedProjects } = useProjectProps();
  const [clusters, setClusters] = useState<
    | (ClusterFeature<TestClusterProps> | PointFeature<TestPointProps>)[]
    | undefined
  >(undefined);
  const { viewState } = viewport;

  useEffect(() => {
    if (treePlantedProjects) {
      const data = _getClusterGeojson(viewState, mapRef, treePlantedProjects);
      setClusters(data);
    }
  }, [viewport, treePlantedProjects]);

  return clusters ? (
    <>
      {clusters.map((singleCluster, key) => {
        if (
          singleCluster.id ||
          singleCluster?.properties?.totalContribution > 1
        ) {
          return <TreePlantedClusterMarker key={key} geoJson={singleCluster} />;
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
  ) : (
    <></>
  );
};

export default TreesPlantedMarkers;

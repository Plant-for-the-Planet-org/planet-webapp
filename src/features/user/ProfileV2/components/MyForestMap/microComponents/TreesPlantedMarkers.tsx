import { TreePlantedClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import { useState, useEffect, ReactElement } from 'react';
import React from 'react';
import {
  Cluster,
  ClusterMarkerProps,
  TestClusterProps,
  TestPointProps,
} from '../../../../../common/types/map';
import { _getClusterGeojson } from '../../../../../../utils/superclusterConfig';
import { ClusterFeature, PointFeature } from 'supercluster';
import { useMyForest } from '../../../../../common/Layout/MyForestContext';

const TreesPlantedMarkers = ({
  mapRef,
  profile,
}: ClusterMarkerProps): ReactElement => {
  const { treePlantationProjectGeoJson, viewport } = useMyForest();
  const [clusters, setClusters] = useState<
    | (
        | ClusterFeature<TestClusterProps>
        | PointFeature<TestPointProps>
        | Cluster
      )[]
    | undefined
  >(undefined);
  const { viewState } = viewport;

  useEffect(() => {
    if (treePlantationProjectGeoJson && viewState) {
      const data = _getClusterGeojson(
        viewState,
        mapRef,
        treePlantationProjectGeoJson,
        undefined
      );
      setClusters(data);
    }
  }, [viewport]);

  return clusters && viewState ? (
    <>
      {clusters.map((singleCluster, key) => {
        if (
          viewState?.zoom <= 4 &&
          (singleCluster.id ||
            singleCluster.properties._type === 'contribution' ||
            'gift' ||
            'merged_contribution_and_gift')
        ) {
          return (
            <TreePlantedClusterMarker
              key={key}
              geoJson={singleCluster}
              mapRef={mapRef}
            />
          );
        } else {
          return (
            <SingleMarker key={key} geoJson={singleCluster} profile={profile} />
          );
        }
      })}
    </>
  ) : (
    <></>
  );
};

export default TreesPlantedMarkers;

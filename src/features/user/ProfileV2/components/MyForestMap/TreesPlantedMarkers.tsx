import { TreePlantedClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import { useState, useEffect, ReactElement } from 'react';
import React from 'react';
import {
  ClusterMarkerProps,
  TestClusterProps,
  TestPointProps,
} from '../../../../common/types/map';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { ClusterFeature, PointFeature } from 'supercluster';
import { useMyForest } from '../../../../common/Layout/MyForestContext';

const TreesPlantedMarkers = ({
  viewport,
  mapRef,
}: ClusterMarkerProps): ReactElement => {
  const { treePlantationProjectGeoJson, treePlantGeoJson } = useMyForest();
  const [clusters, setClusters] = useState<
    | (ClusterFeature<TestClusterProps> | PointFeature<TestPointProps>)[]
    | undefined
  >(undefined);
  const { viewState } = viewport;

  useEffect(() => {
    if (treePlantationProjectGeoJson) {
      const data = _getClusterGeojson(
        viewState,
        mapRef,
        treePlantationProjectGeoJson
      );
      setClusters(data);
    }
  }, [viewport, treePlantGeoJson]);

  return clusters ? (
    <>
      {clusters.map((singleCluster, key) => {
        if (
          viewState?.zoom < 3.5 &&
          (singleCluster.id ||
            singleCluster.properties._type == 'contribution' ||
            'gift' ||
            'merged_contribution_and_gift')
        ) {
          return (
            <TreePlantedClusterMarker
              key={key}
              geoJson={singleCluster}
              treePlantationProjectGeoJson={treePlantGeoJson}
              viewState={viewState}
              mapRef={mapRef}
            />
          );
        } else {
          return <SingleMarker key={key} geoJson={singleCluster} />;
        }
      })}
    </>
  ) : (
    <></>
  );
};

export default TreesPlantedMarkers;

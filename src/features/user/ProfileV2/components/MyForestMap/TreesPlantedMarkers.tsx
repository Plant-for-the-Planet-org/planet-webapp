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
  const { treePlantationProjectGeoJson } = useMyForest();
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
        treePlantationProjectGeoJson,
        undefined
      );
      setClusters(data);
    }
  }, [viewport, treePlantationProjectGeoJson]);

  return clusters ? (
    <>
      {clusters.map((singleCluster, key) => {
        if (singleCluster.id) {
          return (
            <TreePlantedClusterMarker
              key={key}
              geoJson={singleCluster}
              treePlantationProjectGeoJson={treePlantationProjectGeoJson}
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

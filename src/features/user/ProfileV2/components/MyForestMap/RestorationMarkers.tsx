import { RestoredClusterMarker } from './ClusterMarker';
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

const RestoredMarker = ({
  viewport,
  mapRef,
}: ClusterMarkerProps): ReactElement => {
  const { restorationGeoJson } = useMyForest();
  const [clusters, setClusters] = useState<
    | (ClusterFeature<TestClusterProps> | PointFeature<TestPointProps>)[]
    | undefined
  >(undefined);
  const { viewState } = viewport;

  useEffect(() => {
    if (restorationGeoJson) {
      const data = _getClusterGeojson(
        viewState,
        mapRef,
        restorationGeoJson,
        undefined
      );
      setClusters(data);
    }
  }, [viewport, restorationGeoJson]);

  return clusters ? (
    <>
      {clusters.map((singleCluster, key) => {
        if (
          viewState?.zoom < 3.1 &&
          (singleCluster.id || singleCluster.properties._type == 'contribution')
        ) {
          return (
            <RestoredClusterMarker
              key={key}
              geoJson={singleCluster}
              treePlantationProjectGeoJson={restorationGeoJson}
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

export default RestoredMarker;

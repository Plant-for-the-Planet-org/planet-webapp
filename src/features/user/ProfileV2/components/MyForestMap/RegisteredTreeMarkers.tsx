import { RegisteredTreeClusterMarker } from './ClusterMarker';
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

const RegisteredTreeMarker = ({
  viewport,
  mapRef,
}: ClusterMarkerProps): ReactElement => {
  const { registeredTreeGeoJson } = useMyForest();
  const [clusters, setClusters] = useState<
    | (ClusterFeature<TestClusterProps> | PointFeature<TestPointProps>)[]
    | undefined
  >(undefined);
  const { viewState } = viewport;

  useEffect(() => {
    if (registeredTreeGeoJson) {
      const data = _getClusterGeojson(
        viewState,
        mapRef,
        registeredTreeGeoJson,
        undefined
      );
      setClusters(data);
    }
  }, [viewport, registeredTreeGeoJson]);

  return clusters ? (
    <>
      {clusters.map((singleCluster, key) => {
        if (
          viewState?.zoom < 3.1 &&
          (singleCluster.id || singleCluster.properties._type == 'contribution')
        ) {
          return (
            <RegisteredTreeClusterMarker
              key={key}
              geoJson={singleCluster}
              treePlantationProjectGeoJson={registeredTreeGeoJson}
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

export default RegisteredTreeMarker;

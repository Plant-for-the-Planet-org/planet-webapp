import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { useEffect, useState } from 'react';
import {
  contributions,
  registeredTree,
} from '../../../../../utils/myForestV2Utils';
import ClusterMarker from './ClusterMarker';
import SinglePointMarkers from './SinglePointMarkers';
import RegisteredTreeClusterMarker from './RegisteredTreeClusterMarker';

const Markers = ({ mapRef, viewport }) => {
  const [superclusterResponse, setSuperclusteResponse] = useState([]);
  const [superclusterResponseX, setSuperclusteResponseX] = useState([]);

  useEffect(() => {
    if (contributions && viewport) {
      const data1 = _getClusterGeojson(
        viewport,
        mapRef,
        contributions,
        undefined
      );
      setSuperclusteResponse(data1);

      const data2 = _getClusterGeojson(
        viewport,
        mapRef,
        registeredTree,
        undefined
      );
      setSuperclusteResponseX(data2);
    }
  }, [viewport, contributions, registeredTree]);

  return (
    <>
      {superclusterResponse.map((geoJson) => {
        return geoJson.id ? (
          <ClusterMarker
            geoJson={geoJson}
            viewport={viewport}
            mapRef={mapRef}
          />
        ) : (
          <SinglePointMarkers superClusterResponse={geoJson} />
        );
      })}
      {superclusterResponseX.map((geoJson) => {
        return geoJson.id ? (
          <RegisteredTreeClusterMarker
            geoJson={geoJson}
            viewport={viewport}
            mapRef={mapRef}
          />
        ) : (
          <SinglePointMarkers superClusterResponse={geoJson} />
        );
      })}
    </>
  );
};

export default Markers;

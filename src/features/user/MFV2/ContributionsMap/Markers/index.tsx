import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { useEffect, useState } from 'react';
import { contributions } from '../../../../../utils/myForestV2Utils';
import ClusterMarker from './ClusterMarker';
import SinglePointMarkers from './SinglePointMarkers';

const Markers = ({ mapRef, viewport }) => {
  const [superclusterResponse, setSuperclusteResponse] = useState([]);
  useEffect(() => {
    if (contributions && viewport) {
      const data = _getClusterGeojson(
        viewport,
        mapRef,
        contributions,
        undefined
      );
      setSuperclusteResponse(data);
    }
  }, [viewport, contributions]);

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
    </>
  );
};

export default Markers;

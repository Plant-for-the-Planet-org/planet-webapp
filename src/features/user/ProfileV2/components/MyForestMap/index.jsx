import MapGL from 'react-map-gl';
import { useState, useEffect, useRef } from 'react';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import SingleMarker from './SingleMarker';
import ClusterMarker from './ClusterMarker';

const MyForestMap = () => {
  const mapRef = useRef(null);
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const [mapState, setMapState] = useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 25,
  });
  const defaultMapCenter = [36.96, -28.5];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = useState({
    width: '100vw',
    height: '560px',
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  useEffect(() => {
    //loads the default mapstyle
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);
  return (
    <>
      <MapGL ref={mapRef} {...mapState} {...viewport}>
        <SingleMarker />
        <ClusterMarker />
      </MapGL>
    </>
  );
};

export default MyForestMap;

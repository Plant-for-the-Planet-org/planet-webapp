import MapGL, { NavigationControl } from 'react-map-gl';
import { useState, useEffect, useRef } from 'react';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import TreesPlantedMarkers from './TreesPlantedMarkers';
import ConservationMarkers from './ConservationMarkers';

// interface MyForestProps {
//   isTreePlantedButtonActive: boolean;
//   isConservedButtonActive: boolean;
// }
const MyForestMap = ({
  isTreePlantedButtonActive,
  isConservedButtonActive,
}) => {
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
  let defaultZoom = 1;
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
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
  // handles viewport state
  const _handleViewport = (newViewport) =>
    setViewport({ ...viewport, ...newViewport });

  const _activeMarker = () => {
    if (
      isTreePlantedButtonActive === false &&
      isConservedButtonActive === false
    )
      return true;
  };

  return (
    <div className={MyForestMapStyle.mapContainer}>
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        onViewStateChange={_handleViewport}
      >
        {(_activeMarker() ||
          (isTreePlantedButtonActive && !isConservedButtonActive)) && (
          <TreesPlantedMarkers
            viewport={viewport}
            setViewport={setViewport}
            mapRef={mapRef}
          />
        )}
        {(_activeMarker() ||
          (!isTreePlantedButtonActive && isConservedButtonActive)) && (
          <ConservationMarkers
            viewport={viewport}
            setViewport={setViewport}
            mapRef={mapRef}
          />
        )}
        <NavigationControl showCompass={false} />
      </MapGL>
    </div>
  );
};

export default MyForestMap;

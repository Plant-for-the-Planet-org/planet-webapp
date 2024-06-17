import { useEffect, useState } from 'react';
import Map, { MapStyle } from 'react-map-gl-v7/maplibre';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NavigationControl } from 'react-map-gl-v7';
import SinglePointMarkers from './Markers/SinglePointMarkers';
import MapCredits from './Common/MapCredits';
import style from './Common/common.module.scss';
import ContributionStats from './Common/ContributionStats';

interface MapState {
  mapStyle: MapStyle;
  dragPan: boolean;
  scrollZoom: boolean;
  minZoom: number;
  maxZoom: number;
}

const EMPTY_STYLE = {
  version: 8,
  sources: {},
  layers: [] as MapStyle['layers'],
} as const;

function ContributionsMap() {
  // mapState and viewState logic will need to be refined and move elsewhere (either context or props) once we fetch data from the API
  const [mapState, setMapState] = useState<MapState>({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 15,
  });

  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1,
  });

  useEffect(() => {
    async function loadMapStyle() {
      const result = await getMapStyle('myForestMap');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);

  return (
    <div className={style.mapSubContainer}>
      <Map
        {...viewState}
        {...mapState}
        onMove={(e) => setViewState(e.viewState)}
        attributionControl={false}
      >
        <SinglePointMarkers />
        <MapCredits />
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
      <ContributionStats />
    </div>
  );
}

export default ContributionsMap;

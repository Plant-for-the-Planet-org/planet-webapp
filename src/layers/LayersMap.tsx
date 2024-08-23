import { useEffect, useState } from 'react';
import Map, { MapStyle, Source, Layer } from 'react-map-gl-v7/maplibre';
import getMapStyle from '../utils/maps/getMapStyle';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useRef, MutableRefObject } from 'react';
import { ViewState } from 'react-map-gl-v7';

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

function LayersMap() {
  const mapRef: MutableRefObject<null> = useRef(null);
  // mapState and viewState logic will need to be refined and move elsewhere (either context or props) once we fetch data from the API
  const [mapState, setMapState] = useState<MapState>({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 15,
  });

  const [viewState, setViewState] = useState<ViewState>({
    longitude: 0,
    latitude: 0,
    zoom: 1,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  useEffect(() => {
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);

  return (
    <Map
      {...viewState}
      {...mapState}
      onMove={(e) => setViewState(e.viewState)}
      attributionControl={false}
      ref={mapRef}
    >
      <Source
        id="fire-risk"
        type="raster"
        tiles={[
          // Fire Risk
          'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/9c4db4d0bbe22da0e7c252cc39ca9d65-88782d9edf58c24334f9ab81d59d9e4f/tiles/{z}/{x}/{y}',
          // Forest Loss
          // 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/cb7f90f0d0875a3557fad12f4a468ce1-d7a14f7048148e3d37f9f42c13b71045/tiles/{z}/{x}/{y}',
          // Forest Cover
          // 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/2e00d858b743bf442ec4474099cbcdc4-db5c0eacce379d0107482bd018f514e2/tiles/{z}/{x}/{y}',
          // TreeCover
          // 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/eabdbbf182ff7011e261117963d42645-b5e2d72260feed9bb04c9d2929b61482/tiles/{z}/{x}/{y}',
          // Carbon Potential
          // 'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/532c05ae29f0bd7c3bdb152cdce3d916-74b4d50606b45eff31bda033bc2c112d/tiles/{z}/{x}/{y}',
        ]}
        tileSize={256}
      >
        <Layer id="fire-risk-layer" source="fire-risk" type="raster" />
      </Source>
      <NavigationControl position="bottom-right" showCompass={false} />
    </Map>
  );
}

export default LayersMap;

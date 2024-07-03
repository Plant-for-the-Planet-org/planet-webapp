import { useEffect, useState } from 'react';
import Map, { MapStyle } from 'react-map-gl-v7/maplibre';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NavigationControl } from 'react-map-gl-v7/maplibre';
import MapCredits from './Common/MapCredits';
import Markers from './Markers';
import { useRef, MutableRefObject } from 'react';
import style from './Common/common.module.scss';
import ContributionStats from './Common/ContributionStats';
import { ProfilePageType } from '../../../common/types/myForestv2';
import { ViewState } from 'react-map-gl-v7';

interface ContributionsMapProps {
  profilePageType: ProfilePageType;
  supportedTreecounter?: string | undefined;
}
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

function ContributionsMap({
  profilePageType,
  supportedTreecounter,
}: ContributionsMapProps) {
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
        ref={mapRef}
      >
        <Markers
          mapRef={mapRef}
          viewState={viewState}
          setViewState={setViewState}
          profilePageType={profilePageType}
          supportedTreecounter={supportedTreecounter}
        />
        <MapCredits />
        <NavigationControl position="bottom-right" showCompass={false} />
      </Map>
      <ContributionStats />
    </div>
  );
}

export default ContributionsMap;

import { useEffect, useState } from 'react';
import Map, { MapStyle } from 'react-map-gl-v7/maplibre';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Marker, NavigationControl } from 'react-map-gl-v7';
import MyForestMapCredit from '../../Profile/components/MyForestMap/microComponents/MyForestMapCredit';
import RegisteredTreeIcon from '../../../../../public/assets/images/icons/myForestV2Icons/RegisteredTreeIcon';
import style from './contributionMap.module.scss';

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
  const contributionLocation = [
    {
      geometry: {
        coordinates: [73.09064459228588, 19.19969904795899],
        type: 'Point',
      },
      properties: {
        contributionType: 'registered',
        _type: 'contribution',
        startDate: 'Thu May 02 2024 05:30:00 GMT+0530 (India Standard Time)',
        quantity: '1',
        projectStatus: 'a',
        projectType: 'treePlantation',
      },
    },
    {
      geometry: {
        coordinates: [56.09064459228588, 23.19969904795899],
        type: 'Point',
      },
      properties: {
        contributionType: 'registered',
        _type: 'contribution',
        startDate: 'Thu May 02 2024 05:30:00 GMT+0530 (India Standard Time)',
        quantity: '1',
        projectStatus: 'b',
        projectType: 'conservation',
      },
    },
    {
      geometry: {
        coordinates: [24.09064459228588, 45.19969904795899],
        type: 'Point',
      },
      properties: {
        contributionType: 'registered',
        _type: 'contribution',
        startDate: 'Thu May 02 2024 05:30:00 GMT+0530 (India Standard Time)',
        quantity: '1',
        projectStatus: 'c',
        projectType: 'restoration',
      },
    },
  ];
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

  const renderIcons = ({ projectType }: any) => {
    if (projectType === 'restoration') {
      return (
        <div
          className={`${style.markerIconContainerR} ${style.markerIconContainer}`}
        >
          {/* {can include switch statment to render different icons} */}
          <RegisteredTreeIcon />
        </div>
      );
    } else if (projectType === 'conservation') {
      return (
        <div className={`${style.conservation} ${style.markerIconContainer}`}>
          <RegisteredTreeIcon />
        </div>
      );
    } else {
      return (
        <div className={`${style.treePlantation} ${style.markerIconContainer}`}>
          <RegisteredTreeIcon />
        </div>
      );
    }
  };
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
    <Map
      {...viewState}
      {...mapState}
      onMove={(e) => setViewState(e.viewState)}
      attributionControl={false}
    >
      {contributionLocation.map((singleLocation, key) => {
        return (
          <Marker
            key={key}
            longitude={singleLocation?.geometry.coordinates[0]}
            latitude={singleLocation?.geometry.coordinates[1]}
          >
            {renderIcons(singleLocation.properties)}
          </Marker>
        );
      })}
      <MyForestMapCredit />
      <NavigationControl position="bottom-right" showCompass={false} />
    </Map>
  );
}

export default ContributionsMap;

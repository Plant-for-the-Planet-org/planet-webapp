import React, { ReactElement } from 'react';
import styles from '../TreeMapper.module.scss';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import i18next from '../../../../../i18n';
import * as turf from '@turf/turf';
import MapGL, { FlyToInterpolator, Layer, MapEvent, Marker, NavigationControl, Source, WebMercatorViewport } from 'react-map-gl';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import LayerIcon from '../../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../../public/assets/images/icons/LayerDisabled';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import * as d3 from 'd3-ease';
import { useRouter } from 'next/router';
import SatelliteLayer from '../../../projects/components/maps/SatelliteLayer';

interface Props {
  locations: any;
  selectedLocation: string;
  setselectedLocation: Function;
}

export default function MyTreesMap({
  locations,
  selectedLocation,
  setselectedLocation,
}: Props): ReactElement {
  const router = useRouter();
  const { useTranslation } = i18next;
  const { i18n, t } = useTranslation('me');

  const { isMobile } = React.useContext(ProjectPropsContext);

  const defaultMapCenter = [-28.5, 36.96];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const [satellite, setSatellite] = React.useState(false);

  const [geoJson, setGeoJson] = React.useState();
  const [plIds, setPlIds] = React.useState(null);
  const [imagePopup, setImagePopup] = React.useState(null);
  let timer: NodeJS.Timeout;

  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });

  const getPlTreeCount = (pl: any) => {
    let count = 0;
    if (pl && pl.plantedSpecies) {
      for (const key in pl.plantedSpecies) {
        if (Object.prototype.hasOwnProperty.call(pl.plantedSpecies, key)) {
          const element = pl.plantedSpecies[key];
          count += element.treeCount;
        }
      }
      return count;
    } else {
      return 0;
    }
  };

  const getPlArea = (pl: any) => {
    if (pl && pl.type === 'multi') {
      const area = turf.area(pl.geometry);
      return area / 10000;
    } else {
      return 0;
    }
  };

  const getPolygonColor = (pl: any) => {
    const treeCount = getPlTreeCount(pl);
    const plantationArea = getPlArea(pl);
    const density = treeCount / plantationArea;
    if (density > 2500) {
      return 0.5;
    } else if (density > 2000) {
      return 0.4;
    } else if (density > 1600) {
      return 0.3;
    } else if (density > 1000) {
      return 0.2;
    } else {
      return 0.1;
    }
  };

  const getDateDiff = (pl: any) => {
    const today = new Date();
    const plantationDate = new Date(pl.plantDate?.substr(0, 10));
    const differenceInTime = today.getTime() - plantationDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDays < 1) {
      return t('today');
    } else if (differenceInDays < 2) {
      return t('yesterday');
    } else if (differenceInDays < 30) {
      return t('daysAgo', {
        days: localizedAbbreviatedNumber(i18n.language, differenceInDays, 0),
      });
    } else {
      return null;
    }
  };

  const zoomToLocation = (geometry: any) => {
    if (viewport.width && viewport.height) {
      const bbox = turf.bbox(geometry);
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        viewport
      ).fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        {
          padding: {
            top: isMobile ? 50 : 100,
            bottom: isMobile ? 200 : 100,
            left: isMobile ? 50 : 100,
            right: isMobile ? 50 : 100,
          },
        }
      );
      const newViewport = {
        ...viewport,
        longitude,
        latitude,
        zoom,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setViewPort(newViewport);
    } else {
      const newViewport = {
        ...viewport,
        height: window.innerHeight,
        width: window.innerWidth,
      };
      setViewPort(newViewport);
    }
  }

  React.useEffect(() => {
    const promise = getMapStyle('default');
    promise.then((style: any) => {
      if (style) {
        setStyle(style);
      }
    });
  }, []);

  React.useEffect(() => {
    if (locations) {
      const features = [];
      const ids = [];
      for (const i in locations) {
        if (Object.prototype.hasOwnProperty.call(locations, i)) {
          const pl = locations[i];
          const newPl = pl.geometry;
          const newFeature = {
            type: 'Feature',
            geometry: newPl,
            properties: {
              id: pl.id,
            }
          }
          features.push(newFeature);
          if (pl.type === 'multi') ids.push(`${pl.id}-layer`);
        }
      }
      setGeoJson({
        type: 'FeatureCollection',
        properties: {},
        features,
      });
      setPlIds(ids);
      zoomToLocation(locations[0].geometry);
    } else {
      setPlIds(null);
      setGeoJson(null);
    }
  }, [locations]);

  React.useEffect(() => {
    if (selectedLocation) {
      zoomToLocation(selectedLocation.geometry);
    }
  }, [geoJson, selectedLocation]);

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  const onMapClick = (e: MapEvent) => {
    setselectedLocation(null);
    if (e.features?.length !== 0) {
      if (e.features[0].layer?.source) {
        const source = e.features[0].layer.source;
        for (const key in locations) {
          if (Object.prototype.hasOwnProperty.call(locations, key)) {
            const element = locations[key];
            if (element.id === source) {
              router.replace(`/profile/treemapper/?l=${source}`);
              break;
            }
          }
        }
      }
    }
  };

  return (
    <MapGL
      {...viewport}
      mapStyle={style}
      scrollZoom={false}
      onViewportChange={_onViewportChange}
      onClick={onMapClick}
      interactiveLayerIds={plIds ? plIds : undefined}
      attributionControl={true}
      mapOptions={{ customAttribution: 'Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, Aerogrid, IGN, IGP, and the GIS User Community' }}
    >
      {satellite && plIds &&
        <SatelliteLayer beforeId={plIds[0]} />}
      {locations &&
        locations.map((pl: any) => {
          const newPl = pl.geometry;
          newPl.properties = {};
          newPl.properties.id = pl.id;
          if (pl.type === 'multi') {
            const dateDiff = getDateDiff(pl);
            return (
              <>
                <Source
                  key={`${pl.id}-source`}
                  id={pl.id}
                  type="geojson"
                  data={newPl}
                >
                  <Layer
                    key={`${pl.id}-layer`}
                    id={`${pl.id}-layer`}
                    type="fill"
                    source={pl.id}
                    paint={{
                      'fill-color': satellite ? '#ffffff' : '#007A49',
                      'fill-opacity': getPolygonColor(pl),
                    }}
                  />
                  {(selectedLocation && selectedLocation.id === pl.id) && (
                    <Layer
                      key={`${pl.id}-selected`}
                      id={`${pl.id}-selected-layer`}
                      type="line"
                      source={pl.id}
                      paint={{
                        'line-color': satellite ? '#ffffff' : '#007A49',
                        'line-width': 4,
                      }}
                    />
                  )}
                  {dateDiff && (
                    <Layer
                      key={`${pl.id}-label`}
                      id={`${pl.id}-label`}
                      type="symbol"
                      source={pl.id}
                      layout={{
                        'text-field': dateDiff,
                        'text-anchor': 'center',
                        'text-font': ['Ubuntu Regular'],
                      }}
                      paint={{
                        'text-color': satellite ? '#ffffff' : '#2f3336',
                      }}
                    />
                  )}
                </Source>
                {pl &&
                  pl.samplePlantLocations &&
                  pl.samplePlantLocations
                    .filter((item: any) => {
                      if (item.captureStatus === 'complete') {
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((spl: any) => {
                      return (
                        <Marker
                          key={`${spl.id}-sample`}
                          latitude={spl.geometry.coordinates[1]}
                          longitude={spl.geometry.coordinates[0]}
                        >
                          {viewport.zoom > 14 && (
                            <div
                              key={`${spl.id}-marker`}
                              className={`${styles.single} ${spl.id === selectedLocation?.id
                                  ? styles.singleSelected
                                  : ''
                                }`}
                              role="button"
                              tabIndex={0}
                              onClick={() => setselectedLocation(spl)}
                            // onMouseEnter={() => onHover(spl)}
                            // onMouseLeave={() => onHoverEnd(spl)}
                            />
                          )}
                        </Marker>
                      );
                    })}
              </>
            );
          } else if (pl.type === 'single') {
            return (
              <Marker
                key={`${pl.id}-single`}
                latitude={newPl.coordinates[1]}
                longitude={newPl.coordinates[0]}
              // offsetLeft={5}
              // offsetTop={-16}
              // style={{ left: '28px' }}
              >
                {viewport.zoom > 14 && (
                  <div
                    key={`${pl.id}-marker`}
                    onClick={() => setselectedLocation(pl)}
                    // onMouseEnter={() => onHover(pl)}
                    // onMouseLeave={() => onHoverEnd(pl)}
                    className={`${styles.single} ${pl.id === selectedLocation?.id ? styles.singleSelected : ''
                      }`}
                    role="button"
                    tabIndex={0}
                  />
                )}
              </Marker>
            );
          }
        })}
      <div
        onClick={() => setSatellite(!satellite)}
        className={styles.layerToggle}
      >
        {satellite ? <LayerIcon /> : <LayerDisabled />}
      </div>
      <div className={styles.mapNavigation}>
        <NavigationControl showCompass={false} />
      </div>
    </MapGL>
  );
}

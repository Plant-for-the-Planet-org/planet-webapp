import type { ReactElement } from 'react';
import type {
  PlantLocation,
  PlantLocationMulti,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import type { RequiredMapStyle } from '../../../common/types/map';
import type { ViewPort } from '../../../common/types/ProjectPropsContextInterface';
import type { MapEvent } from 'react-map-gl';

import React from 'react';
import styles from '../TreeMapper.module.scss';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import * as turf from '@turf/turf';
import MapGL, {
  FlyToInterpolator,
  Layer,
  Marker,
  NavigationControl,
  Source,
  WebMercatorViewport,
} from 'react-map-gl';
import LayerIcon from '../../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../../public/assets/images/icons/LayerDisabled';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import * as d3 from 'd3-ease';
import { useRouter } from 'next/router';
import SatelliteLayer from '../../../projects/components/maps/SatelliteLayer';
import themeProperties from '../../../../theme/themeProperties';
import getLocalizedPath from '../../../../utils/getLocalizedPath';
import { useLocale } from 'next-intl';

interface Props {
  locations: PlantLocation[] | SamplePlantLocation[] | null;
  selectedLocation: PlantLocation | SamplePlantLocation | null;
  setSelectedLocation: Function;
}

interface GeoJson {
  type: 'FeatureCollection';
  properties: {};
  features: {
    type: string;
    geometry: any;
    properties: {
      id: string;
    };
  }[];
}

export default function MyTreesMap({
  locations,
  selectedLocation,
  setSelectedLocation,
}: Props): ReactElement {
  const router = useRouter();
  const { isMobile } = useProjectProps();
  const locale = useLocale();
  const { primaryColor, white } = themeProperties.designSystem.colors;
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
  const [geoJson, setGeoJson] = React.useState<GeoJson | null>(null);
  const [plIds, setPlIds] = React.useState<string[] | null>(null);
  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });
  const getPlTreeCount = (pl: PlantLocationMulti) => {
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

  const getPlArea = (pl: PlantLocationMulti) => {
    if (pl && pl.type === 'multi-tree-registration') {
      const area = turf.area(pl.geometry);
      return area / 10000;
    } else {
      return 0;
    }
  };

  const getPolygonColor = (pl: PlantLocationMulti) => {
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

  // const getDateDiff = (pl: PlantLocation) => {
  //   const today = new Date();
  //   const plantationDate = new Date(pl.plantDate?.substr(0, 10));
  //   const differenceInTime = today.getTime() - plantationDate.getTime();
  //   const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  //   if (differenceInDays < 1) {
  //     return t('today');
  //   } else if (differenceInDays < 2) {
  //     return t('yesterday');
  //   } else if (differenceInDays < 30) {
  //     return t('daysAgo', {
  //       days: localizedAbbreviatedNumber(i18n.language, differenceInDays, 0),
  //     });
  //   } else {
  //     return null;
  //   }
  // };

  const zoomToLocation = (geometry: turf.AllGeoJSON) => {
    if (viewport.width && viewport.height && geometry) {
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
  };

  React.useEffect(() => {
    const promise = getMapStyle('default');
    promise.then((style: RequiredMapStyle) => {
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
            },
          };
          features.push(newFeature);
          if (pl.type === 'multi-tree-registration') ids.push(`${pl.id}-layer`);
        }
      }
      setGeoJson({
        type: 'FeatureCollection',
        properties: {},
        features,
      });
      setPlIds(ids);
      zoomToLocation(locations[0]?.geometry);
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

  const _onViewportChange = (view: ViewPort) => setViewPort({ ...view });

  const onMapClick = (e: MapEvent) => {
    setSelectedLocation(null);
    if (e.features !== undefined && e.features?.length !== 0) {
      if (e.features[0].layer?.source) {
        const source = e.features[0].layer.source;
        for (const key in locations) {
          if (Object.prototype.hasOwnProperty.call(locations, key)) {
            const element = locations[key];
            if (element.id === source) {
              router.replace(
                getLocalizedPath(`/profile/treemapper/?l=${source}`, locale)
              );
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
      mapOptions={{
        customAttribution:
          'Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, Aerogrid, IGN, IGP, and the GIS User Community',
      }}
    >
      {satellite && plIds && <SatelliteLayer beforeId={plIds[0]} />}
      {locations &&
        locations.map((pl: PlantLocation) => {
          const newPl = pl.geometry;
          newPl.properties = { id: '' };
          newPl.properties.id = pl.id;
          if (pl.type === 'multi-tree-registration') {
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
                      'fill-color': satellite ? `${white}` : `${primaryColor}`,
                      'fill-opacity': getPolygonColor(pl),
                    }}
                  />
                  {selectedLocation && selectedLocation?.id === pl.id && (
                    <Layer
                      key={`${pl.id}-selected`}
                      id={`${pl.id}-selected-layer`}
                      type="line"
                      source={pl.id}
                      paint={{
                        'line-color': satellite
                          ? `${white}`
                          : `${primaryColor}`,
                        'line-width': 4,
                      }}
                    />
                  )}
                </Source>
                {pl &&
                  pl.sampleInterventions &&
                  pl.sampleInterventions
                    .filter((item) => {
                      if (item.captureStatus === 'complete') {
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((spl) => {
                      return (
                        <Marker
                          key={`${spl.id}-sample`}
                          latitude={spl.geometry.coordinates[1]}
                          longitude={spl.geometry.coordinates[0]}
                        >
                          {viewport.zoom > 14 && (
                            <div
                              key={`${spl.id}-marker`}
                              className={`${styles.single} ${
                                spl.id === selectedLocation?.id
                                  ? styles.singleSelected
                                  : ''
                              }`}
                              role="button"
                              tabIndex={0}
                              onClick={() => setSelectedLocation(spl)}
                              // onMouseEnter={() => onHover(spl)}
                              // onMouseLeave={() => onHoverEnd(spl)}
                            />
                          )}
                        </Marker>
                      );
                    })}
              </>
            );
          } else if (pl.type === 'single-tree-registration') {
            return (
              <Marker
                key={`${pl.id}-single`}
                latitude={Number(newPl.coordinates[1])}
                longitude={Number(newPl.coordinates[0])}
                // offsetLeft={5}
                // offsetTop={-16}
                // style={{ left: '28px' }}
              >
                {viewport.zoom > 14 && (
                  <div
                    key={`${pl.id}-marker`}
                    onClick={() => {
                      setSelectedLocation(pl);
                    }}
                    // onMouseEnter={() => onHover(pl)}
                    // onMouseLeave={() => onHoverEnd(pl)}
                    className={`${styles.single} ${
                      pl.id === selectedLocation?.id
                        ? styles.singleSelected
                        : ''
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

import type { ReactElement } from 'react';
import type {
  Intervention,
  MultiTreeRegistration,
  SampleTreeRegistration,
} from '../../../common/types/intervention';
import type { RequiredMapStyle } from '../../../common/types/map';
import type { ViewPort } from '../../../common/types/ProjectPropsContextInterface';
import type { MapEvent } from 'react-map-gl';
import type { SetState } from '../../../common/types/common';
import type { Feature, Point, Polygon } from 'geojson';
import type { AllGeoJSON } from '@turf/turf';

import React from 'react';
import styles from '../TreeMapper.module.scss';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import area from '@turf/area';
import bbox from '@turf/bbox';
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
import { easeCubic } from 'd3-ease';
import { useRouter } from 'next/router';
import SatelliteLayer from '../../../projects/components/maps/SatelliteLayer';
import themeProperties from '../../../../theme/themeProperties';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';

interface Props {
  interventions: Intervention[] | null;
  selectedIntervention: Intervention | SampleTreeRegistration | null;
  setSelectedIntervention: SetState<
    Intervention | SampleTreeRegistration | null
  >;
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
  interventions,
  selectedIntervention,
  setSelectedIntervention,
}: Props): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { isMobile } = useProjectProps();
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
  // mt -> multi tree registration
  const getTreeCount = (mt: MultiTreeRegistration) => {
    let count = 0;
    if (mt && mt.plantedSpecies) {
      for (const key in mt.plantedSpecies) {
        if (Object.prototype.hasOwnProperty.call(mt.plantedSpecies, key)) {
          const element = mt.plantedSpecies[key];
          count += element.treeCount;
        }
      }
      return count;
    } else {
      return 0;
    }
  };

  const getPlantationArea = (mt: MultiTreeRegistration) => {
    if (mt && mt.type === 'multi-tree-registration') {
      const polygonAreaSqMeters = area(mt.geometry);
      return polygonAreaSqMeters / 10000;
    } else {
      return 0;
    }
  };

  const getPolygonColor = (mt: MultiTreeRegistration) => {
    const treeCount = getTreeCount(mt);
    const plantationArea = getPlantationArea(mt);
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

  const zoomToLocation = (geometry: AllGeoJSON) => {
    if (viewport.width && viewport.height && geometry) {
      const bounds = bbox(geometry);
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        viewport
      ).fitBounds(
        [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
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
        transitionEasing: easeCubic,
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
    if (interventions) {
      const features = [];
      const ids = [];
      for (const i in interventions) {
        if (Object.prototype.hasOwnProperty.call(interventions, i)) {
          const intervention = interventions[i];
          const newFeature = {
            type: 'Feature',
            geometry: intervention.geometry,
            properties: {
              id: intervention.id,
            },
          };
          features.push(newFeature);
          if (intervention.type === 'multi-tree-registration')
            ids.push(`${intervention.id}-layer`);
        }
      }
      setGeoJson({
        type: 'FeatureCollection',
        properties: {},
        features,
      });
      setPlIds(ids);
      zoomToLocation(interventions[0]?.geometry);
    } else {
      setPlIds(null);
      setGeoJson(null);
    }
  }, [interventions]);

  React.useEffect(() => {
    if (selectedIntervention) {
      zoomToLocation(selectedIntervention.geometry);
    }
  }, [geoJson, selectedIntervention]);

  const _onViewportChange = (view: ViewPort) => setViewPort({ ...view });

  const onMapClick = (e: MapEvent) => {
    setSelectedIntervention(null);
    if (e.features !== undefined && e.features?.length !== 0) {
      if (e.features[0].layer?.source) {
        const source = e.features[0].layer.source;
        for (const key in interventions) {
          if (Object.prototype.hasOwnProperty.call(interventions, key)) {
            const element = interventions[Number(key)];
            if (element.id === source) {
              router.replace(localizedPath(`/profile/treemapper/?l=${source}`));
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
      {interventions &&
        interventions.map((intervention: Intervention) => {
          const newPl: Feature<Point | Polygon> = {
            type: 'Feature',
            geometry: intervention.geometry,
            properties: { id: intervention.id },
          };
          if (intervention.type === 'multi-tree-registration') {
            return (
              <>
                <Source
                  key={`${intervention.id}-source`}
                  id={intervention.id}
                  type="geojson"
                  data={newPl}
                >
                  <Layer
                    key={`${intervention.id}-layer`}
                    id={`${intervention.id}-layer`}
                    type="fill"
                    source={intervention.id}
                    paint={{
                      'fill-color': satellite ? `${white}` : `${primaryColor}`,
                      'fill-opacity': getPolygonColor(intervention),
                    }}
                  />
                  {selectedIntervention?.id === intervention.id && (
                    <Layer
                      key={`${intervention.id}-selected`}
                      id={`${intervention.id}-selected-layer`}
                      type="line"
                      source={intervention.id}
                      paint={{
                        'line-color': satellite
                          ? `${white}`
                          : `${primaryColor}`,
                        'line-width': 4,
                      }}
                    />
                  )}
                </Source>
                {intervention.sampleInterventions
                  .filter((item) => {
                    if (item.captureStatus === 'complete') {
                      return true;
                    } else {
                      return false;
                    }
                  })
                  .map((str) => {
                    // str -> sample tree registration
                    return (
                      <Marker
                        key={`${str.id}-sample`}
                        latitude={str.geometry.coordinates[1]}
                        longitude={str.geometry.coordinates[0]}
                      >
                        {viewport.zoom > 14 && (
                          <div
                            key={`${str.id}-marker`}
                            className={`${styles.single} ${
                              str.id === selectedIntervention?.id
                                ? styles.singleSelected
                                : ''
                            }`}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedIntervention(str)}
                          />
                        )}
                      </Marker>
                    );
                  })}
              </>
            );
          } else if (intervention.type === 'single-tree-registration') {
            return (
              <Marker
                key={`${intervention.id}-single`}
                latitude={Number(newPl.geometry.coordinates[1])}
                longitude={Number(newPl.geometry.coordinates[0])}
              >
                {viewport.zoom > 14 && (
                  <div
                    key={`${intervention.id}-marker`}
                    onClick={() => {
                      setSelectedIntervention(intervention);
                    }}
                    className={`${styles.single} ${
                      intervention.id === selectedIntervention?.id
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

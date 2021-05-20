import React, { ReactElement } from 'react';
import styles from '../../styles/TreeMapper.module.scss';
import ReactMapboxGl, {
  GeoJSONLayer,
  Marker,
  ZoomControl,
} from 'react-mapbox-gl';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import i18next from '../../../../../../i18n';
import * as turf from '@turf/turf';
import WebMercatorViewport from '@math.gl/web-mercator';

const Map = ReactMapboxGl({
  customAttribution:
    '<a>Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS</a>',
});

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
  const { useTranslation } = i18next;
  const { i18n, t } = useTranslation('me');
  const defaultMapCenter = [-28.5, 36.96];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    height: '100%',
    width: '100%',
    center: defaultMapCenter,
    zoom: [defaultZoom],
  });
  const [viewport2, setViewPort2] = React.useState({
    height: 400,
    width: 400,
    center: defaultMapCenter,
    zoom: defaultZoom,
  });
  const [geoJson, setGeoJson] = React.useState();

  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });

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
      var object = {
        type: 'FeatureCollection',
        features: [],
      };
      if (selectedLocation !== '') {
        for (const key in locations) {
          if (Object.prototype.hasOwnProperty.call(locations, key)) {
            const location = locations[key];
            if (location.id === selectedLocation) {
              if (location.geometry.type === 'Point') {
                var feature = {
                  type: 'Feature',
                  properties: location,
                  geometry: {
                    type: 'Point',
                    coordinates: location.geometry.coordinates,
                  },
                };
                object.features.push(feature);
              }
              if (location.geometry.type === 'Polygon') {
                var feature = {
                  type: 'Feature',
                  properties: location,
                  geometry: {
                    type: 'Polygon',
                    coordinates: location.geometry.coordinates,
                  },
                };
                object.features.push(feature);
              }
            }
          }
        }
        setGeoJson(object);
      } else {
        for (const key in locations) {
          if (Object.prototype.hasOwnProperty.call(locations, key)) {
            const location = locations[key];
            if (location.geometry.type === 'Point') {
              var feature = {
                type: 'Feature',
                properties: location,
                geometry: {
                  type: 'Point',
                  coordinates: location.geometry.coordinates,
                },
              };
              object.features.push(feature);
            }
            if (location.geometry.type === 'Polygon') {
              var feature = {
                type: 'Feature',
                properties: location,
                geometry: {
                  type: 'Polygon',
                  coordinates: location.geometry.coordinates,
                },
              };
              object.features.push(feature);
            }
          }
        }
        setGeoJson(object);
      }
    }
  }, [locations, selectedLocation]);

  React.useEffect(() => {
    if (geoJson) {
      if (selectedLocation === '') {
        const bbox = turf.bbox(geoJson);
        const { longitude, latitude, zoom } = new WebMercatorViewport(
          viewport2
        ).fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          { padding: 50 }
        );
        const newViewport = {
          ...viewport,
          center: [longitude, latitude],
          zoom: [zoom],
        };
        setViewPort(newViewport);
      } else {
        for (const key in geoJson.features) {
          if (Object.prototype.hasOwnProperty.call(geoJson.features, key)) {
            const feature = geoJson.features[key];
            console.log(feature, selectedLocation);
            if (feature.properties.id === selectedLocation) {
              const bbox = turf.bbox(feature);
              const { longitude, latitude, zoom } = new WebMercatorViewport(
                viewport2
              ).fitBounds(
                [
                  [bbox[0], bbox[1]],
                  [bbox[2], bbox[3]],
                ],
                { padding: 50 }
              );
              const newViewport = {
                ...viewport,
                center: [longitude, latitude],
                zoom: [zoom],
              };
              setViewPort(newViewport);
              break;
            }
          }
        }
      }
    }
  }, [geoJson, selectedLocation]);

  return (
    <Map
      {...viewport}
      style={style}
      containerStyle={{
        height: '100%',
        width: '100%',
      }}
    >
      {geoJson &&
        geoJson.features.map((location: any, index: number) => {
          if (location.geometry.type === 'Point')
            if (location.properties.type === 'sample') {
              return (
                <Marker
                  key={index}
                  coordinates={location.geometry.coordinates}
                  anchor="bottom"
                >
                  <div key={index} className={styles.markerSample} />
                </Marker>
              );
            } else {
              return (
                <Marker
                  key={index}
                  coordinates={location.geometry.coordinates}
                  anchor="bottom"
                >
                  <div key={index} className={styles.marker} />
                </Marker>
              );
            }
        })}
      {geoJson ? (
        <GeoJSONLayer
          data={geoJson}
          fillPaint={{
            'fill-color': '#68B030',
            'fill-opacity': 0.2,
          }}
          linePaint={{
            'line-color': '#FF6200',
            'line-width': 2,
          }}
        />
      ) : null}
      <ZoomControl position="bottom-right" />
    </Map>
  );
}

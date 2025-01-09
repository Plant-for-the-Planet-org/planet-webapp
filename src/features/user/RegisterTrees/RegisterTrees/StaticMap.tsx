import type { ReactElement } from 'react';

import React from 'react';
import * as turf from '@turf/turf';
import ReactMapboxGl, { GeoJSONLayer, Marker } from 'react-mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import WebMercatorViewport from '@math.gl/web-mercator';
import styles from '../RegisterModal.module.scss';
import getMapStyle from '../../../../utils/maps/getMapStyle';

const Map = ReactMapboxGl({
  interactive: false,
  customAttribution:
    '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>',
  accessToken: '',
});

interface Props {
  geoJson: any;
}

export default function StaticMap({ geoJson }: Props): ReactElement {
  const defaultMapCenter: [number, number] = [-28.5, 36.96];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    height: '100%',
    width: '100%',
    center: defaultMapCenter,
    zoom: [defaultZoom],
  });
  const viewport2 = {
    height: 200,
    width: 350,
    center: defaultMapCenter,
    zoom: defaultZoom,
  };
  const [isPoint, setIsPoint] = React.useState(false);
  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });

  React.useEffect(() => {
    const promise = getMapStyle('openStreetMap');
    promise.then((style) => {
      if (style) {
        setStyle(style);
      }
    });
  }, []);

  React.useEffect(() => {
    if (geoJson) {
      if (geoJson.type === 'Point') {
        setIsPoint(true);
      } else {
        setIsPoint(false);
      }
    }
  }, [geoJson]);

  React.useEffect(() => {
    if (isPoint) {
      setViewPort({
        ...viewport,
        center: geoJson.coordinates,
        zoom: [5],
      });
    } else {
      if (geoJson) {
        const bbox = turf.bbox(geoJson);
        const { longitude, latitude, zoom } = new WebMercatorViewport(
          viewport2
        ).fitBounds([
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ]);
        const newViewport = {
          ...viewport,
          center: [longitude, latitude] as [number, number],
          zoom: [zoom - 0.5] as [number],
        };
        setViewPort(newViewport);
      }
    }
  }, [isPoint]);
  return (
    <Map
      {...viewport}
      zoom={[viewport.zoom[0]]}
      style={style}
      containerStyle={{
        height: '100%',
        width: '100%',
      }}
    >
      {isPoint ? (
        <Marker coordinates={geoJson.coordinates} anchor="bottom">
          <div className={styles.marker} />
        </Marker>
      ) : geoJson ? (
        <GeoJSONLayer
          data={geoJson}
          fillPaint={{
            'fill-color': '#fff',
            'fill-opacity': 0.2,
          }}
          linePaint={{
            'line-color': '#68B030',
            'line-width': 2,
          }}
        />
      ) : (
        <></>
      )}
    </Map>
  );
}

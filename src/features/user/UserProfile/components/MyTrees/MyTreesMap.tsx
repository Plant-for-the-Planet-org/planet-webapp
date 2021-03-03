import React, { ReactElement } from 'react';
import styles from '../../styles/MyTrees.module.scss';
import ReactMapboxGl, { GeoJSONLayer, Marker } from 'react-mapbox-gl';
import getMapStyle from '../../../../../utils/maps/getMapStyle';

const Map = ReactMapboxGl({
  customAttribution:
    '<a>Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS</a>',
});

interface Props {
  contributions: any;
}

export default function MyTreesMap({ contributions }: Props): ReactElement {
  const defaultMapCenter = [-28.5, 36.96];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    height: '100%',
    width: '100%',
    center: defaultMapCenter,
    zoom: [defaultZoom],
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
    if (
      contributions &&
      Array.isArray(contributions) &&
      contributions.length !== 0
    ) {
      setGeoJson({
        type: 'FeatureCollection',
        features: contributions,
      });
    }
  }, [contributions]);
  return (
    <div className={styles.mapContainer}>
      <Map
        {...viewport}
        style={style}
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
      >
        {contributions &&
        Array.isArray(contributions) &&
        contributions.length !== 0
          ? contributions
              .filter((feature: any) => {
                return feature.geometry?.type === 'Point';
              })
              .map((point: any) => {
                return (
                  <Marker
                    coordinates={point.geometry.coordinates}
                    anchor="bottom"
                  >
                    <div
                      style={
                        point.properties.type === 'registration'
                          ? { background: '#3D67B1' }
                          : {}
                      }
                      className={styles.marker}
                    />
                  </Marker>
                );
              })
          : null}
        {geoJson ? (
          <GeoJSONLayer
            data={geoJson}
            fillPaint={{
              'fill-color': '#fff',
              'fill-opacity': 0.2,
            }}
            linePaint={{
              'line-color': '#3D67B1',
              'line-width': 2,
            }}
          />
        ) : null}
      </Map>
    </div>
  );
}

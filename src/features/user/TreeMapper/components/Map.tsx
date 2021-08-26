import React, { ReactElement } from 'react';
import styles from '../TreeMapper.module.scss';
import ReactMapboxGl, {
  GeoJSONLayer,
  Marker,
  Popup,
  ZoomControl,
} from 'react-mapbox-gl';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import i18next from '../../../../../i18n';
import * as turf from '@turf/turf';
import WebMercatorViewport from '@math.gl/web-mercator';
import getImageUrl from '../../../../utils/getImageURL';

const Map = ReactMapboxGl({
  customAttribution:
    '<a>Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS</a>',
    scrollZoom:false
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
  const [imagePopup, setImagePopup] = React.useState(null);
  let timer: NodeJS.Timeout;

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

  // React.useEffect(() => {
  //   if (typeof window !== 'undefined')
  //     window.addEventListener('scroll', () => fixedMap(), false);

  //   function fixedMap() {
  //     if (document.getElementById('pp-mapbox'))
  //       if (
  //         document.body.scrollTop > 200 ||
  //         document.documentElement.scrollTop > 200
  //       ) {
  //         document.getElementById('pp-mapbox').style.position = 'fixed';
  //         document.getElementById('pp-mapbox').style.marginTop = '-200px';
  //       } else {
  //         document.getElementById('pp-mapbox').style.position = 'absolute';
  //         document.getElementById('pp-mapbox').style.marginTop = '0px';
  //       }
  //   }
  // }, []);

  React.useEffect(() => {
    if (locations) {
      const object = {
        type: 'FeatureCollection',
        features: [],
      };
      if (selectedLocation !== '') {
        for (const key in locations) {
          if (Object.prototype.hasOwnProperty.call(locations, key)) {
            const location = locations[key];
            if (location.id === selectedLocation) {
              if (location.geometry.type === 'Point') {
                const feature = {
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
                const feature = {
                  type: 'Feature',
                  properties: location,
                  geometry: {
                    type: 'Polygon',
                    coordinates: location.geometry.coordinates,
                  },
                };
                object.features.push(feature);
              }
              if (location.type === 'multi') {
                for (const key in location.sampleTrees) {
                  if (
                    Object.prototype.hasOwnProperty.call(
                      location.sampleTrees,
                      key
                    )
                  ) {
                    const loc = location.sampleTrees[key];
                    const feature = {
                      type: 'Feature',
                      properties: loc,
                      geometry: {
                        type: 'Point',
                        coordinates: loc.geometry.coordinates,
                      },
                    };
                    object.features.push(feature);
                  }
                }
              }
              if (location.type === 'sample') {
                for (const key in locations) {
                  if (Object.prototype.hasOwnProperty.call(locations, key)) {
                    const loc = locations[key];
                    if (loc.id === location.parent) {
                      const feature = {
                        type: 'Feature',
                        properties: loc,
                        geometry: {
                          type: 'Polygon',
                          coordinates: loc.geometry.coordinates,
                        },
                      };
                      object.features.push(feature);
                    }
                  }
                }
              }
            }
          }
        }
        setGeoJson(object);
      } else {
        for (const key in locations) {
          if (Object.prototype.hasOwnProperty.call(locations, key)) {
            const location = locations[key];
            if (location.type !== 'sample') {
              if (location.geometry.type === 'Point') {
                const feature = {
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
                const feature = {
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
                  <div
                    key={index}
                    className={styles.markerSample}
                    onMouseOver={() => {
                      console.log(location);
                      timer = setTimeout(() => {
                        const image = getImageUrl(
                          'coordinate',
                          'large',
                          location.properties.coordinates[0].image
                        );
                        setImagePopup({
                          coordinates: location.geometry.coordinates,
                          image: image,
                        });
                      }, 300);
                    }}
                    onMouseLeave={() => {
                      clearTimeout(timer);
                    }}
                    onFocus={() => {}}
                  />
                </Marker>
              );
            } else {
              return (
                <Marker
                  key={index}
                  coordinates={location.geometry.coordinates}
                  anchor="bottom"
                >
                  <div
                    key={index}
                    className={styles.marker}
                    role="button"
                    tabIndex={0}
                    onMouseOver={() => {
                      console.log(location);
                      timer = setTimeout(() => {
                        const image = getImageUrl(
                          'coordinate',
                          'large',
                          location.properties.coordinates[0].image
                        );
                        setImagePopup({
                          coordinates: location.geometry.coordinates,
                          image: image,
                        });
                      }, 300);
                    }}
                    onMouseLeave={() => {
                      clearTimeout(timer);
                    }}
                    onFocus={() => {}}
                  />
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
      {/* {imagePopup && (
        <Popup
          className={styles.popupContainer}
          coordinates={imagePopup.coordinates}
          anchor={'bottom'}
        >
          <div className={styles.imagePopup}>
            <img src={imagePopup.image} />
          </div>
        </Popup>
      )} */}
      <ZoomControl position="bottom-right" />
    </Map>
  );
}

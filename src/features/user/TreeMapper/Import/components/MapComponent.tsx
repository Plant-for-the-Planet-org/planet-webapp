import React, { ReactElement } from 'react';
import * as turf from '@turf/turf';
import ReactMapboxGl, { ZoomControl, GeoJSONLayer } from 'react-mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import WebMercatorViewport from '@math.gl/web-mercator';
import getMapStyle from '../../../../../utils/maps/getMapStyle';

interface Props {
  geoJson: any;
  setGeoJson: Function;
  setActiveMethod: Function;
}

const Map = ReactMapboxGl({ maxZoom: 15 });

export default function MapComponent({
  geoJson,
  setGeoJson,
}: Props): ReactElement {
  const defaultMapCenter = [0, 0];
  const defaultZoom = 1.4;

  const [viewport, setViewPort] = React.useState({
    height: '100%',
    width: '100%',
    center: defaultMapCenter,
    zoom: [defaultZoom],
  });
  const [viewport2, setViewPort2] = React.useState({
    height: 1000,
    width: 500,
    center: defaultMapCenter,
    zoom: defaultZoom,
  });
  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });
  // const [satellite, setSatellite] = React.useState(false);

  // const RASTER_SOURCE_OPTIONS = {
  //   type: 'raster',
  //   tiles: [
  //     'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  //   ],
  //   tileSize: 128,
  // };

  React.useEffect(() => {
    const promise = getMapStyle('openStreetMap');
    promise.then((style: any) => {
      if (style) {
        setStyle(style);
      }
    });
  }, []);

  React.useEffect(() => {
    if (geoJson) {
      const geo = turf.featureCollection([
        { type: 'Feature', geometry: geoJson, properties: {} },
      ]);
      const bbox = turf.bbox(geo);
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        viewport2
      ).fitBounds([
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ]);
      const newViewport = {
        ...viewport,
        center: [longitude, latitude],
        zoom: [zoom],
      };
      // setTimeout(() => {
      //   if (drawControlRef.current) {
      //     try {
      //       drawControlRef.current.draw.add(geo);
      //     } catch (e) {
      //       // setGeoJsonError(true);
      //       // setGeoJson(null);
      //       console.log('We only support feature collection for now', e);
      //     }
      //   }
      // }, 1000);
      setViewPort(newViewport);
    } else {
      setViewPort({
        ...viewport,
        center: defaultMapCenter,
        zoom: [defaultZoom],
      });
    }
  }, [geoJson]);

  return (
    <>
      <Map
        {...viewport}
        style={style} // eslint-disable-line
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        // onClick={() => setActiveMethod('draw')}
      >
        {/* {satellite && (
          <>
            <Source
              id="satellite_source"
              tileJsonSource={RASTER_SOURCE_OPTIONS}
            />
            <Layer
              type="raster"
              id="satellite_layer"
              sourceId="satellite_source"
            />
          </>
        )} */}
        {/* <DrawControl
          ref={drawControlRef}
          onDrawCreate={onDrawCreate}
          onDrawUpdate={onDrawUpdate}
          controls={{
            point: false,
            line_string: false,
            polygon: geoJson ? false : true,
            trash: true,
            combine_features: false,
            uncombine_features: false,
          }}
          position="top-right"
        /> */}
        {/* <div className={styles.layerSwitcher}>
          <div
            onClick={() => setSatellite(false)}
            className={`${styles.layerOption} ${
              satellite ? '' : styles.active
            }`}
          >
            Map
          </div>
          <div
            onClick={() => setSatellite(true)}
            className={`${styles.layerOption} ${
              satellite ? styles.active : ''
            }`}
          >
            Satellite
          </div>
        </div> */}
        {geoJson ? (
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
        ) : null}
        <ZoomControl position="bottom-right" />
      </Map>
    </>
  );
}

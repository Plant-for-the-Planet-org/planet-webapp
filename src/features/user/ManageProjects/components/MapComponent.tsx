import type { ReactElement } from 'react';

import React from 'react';
import * as turf from '@turf/turf';
import ReactMapboxGl, { ZoomControl, Source, Layer } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import styles from './../StepForm.module.scss';
import Dropzone from 'react-dropzone';
import tj from '@mapbox/togeojson';
import { useTranslations } from 'next-intl';
import WebMercatorViewport from '@math.gl/web-mercator';
import gjv from 'geojson-validation';
import getMapStyle from '../../../../utils/maps/getMapStyle';

interface Props {
  geoJson: any;
  setGeoJson: Function;
  geoJsonError: any;
  setGeoJsonError: Function;
  geoLocation: any;
}

const Map = ReactMapboxGl({ maxZoom: 15 });

export default function MapComponent({
  geoJson,
  setGeoJson,
  geoJsonError,
  setGeoJsonError,
  geoLocation,
}: Props): ReactElement {
  const defaultMapCenter = [geoLocation.geoLongitude, geoLocation.geoLatitude];
  const defaultZoom = 1.4;
  const t = useTranslations('ManageProjects');
  const [viewport, setViewPort] = React.useState({
    height: '400px',
    width: '100%',
    center: defaultMapCenter,
    zoom: [defaultZoom],
  });
  const viewport2 = {
    height: 400,
    width: 500,
    center: defaultMapCenter,
    zoom: defaultZoom,
  };
  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });
  const [satellite, setSatellite] = React.useState(false);

  const RASTER_SOURCE_OPTIONS = {
    type: 'raster',
    tiles: [
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    tileSize: 128,
  };

  React.useEffect(() => {
    const promise = getMapStyle('openStreetMap');
    promise.then((style: any) => {
      if (style) {
        setStyle(style);
      }
    });
  }, []);

  const reader = new FileReader();
  const mapParentRef = React.useRef(null);
  const drawControlRef = React.useRef(null);

  const onDrawCreate = () => {
    if (drawControlRef.current) {
      setGeoJson(drawControlRef.current.draw.getAll());
    }
  };

  const onDrawUpdate = () => {
    if (drawControlRef.current) {
      setGeoJson(drawControlRef.current.draw.getAll());
    }
  };

  React.useEffect(() => {
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
        center: [longitude, latitude],
        zoom: [zoom],
      };
      setTimeout(() => {
        if (drawControlRef.current) {
          try {
            drawControlRef.current.draw.add(geoJson);
          } catch (e) {
            setGeoJsonError(true);
            setGeoJson(null);
            console.log('We only support feature collection for now', e);
          }
        }
      }, 1000);
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
    <div
      ref={mapParentRef}
      className={`${styles.formFieldLarge} ${styles.mapboxContainer2}`}
    >
      <Map
        {...viewport}
        style={style} // eslint-disable-line
        containerStyle={{
          height: '400px',
          width: '100%',
        }}
      >
        {satellite && (
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
        )}
        <DrawControl
          ref={drawControlRef}
          onDrawCreate={onDrawCreate}
          onDrawUpdate={onDrawUpdate}
          controls={{
            point: false,
            line_string: false,
            polygon: true,
            trash: true,
            combine_features: false,
            uncombine_features: false,
          }}
        />
        <div className={styles.layerSwitcher}>
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
        </div>
        <ZoomControl position="bottom-right" />
      </Map>
      <Dropzone
        accept={['.geojson', '.kml']}
        multiple={false}
        onDrop={(acceptedFiles) => {
          if (drawControlRef.current) {
            drawControlRef.current.draw.deleteAll();
          }
          acceptedFiles.forEach((file: any) => {
            const fileType =
              file.name.substring(
                file.name.lastIndexOf('.') + 1,
                file.name.length
              ) || file.name;
            if (fileType === 'kml') {
              reader.readAsText(file);
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');
              reader.onload = (event) => {
                const dom = new DOMParser().parseFromString(
                  event.target.result,
                  'text/xml'
                );
                const geo = tj.kml(dom);
                if (gjv.isGeoJSONObject(geo) && geo.features.length !== 0) {
                  setGeoJsonError(false);
                  setGeoJson(geo);
                } else {
                  setGeoJsonError(true);
                }
              };
            } else if (fileType === 'geojson') {
              reader.readAsText(file);
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');
              reader.onload = (event) => {
                const geo = JSON.parse(event.target.result);
                if (gjv.isGeoJSONObject(geo) && geo.features.length !== 0) {
                  setGeoJsonError(false);
                  setGeoJson(geo);
                } else {
                  setGeoJsonError(true);
                  console.log('invalid geojson');
                }
              };

              // Upload the base 64 to API and use the response to show preview to the user
            }
          });
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className={styles.dropZone}>
            <input {...getInputProps()} />
            {t('dropGeoJson')}
          </div>
        )}
      </Dropzone>
      {geoJsonError ? (
        <div className={styles.geoJsonError}>Invalid geojson/kml</div>
      ) : null}
    </div>
  );
}

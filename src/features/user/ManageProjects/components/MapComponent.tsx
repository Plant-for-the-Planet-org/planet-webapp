import React, { ReactElement } from 'react';
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import ReactMapboxGl from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import styles from './../styles/StepForm.module.scss';
import Dropzone from 'react-dropzone';
import tj from '@mapbox/togeojson';
import i18next from './../../../../../i18n';
import WebMercatorViewport from '@math.gl/web-mercator';
import gjv from "geojson-validation";

const { useTranslation } = i18next;
interface Props {
  geoJson: any;
  setGeoJson: Function;
  drawControlRef: any;
}

const MAPBOX_TOKEN = process.env.MAPBOXGL_ACCESS_TOKEN;

const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN,
});

export default function MapComponent({
  geoJson,
  setGeoJson,
  drawControlRef,
}: Props): ReactElement {
  const defaultMapCenter = [-28.5, 36.96];
  const defaultZoom = 1.4;
  const { t, i18n } = useTranslation(['manageProjects']);
  const [viewport, setViewPort] = React.useState({
    height: '400px',
    width: '100%',
    center: defaultMapCenter,
    zoom: [defaultZoom],
  });
  const [viewport2, setViewPort2] = React.useState({
    height: 400,
    width: 500,
    center: defaultMapCenter,
    zoom: defaultZoom,
  });
  const reader = new FileReader();
  const mapParentRef = React.useRef(null);
  const [geoJsonError, setGeoJsonError] = React.useState(false);

  const onDrawCreate = ({ features }: any) => {
    if (drawControlRef.current) {
      setGeoJson(drawControlRef.current.draw.getAll());
    }
  };

  const onDrawUpdate = ({ features }: any) => {
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
      if (drawControlRef.current) {
        try {
          drawControlRef.current.draw.add(geoJson);
        }
        catch (e) {
          setGeoJsonError(true);
          console.log('We only support feature collection for now', e);
        }
      }
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
        style="mapbox://styles/mapbox/streets-v11?optimize=true" // eslint-disable-line
        containerStyle={{
          height: '400px',
          width: '100%',
        }}
      >
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
      </Map>
      <Dropzone
        accept={['.geojson', '.kml']}
        multiple={false}
        onDrop={(acceptedFiles) => {
          if (drawControlRef.current) {
            drawControlRef.current.draw.deleteAll();
          }
          acceptedFiles.forEach((file: any) => {
            var fileType =
              file.name.substring(
                file.name.lastIndexOf('.') + 1,
                file.name.length
              ) || file.name;
            if (fileType === 'kml') {
              reader.readAsText(file);
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');
              reader.onload = (event) => {
                var dom = new DOMParser().parseFromString(
                  event.target.result,
                  'text/xml'
                );
                var geo = tj.kml(dom);
                if (gjv.isGeoJSONObject(geo)) {
                  setGeoJsonError(false);
                  setGeoJson(geo);
                } else {
                  setGeoJsonError(true);
                  console.log('invalid kml');
                }
              };
            } else if (fileType === 'geojson') {
              reader.readAsText(file);
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');
              reader.onload = (event) => {
                var geo = JSON.parse(event.target.result);
                if (gjv.isGeoJSONObject(geo)) {
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
            {t('manageProjects:dropGeoJson')}
          </div>
        )}
      </Dropzone>
      {geoJsonError ?
        <div className={styles.geoJsonError}>Invalid geojson/kml</div> : null}
    </div>
  );
}

import React, { ReactElement } from 'react';
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import MapGL, {
  FlyToInterpolator,
  NavigationControl,
  WebMercatorViewport,
} from 'react-map-gl';
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw';
import styles from './../styles/StepForm.module.scss';
import PolygonIcon from '../../../../../public/assets/images/icons/manageProjects/Polygon';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import PencilIcon from '../../../../../public/assets/images/icons/manageProjects/Pencil';
import Dropzone from 'react-dropzone';
import tj from '@mapbox/togeojson';
import Expand from '../../../../../public/assets/images/icons/manageProjects/Expand';
import i18next from './../../../../../i18n'

const { useTranslation } = i18next;
interface Props {
  geoJson: any;
  setGeoJson: Function;
  features: any;
  setFeatures: Function;
}

const MAPBOX_TOKEN = process.env.MAPBOXGL_ACCESS_TOKEN;

export default function MapComponent({
  geoJson,
  setGeoJson,
  features,
  setFeatures,
}: Props): ReactElement {
  const drawMode = new DrawPolygonMode();
  const editMode = new EditingMode();
  const [modeHandler, setModeHandler] = React.useState(drawMode);
  const defaultMapCenter = [36.96, -28.5];
  const defaultZoom = 1.4;
  const { t, i18n } = useTranslation(['manageProjects']);
  const [viewport, setViewPort] = React.useState({
    width: 700,
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const reader = new FileReader();
  // const [expanded, setExpanded] = React.useState(false);
  const mapParentRef = React.useRef(null);
  const [selectedFeature, setSelectedFeature] = React.useState();

  const _onViewportChange = (view: any) => setViewPort({ ...view });
  
  const _renderToolbar = () => {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          maxWidth: '320px',
          borderRadius: '10px',
        }}
      >
        {/* <div
          onClick={() => {
            expanded ? setExpanded(false) : setExpanded(true);
          }}
          className={styles.mapTool}
        >
          <Expand color={'#000'} />
        </div> */}
       
        <div
          onClick={() => {
            setModeHandler(drawMode);
          }}
          className={styles.mapTool}
        >
          <PolygonIcon color={modeHandler._clickSequence ? '#68B030' :  '#000'} />
        </div>
        <div
          onClick={() => {
            setModeHandler(editMode);
          }}
          className={styles.mapTool}
        >
          <PencilIcon color={modeHandler.getEditHandles ? '#68B030' :'#000'} />
        </div>
        {/* <div
          onClick={() => {
            var temp = features;
            delete features[selectedFeature.selectedFeatureIndex];
            setFeatures(temp);
          }}
          className={styles.mapTool}
        >
          Delete Selected
        </div> */}
        <div
          onClick={() => {
            setFeatures([]);
          }}
          className={styles.mapTool}
        >
          <TrashIcon color={'#000'} />
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    if (mapParentRef.current !== null) {
      setViewPort({
        ...viewport,
        height: mapParentRef.current.clientHeight,
        width: mapParentRef.current.clientWidth,
      });
    }
  }, [mapParentRef]);

  React.useEffect(() => {
    if (geoJson) {
      const bbox = turf.bbox(geoJson);
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        viewport
      ).fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        {
          padding: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
          },
        }
      );
      const newViewport = {
        ...viewport,
        longitude,
        latitude,
        zoom,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setViewPort(newViewport);
      setFeatures(geoJson);
    } else {
      setViewPort({
        ...viewport,
        latitude: defaultMapCenter[0],
        longitude: defaultMapCenter[1],
        zoom: defaultZoom,
      });
    }
  }, [geoJson]);

  return (
    <div
      // style={
      //   expanded ? { position: 'fixed', height: '100vh', width: '100vw' } : {}
      // }
      ref={mapParentRef}
      className={`${styles.formFieldLarge} ${styles.mapboxContainer2}`}
    >
      <MapGL
        {...viewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={'mapbox://styles/mapbox/satellite-v9'}
        onViewportChange={_onViewportChange}
      >
        <Editor
          // to make the lines/vertices easier to interact with
          clickRadius={12}
          mode={modeHandler}
          features={features}
          onSelect={(selected: any) => {
            setSelectedFeature(selected);
          }}
          onUpdate={(data: any) => {
            setFeatures(data.data);
            // setGeoJson({
            //   type: 'FeatureCollection',
            //   features: features,
            // });
            // console.log(geoJson);
          }}
        />
        {_renderToolbar()}
        <div className={styles.mapNavigation}>
          <NavigationControl showCompass={false} />
        </div>
      </MapGL>
      <Dropzone
        accept={['.geojson', '.kml']}
        multiple={false}
        onDrop={(acceptedFiles) => {
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
                setGeoJson(geo);
              };
            } else if (fileType === 'geojson') {
              reader.readAsText(file);
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');
              reader.onload = (event) => {
                var geo = JSON.parse(event.target.result);
                setGeoJson(geo);
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
    </div>
  );
}

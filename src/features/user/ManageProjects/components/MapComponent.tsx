import React, { ReactElement } from 'react';
import MapGL from 'react-map-gl';
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw';
import styles from './../styles/StepForm.module.scss';
import PolygonIcon from '../../../../../public/assets/images/icons/manageProjects/Polygon';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import PencilIcon from '../../../../../public/assets/images/icons/manageProjects/Pencil';

interface Props {}

const MAPBOX_TOKEN = process.env.MAPBOXGL_ACCESS_TOKEN;

export default function MapComponent({}: Props): ReactElement {
  const [modeId, setModeId] = React.useState(null);
  const [modeHandler, setModeHandler] = React.useState(null);
  const defaultMapCenter = [36.96, -28.5];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    width: 700,
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const [features, setFeatures] = React.useState([]);
  const [selectedFeature, setSelectedFeature] = React.useState();

  const drawMode = new DrawPolygonMode();
  const editMode = new EditingMode();

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  const _renderToolbar = () => {
    return (
      <div
        style={{ position: 'absolute', top: 0, right: 0, maxWidth: '320px' }}
      >
        <div
          onClick={() => {
            setModeHandler(drawMode);
          }}
          className={styles.mapTool}
        >
          <PolygonIcon />
        </div>
        <div
          onClick={() => {
            setModeHandler(editMode);
          }}
          className={styles.mapTool}
        >
          <PencilIcon />
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
          <TrashIcon />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.formFieldLarge}>
      <MapGL
        {...viewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7'}
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
          onUpdate={(data: any) => setFeatures(data.data)}
        />
        {_renderToolbar()}
      </MapGL>
    </div>
  );
}

import React, { ReactElement } from 'react';
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import WebMercatorViewport from '@math.gl/web-mercator';
import styles from '../../styles/RegisterModal.module.scss';
import i18next from '../../../../../../i18n';

const MAPBOX_TOKEN = process.env.MAPBOXGL_ACCESS_TOKEN;

interface Props {
  setGeometry: Function;
  countryBbox: any;
}

const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN,
});

const { useTranslation } = i18next;
export default function MapComponent({
  setGeometry,
  countryBbox,
}: Props): ReactElement {
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
    width: 700,
    center: defaultMapCenter,
    zoom: [defaultZoom],
  });
  const { t, ready } = useTranslation(['me', 'common']);
  const [drawing, setDrawing] = React.useState(false);
  const drawControlRef = React.useRef();
  const onDrawCreate = ({ features }: any) => {
    console.log(features);
    if (drawControlRef.current) {
      setGeometry(drawControlRef.current.draw.getAll());
    }
  };
  const onDrawUpdate = ({ features }: any) => {
    console.log(features);
    if (drawControlRef.current) {
      setGeometry(drawControlRef.current.draw.getAll());
    }
  };
  const onDrawDelete = ({ features }: any) => {
    console.log(features);
    if (drawControlRef.current) {
      setGeometry(drawControlRef.current.draw.getAll());
    }
  };

  React.useEffect(() => {
    if (countryBbox) {
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        viewport2
      ).fitBounds([
        [countryBbox[0], countryBbox[1]],
        [countryBbox[2], countryBbox[3]],
      ]);
      const newViewport = {
        ...viewport,
        center: [longitude, latitude],
        zoom: [zoom],
      };
      setViewPort(newViewport);
    }
  }, [countryBbox]);

  return ready ? (
    <div className={styles.mapContainer}>
      {!drawing ? (
        <div className={styles.overlayButton}>
          <div
            onClick={() => {
              setDrawing(true);
              drawControlRef.current?.draw.changeMode('draw_polygon');
            }}
            className={styles.continueButton}
          >
            {t('me:startDrawing')}
          </div>
        </div>
      ) : null}
      <Map
        {...viewport}
        style="mapbox://styles/mapbox/streets-v11?optimize=true" // eslint-disable-line
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
      >
        <DrawControl
          ref={drawControlRef}
          onDrawCreate={onDrawCreate}
          onDrawUpdate={onDrawUpdate}
          onDrawDelete={onDrawDelete}
          on
          controls={{
            point: false,
            line_string: false,
            polygon: true,
            trash: true,
            combine_features: false,
            uncombine_features: false,
          }}
        />
        <ZoomControl position="bottom-right" />
      </Map>
    </div>
  ) : null;
}

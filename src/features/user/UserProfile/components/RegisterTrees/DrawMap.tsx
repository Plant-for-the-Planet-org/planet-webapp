import React, { ReactElement } from 'react';
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import WebMercatorViewport from '@math.gl/web-mercator';
import styles from '../../styles/RegisterModal.module.scss';
import i18next from '../../../../../../i18n';
import getMapStyle from '../../../../../utils/maps/getMapStyle';

interface Props {
  setGeometry: Function;
  userLocation: Array<number>;
}

const Map = ReactMapboxGl({
  customAttribution:
    '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>',
});

const { useTranslation } = i18next;
export default function MapComponent({
  setGeometry,
  userLocation,
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
  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });

  React.useEffect(() => {
    const promise = getMapStyle('openStreetMap');
    promise.then((style: any) => {
      if (style) {
        setStyle(style);
      }
    });
  }, []);
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
    if (userLocation) {
      const newViewport = {
        ...viewport,
        longitude: userLocation[0],
        latitude: userLocation[1],
        zoom: [10],
      };
      setViewPort(newViewport);
    }
  }, [userLocation]);

  return (
    <>
      {' '}
      {ready ? (
        <div className={styles.mapContainer}>
          {!drawing ? (
            <div className={styles.overlayButton}>
              <div
                onClick={() => {
                  setDrawing(true);
                  drawControlRef.current?.draw.changeMode('draw_polygon');
                }}
                className="primaryButton"
                style={{maxWidth: "150px"}}
              >
                {t('me:startDrawing')}
              </div>
            </div>
          ) : null}
          <Map
            {...viewport}
            style={style}
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
      ) : null}
    </>
  );
}

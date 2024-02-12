import React, { ReactElement } from 'react';
import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import styles from '../RegisterModal.module.scss';
import { useTranslation } from 'next-i18next';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import { ViewportProps } from '../../../common/types/map';

interface Props {
  setGeometry: Function;
  userLocation: [number, number] | null;
}

const Map = ReactMapboxGl({
  customAttribution:
    '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>',
  accessToken: '',
});

export default function MapComponent({
  setGeometry,
  userLocation,
}: Props): ReactElement {
  const defaultMapCenter: [number, number] = [-28.5, 36.96];
  const defaultZoom: [number] = [1.4];
  const [viewport, setViewPort] = React.useState<ViewportProps>({
    height: '100%',
    width: '100%',
    center: defaultMapCenter,
    zoom: defaultZoom,
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
  const drawControlRef = React.useRef<DrawControl | null>(null);

  const onDrawCreate = () => {
    if (drawControlRef.current?.draw) {
      const drawControl = drawControlRef.current as any;
      setGeometry(drawControl.draw.getAll());
    }
  };
  const onDrawUpdate = () => {
    if (drawControlRef.current) {
      const drawControl = drawControlRef.current as any;
      setGeometry(drawControl.draw.getAll());
    }
  };
  const onDrawDelete = () => {
    if (drawControlRef.current) {
      const drawControl = drawControlRef.current as any;
      setGeometry(drawControl.draw.getAll());
    }
  };
  React.useEffect(() => {
    if (
      userLocation &&
      userLocation.length === 2 &&
      !(userLocation[0] === 0 && userLocation[1] === 0)
    ) {
      const newViewport = {
        ...viewport,
        center: userLocation,
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
                  if (drawControlRef.current?.draw)
                    drawControlRef.current?.draw.changeMode('draw_polygon');
                }}
                className="primaryButton"
                style={{ maxWidth: '150px' }}
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
            {/* NOTE: this functionality does not seem to work locally using React 18. 
						To test, a temporary fix is to set `reactStrictMode=false` in next.config.js */}
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

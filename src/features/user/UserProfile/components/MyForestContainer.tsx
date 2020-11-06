import React, { useState } from 'react';
import styles from '../styles/MyForestContainer.module.scss';
import MyForestItem from '../components/MyForestItem';
import LazyLoad from 'react-lazyload';
import MapGL, { Marker, NavigationControl, Popup } from 'react-map-gl';
import i18next from '../../../../../i18n';

const {useTranslation} = i18next;
export default function MyForestContainer({ userprofile }: any) {
  const [viewport, setViewPort] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 36.96,
    longitude: -28.5,
    zoom: 1.4,
  });
  const _onViewportChange = (view: any) => setViewPort({ ...view });
  const {t} = useTranslation(['forest']);

  const userForests = userprofile.projects.map((forest: any) => {
    return <MyForestItem key={forest.id} forest={forest.name} />;
  });
  return (
    // the text and two boxes
    <div className={styles.outerMyForestContainer}>
      <h6 className={styles.myForestTitleText}> {t('forest:myForest')} </h6>

      {/* the two boxes */}
      <div className={styles.innerMyForestContainer}>
        {/* map */}
        <div className={styles.mapSection}>
          <MapGL
            {...viewport}
            mapboxApiAccessToken={process.env.MAPBOXGL_ACCESS_TOKEN}
            mapStyle="mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7"
            onViewportChange={_onViewportChange}
            scrollZoom={false}
          ></MapGL>
        </div>

        {/* the list of forests */}
        <div className={styles.forestListSection}>
          <LazyLoad>{userForests}</LazyLoad>
        </div>
      </div>
    </div>
  );
}

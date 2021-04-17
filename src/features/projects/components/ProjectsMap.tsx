import React, { ReactElement, useEffect, useRef, useState } from 'react';
import MapGL, { NavigationControl } from 'react-map-gl';
import getMapStyle from '../../../utils/maps/getMapStyle';
import styles from '../styles/ProjectsMap.module.scss';
import Project from '../components/maps/Project';
import Explore from './maps/Explore';
import Home from './maps/Home';
import { ProjectPropsContext } from '../../common/Layout/ProjectPropsContext';

interface Props {
  setCurrencyCode: Function;
}

export default function ProjectsMap({ setCurrencyCode }: Props): ReactElement {
  const {
    project,
    showSingleProject,
    showProjects,
    setShowProjects,
    searchedProject,
  } = React.useContext(ProjectPropsContext);
  //Map
  const mapRef = useRef(null);
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 767;
  const [mapState, setMapState] = useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 15,
  });
  const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
  const defaultZoom = isMobile ? 1 : 1.4;
  const [viewport, setViewPort] = useState({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const _onStateChange = (state: any) => setMapState({ ...state });
  const _onViewportChange = (view: any) => setViewPort({ ...view });
  const [loaded, setLoaded] = useState(false);

  // Projects
  const [popupData, setPopupData] = useState({ show: false });

  // Explore
  const [exploreProjects, setExploreProjects] = React.useState(true);

  // Use Effects
  useEffect(() => {
    //loads the default mapstyle
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);

  //Props
  const homeProps = {
    searchedProject,
    setPopupData,
    popupData,
    isMobile,
    defaultMapCenter,
    defaultZoom,
    viewport,
    setViewPort,
  };
  const projectProps = {
    project,
    viewport,
    setViewPort,
    isMobile,
    mapRef,
    mapState,
    setMapState,
  };

  const exploreProps = {
    loaded,
    mapRef,
    setShowProjects,
    viewport,
    setViewPort,
    setExploreProjects,
    defaultMapCenter,
    mapState,
    setMapState,
    isMobile,
    exploreProjects,
    showSingleProject,
  };

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        onViewportChange={_onViewportChange}
        onStateChange={_onStateChange}
        onClick={() => setPopupData({ ...popupData, show: false })}
        onLoad={() => setLoaded(true)}
      >
        {!showSingleProject && searchedProject && showProjects && (
          <Home {...homeProps} />
        )}
        {showSingleProject && project && <Project {...projectProps} />}
        <Explore {...exploreProps} />
        <div className={styles.mapNavigation}>
          <NavigationControl showCompass={false} />
        </div>
      </MapGL>
    </div>
  );
}

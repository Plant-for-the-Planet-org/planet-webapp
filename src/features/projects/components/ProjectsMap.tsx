import React, { ReactElement, useEffect, useRef, useState } from 'react';
import MapGL, { NavigationControl } from 'react-map-gl';
import getMapStyle from '../../../utils/maps/getMapStyle';
import styles from '../styles/ProjectsMap.module.scss';
import Project from '../components/maps/Project';
import ExploreLayers from './maps/ExploreLayers';
import Home from './maps/Home';
import { ProjectPropsContext } from '../../common/Layout/ProjectPropsContext';
import StyleToggle from './maps/StyleToggle';
import PlantLocations from './maps/PlantLocations';
import PlantLocation from './maps/PlantLocation';

export default function ProjectsMap(): ReactElement {
  const {
    project,
    showSingleProject,
    showProjects,
    setShowProjects,
    searchedProject,
    viewport,
    setViewPort,
    setExploreProjects,
    mapState,
    setMapState,
    isMobile,
    exploreProjects,
    loaded,
    setLoaded,
    mapRef,
    defaultMapCenter,
    defaultZoom,
    zoomLevel,
  } = React.useContext(ProjectPropsContext);

  //Map
  const _onStateChange = (state: any) => setMapState({ ...state });
  const _onViewportChange = (view: any) => setViewPort({ ...view });

  // Projects
  const [popupData, setPopupData] = useState({ show: false });

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
        {zoomLevel !== 1 && <StyleToggle />}

        {zoomLevel === 1 && searchedProject && showProjects && (
          <Home {...homeProps} />
        )}
        {zoomLevel === 2 && project && (
          <>
            <Project {...projectProps} />
            <PlantLocations />
          </>
        )}
        {zoomLevel === 3 && <PlantLocation />}
        <ExploreLayers />
        <div className={styles.mapNavigation}>
          <NavigationControl showCompass={false} />
        </div>
      </MapGL>
    </div>
  );
}

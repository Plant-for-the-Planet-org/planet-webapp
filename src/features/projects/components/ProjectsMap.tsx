import React, { ReactElement, useEffect, useRef, useState } from 'react';
import MapGL, { MapEvent, NavigationControl, Popup } from 'react-map-gl';
import getMapStyle from '../../../utils/maps/getMapStyle';
import styles from '../styles/ProjectsMap.module.scss';
import Project from '../components/maps/Project';
import ExploreLayers from './maps/ExploreLayers';
import Home from './maps/Home';
import { ProjectPropsContext } from '../../common/Layout/ProjectPropsContext';
import StyleToggle from './maps/StyleToggle';
import PlantLocations from './maps/PlantLocations';
import PlantLocation from './maps/PlantLocation';
import { useRouter } from 'next/router';

export default function ProjectsMap(): ReactElement {
  const router = useRouter();
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
    plIds,
    setHoveredPl,
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

  const [showDetails, setShowDetails] = React.useState({
    coordinates: [],
    show: false,
  });

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

  const onMapClick = (e: MapEvent) => {
    setPopupData({ ...popupData, show: false });
    if (e.features?.length !== 0) {
      console.log('onclick event', e.features[0]);
      if (e.features[0].layer?.source) {
        router.replace(`/${project.slug}/${e.features[0].layer?.source}`);
        // router.push(
        //   '/[p]/[id]',
        //   `/${project.slug}/${e.features[0].layer?.source}`,
        //   { shallow: true }
        // );
      }
    }
  };

  const onMapHover = (e: MapEvent) => {
    if (e.features?.length !== 0) {
      if (e.features[0].layer?.source) {
        setHoveredPl(e.features[0].layer?.source);
      }
      setShowDetails({ coordinates: e.lngLat, show: true });
    } else {
      setShowDetails({ ...showDetails, show: false });
      setHoveredPl('');
    }
  };

  React.useEffect(() => {
    if (zoomLevel !== 2) {
      setShowDetails({ ...showDetails, show: false });
    }
  }, [zoomLevel]);

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        onViewportChange={_onViewportChange}
        onStateChange={_onStateChange}
        onClick={onMapClick}
        onHover={plIds ? onMapHover : undefined}
        onLoad={() => setLoaded(true)}
        interactiveLayerIds={plIds ? plIds : undefined}
      >
        {zoomLevel !== 1 && <StyleToggle />}

        {zoomLevel === 1 && searchedProject && showProjects && (
          <Home {...homeProps} />
        )}
        {(zoomLevel === 2 || zoomLevel === 3) && project && (
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
        {showDetails.show && (
          <Popup
            latitude={showDetails.coordinates[1]}
            longitude={showDetails.coordinates[0]}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setPopupData({ ...popupData, show: false })}
            anchor="bottom"
            dynamicPosition={false}
            offsetTop={-5}
            tipSize={0}
          >
            <div className={styles.clickForDetails}>Click for Details</div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}

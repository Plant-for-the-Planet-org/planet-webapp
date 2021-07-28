import React, { ReactElement, useEffect, useRef, useState } from 'react';
import MapGL, { MapEvent, NavigationControl, Popup } from 'react-map-gl';
import getMapStyle from '../../../utils/maps/getMapStyle';
import styles from '../styles/ProjectsMap.module.scss';
import Project from '../components/maps/Project';
import ExploreLayers from './maps/ExploreLayers';
import Home from './maps/Home';
import { ProjectPropsContext } from '../../common/Layout/ProjectPropsContext';
import PlantLocations from './maps/PlantLocations';
import { useRouter } from 'next/router';
import LayerIcon from '../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../public/assets/images/icons/LayerDisabled';
import i18next from '../../../../i18n';

const { useTranslation } = i18next;

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
    plantLocations,
    setSelectedPl,
    selectedPl,
    satellite,
    setSatellite,
    selectedMode,
    hoveredPl,
    setIsPolygonMenuOpen,
  } = React.useContext(ProjectPropsContext);

  const { t } = useTranslation(['maps']);

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
    setSelectedPl(null);
    setHoveredPl(null);
    setPopupData({ ...popupData, show: false });
    setIsPolygonMenuOpen(false);
    if (e.features?.length !== 0) {
      if (e.features[0].layer?.source) {
        for (const key in plantLocations) {
          if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
            const element = plantLocations[key];
            if (element.id === e.features[0].layer?.source) {
              setSelectedPl(element);
              break;
            }
          }
        }
        //router.replace(`/${project.slug}/${e.features[0].layer?.source}`);
      }
    }
  };

  const onMapHover = (e: MapEvent) => {
    if (e.features?.length !== 0) {
      if (!hoveredPl || hoveredPl.type !== 'sample') {
        if (e.features[0].layer?.source) {
          for (const key in plantLocations) {
            if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
              const element = plantLocations[key];
              if (element.id === e.features[0].layer?.source) {
                setHoveredPl(element);
                // setSelectedPl(element);
                break;
              }
            }
          }
        }
      }
      setShowDetails({ coordinates: e.lngLat, show: true });
    } else {
      setShowDetails({ ...showDetails, show: false });
      setHoveredPl(null);
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
        {zoomLevel === 1 && searchedProject && showProjects && (
          <Home {...homeProps} />
        )}
        {zoomLevel === 2 && project && (
          <>
            <Project {...projectProps} />
            {selectedMode === 'location' && <PlantLocations />}
          </>
        )}
        <ExploreLayers />
        <div className={styles.mapNavigation}>
          {zoomLevel === 2 && selectedMode !== 'imagery' && (
            <div
              onClick={() => setSatellite(!satellite)}
              className={styles.layerToggle}
            >
              {satellite ? <LayerIcon /> : <LayerDisabled />}
            </div>
          )}
          {selectedMode !== 'imagery' && (
            <NavigationControl showCompass={false} />
          )}
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
            <div className={styles.clickForDetails}>{t('clickForDetails')}</div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}

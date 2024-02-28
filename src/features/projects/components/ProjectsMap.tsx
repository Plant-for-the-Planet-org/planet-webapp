import React, { ReactElement, useEffect, useState } from 'react';
import MapGL, { MapEvent, NavigationControl, Popup } from 'react-map-gl';
import getMapStyle from '../../../utils/maps/getMapStyle';
import styles from '../styles/ProjectsMap.module.scss';
import Project from '../components/maps/Project';
import ExploreLayers from './maps/ExploreLayers';
import Home from './maps/Home';
import { useProjectProps } from '../../common/Layout/ProjectPropsContext';
import PlantLocations from './maps/PlantLocations';
import LayerIcon from '../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../public/assets/images/icons/LayerDisabled';
import { useTranslation } from 'next-i18next';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import { PopupData } from './maps/Markers';

export default function ProjectsMap(): ReactElement {
  const {
    project,
    showProjects,
    searchedProject,
    viewport,
    setViewPort,
    mapState,
    setMapState,
    isMobile,
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
    setFilterOpen,
    setSamplePlantLocation,
  } = useProjectProps();

  const { t } = useTranslation(['maps']);
  const { embed, showProjectList } = React.useContext(ParamsContext);
  //Map
  const _onStateChange = (state: any) => setMapState({ ...state });
  const _onViewportChange = (view: any) => setViewPort({ ...view });

  // Projects
  const [popupData, setPopupData] = useState<PopupData>({ show: false });

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

  const [showDetails, setShowDetails] = React.useState<DetailsType>({
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

  const onMapClick = (e: MapEvent) => {
    setSamplePlantLocation(null);
    setPopupData({ show: false });
    setIsPolygonMenuOpen(false);
    setFilterOpen(false);
    if (e.features && e.features?.length !== 0) {
      if (e.features[0].layer?.source) {
        for (const key in plantLocations) {
          if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
            const element = plantLocations[Number(key)];
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
    if (e.features && e.features?.length !== 0) {
      if (!hoveredPl || hoveredPl.type !== 'sample') {
        if (e.features[0].layer?.source && plantLocations) {
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

  React.useEffect(() => {
    if (embed === 'true' && showProjectList === 'false') {
      const newViewport = {
        ...viewport,
        latitude: 36.96,
        longitude: 0,
      };
      setViewPort(newViewport);
    }
  }, [showProjectList]);

  return (
    <div
      className={
        embed === 'true' ? styles.onlymapContainer : styles.mapContainer
      }
    >
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        onViewportChange={_onViewportChange}
        onStateChange={_onStateChange}
        onClick={onMapClick}
        onHover={onMapHover}
        onLoad={() => setLoaded(true)}
        interactiveLayerIds={plIds ? plIds : undefined}
      >
        {zoomLevel === 1 && searchedProject && showProjects && (
          <Home {...homeProps} />
        )}
        {zoomLevel === 2 && project !== null && (
          <>
            <Project
              project={project}
              viewport={viewport}
              setViewPort={setViewPort}
            />
            {selectedMode === 'location' && <PlantLocations />}
          </>
        )}
        <ExploreLayers />
        {zoomLevel === 2 && selectedMode === 'location' && (
          <div
            onClick={() => setSatellite(!satellite)}
            className={styles.layerToggle}
          >
            {satellite ? <LayerIcon /> : <LayerDisabled />}
          </div>
        )}
        <div className={styles.mapNavigation}>
          <NavigationControl showCompass={false} />
        </div>
        {showDetails.show && (
          <Popup
            latitude={showDetails.coordinates[1]}
            longitude={showDetails.coordinates[0]}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setPopupData({ show: false })}
            anchor="bottom"
            dynamicPosition={false}
            offsetTop={-5}
            tipSize={0}
          >
            {hoveredPl?.hid && selectedPl?.hid !== hoveredPl?.hid && (
              <div className={styles.clickForDetails}>
                {t('clickForDetails')}
              </div>
            )}
          </Popup>
        )}
      </MapGL>
    </div>
  );
}
interface DetailsType {
  coordinates: number[];
  show: boolean;
}

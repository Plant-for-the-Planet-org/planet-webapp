import type { MapEvent } from 'react-map-gl';
import type { PopupData } from './maps/Markers';
import type { PlantLocation } from '../../common/types/plantLocation';
import type { ReactElement } from 'react';

import React, { useEffect, useState } from 'react';
import MapGL, { NavigationControl, Popup } from 'react-map-gl';
import getMapStyle from '../../../utils/maps/getMapStyle';
import styles from '../styles/ProjectsMap.module.scss';
import Project from '../components/maps/Project';
import ExploreLayers from './maps/ExploreLayers';
import Home from './maps/Home';
import { useProjectProps } from '../../common/Layout/ProjectPropsContext';
import PlantLocations from './maps/PlantLocations';
import LayerIcon from '../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../public/assets/images/icons/LayerDisabled';
import { useTranslations } from 'next-intl';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';

interface ShowDetailsProps {
  coordinates: [number, number] | null;
  show: boolean;
}

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

  const t = useTranslations('Maps');
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

  const [showDetails, setShowDetails] = React.useState<ShowDetailsProps>({
    coordinates: null,
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

  const handlePlantLocationSelection = (
    plantLocations: PlantLocation[] | null,
    e: MapEvent
  ) => {
    if (!plantLocations || !e || !e.features || !e.features[0]) {
      return;
    }

    const { id } = e.features[0].properties;
    const selectedElement = plantLocations.find(
      (location) => location.id === id
    );

    if (selectedElement) {
      setSelectedPl(selectedElement);
    }
  };

  const onMapClick = (e: MapEvent) => {
    setSamplePlantLocation(null);
    setPopupData({ show: false });
    setIsPolygonMenuOpen(false);
    setFilterOpen(false);
    handlePlantLocationSelection(plantLocations, e);
  };

  const onMapHover = (e: MapEvent) => {
    if (plantLocations && e && e.features && e.features[0]) {
      const activeElement = e.features[0];
      if (selectedPl && selectedPl.id === activeElement.properties.id) {
        setHoveredPl(null);
        setShowDetails({ coordinates: e.lngLat, show: true });
        return;
      }
      const activePlantLocation = plantLocations.find(
        (obj) => obj.id === activeElement.properties.id
      );
      if (activePlantLocation) {
        setHoveredPl(activePlantLocation);
        setSamplePlantLocation(null);
        setShowDetails({ coordinates: e.lngLat, show: true });
        return;
      }
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

  const handleOnLoad = () => {
    setLoaded(true);
  };

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
        // TODO: onStateChange is deprecated, and does not work any more. _onStateChange does not seem to be called in any scenario while debugging the code. However this is left in to avoid breaking the code unintentionally. NOTE: replacing with onViewStateChange does not work as expected, the map stops zooming in to a clicked plant location, or to the site after switching between the Field data and Time travel map tabs.
        onStateChange={_onStateChange}
        onClick={onMapClick}
        onHover={onMapHover}
        onLoad={handleOnLoad}
        interactiveLayerIds={
          project !== null ? ['polygon-layer', 'point-layer'] : undefined
        }
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
            latitude={
              showDetails?.coordinates ? showDetails?.coordinates[1] : 0
            }
            longitude={
              showDetails?.coordinates ? showDetails?.coordinates[1] : 0
            }
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

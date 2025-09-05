import type { MapEvent } from 'react-map-gl';
import type { PopupData } from './maps/Markers';
import type { Intervention } from '../../common/types/intervention';
import type { ReactElement } from 'react';

import { useEffect, useState, useContext } from 'react';
import MapGL, { NavigationControl, Popup } from 'react-map-gl';
import getMapStyle from '../../../utils/maps/getMapStyle';
import styles from '../styles/ProjectsMap.module.scss';
import Project from '../components/maps/Project';
import ExploreLayers from './maps/ExploreLayers';
import Home from './maps/Home';
import { useProjectProps } from '../../common/Layout/ProjectPropsContext';
import Interventions from './maps/Interventions';
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
    interventions,
    setSelectedPl,
    selectedPl,
    satellite,
    setSatellite,
    selectedMode,
    hoveredPl,
    setIsPolygonMenuOpen,
    setFilterOpen,
    setSampleIntervention,
  } = useProjectProps();

  const t = useTranslations('Maps');
  const { embed, showProjectList } = useContext(ParamsContext);
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

  const [showDetails, setShowDetails] = useState<ShowDetailsProps>({
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

  const handleInterventionSelection = (
    intervention: Intervention[] | null,
    e: MapEvent
  ) => {
    if (!intervention || !e || !e.features || !e.features[0]) {
      return;
    }

    const { id } = e.features[0].properties;
    const selectedElement = intervention.find((i) => i.id === id);

    if (selectedElement) {
      setSelectedPl(selectedElement);
    }
  };

  const onMapClick = (e: MapEvent) => {
    setSampleIntervention(null);
    setPopupData({ show: false });
    setIsPolygonMenuOpen(false);
    setFilterOpen(false);
    handleInterventionSelection(interventions, e);
  };

  const onMapHover = (e: MapEvent) => {
    if (interventions && e && e.features && e.features[0]) {
      const activeElement = e.features[0];
      if (selectedPl && selectedPl.id === activeElement.properties.id) {
        setHoveredPl(null);
        setShowDetails({ coordinates: e.lngLat, show: true });
        return;
      }
      const activeIntervention = interventions.find(
        (obj) => obj.id === activeElement.properties.id
      );
      if (activeIntervention) {
        setHoveredPl(activeIntervention);
        setSampleIntervention(null);
        setShowDetails({ coordinates: e.lngLat, show: true });
        return;
      }
    } else {
      setShowDetails({ ...showDetails, show: false });
      setHoveredPl(null);
    }
  };

  useEffect(() => {
    if (zoomLevel !== 2) {
      setShowDetails({ ...showDetails, show: false });
    }
  }, [zoomLevel]);

  useEffect(() => {
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
            {selectedMode === 'location' && <Interventions />}
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

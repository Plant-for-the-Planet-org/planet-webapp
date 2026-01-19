import type { ViewStateChangeEvent } from 'react-map-gl-v7/maplibre';
import type { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import type { SetState } from '../../common/types/common';
import type { SelectedTab } from './ProjectMapTabs';
import type { SingleTreeRegistration } from '@planet-sdk/common';
import type { ExtendedMapLibreMap, MapLibreRef } from '../../common/types/map';

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useFetchLayers } from '../../../utils/mapsV2/useFetchLayers';
import MultipleProjectsView from './MultipleProjectsView';
import SingleProjectView from './SingleProjectView';
import {
  areMapCoordsEqual,
  calculateCentroid,
  centerMapOnCoordinates,
  getDeviceType,
  getFeaturesAtPoint,
  getInterventionInfo,
  getSitesGeoJson,
  getSiteIndex,
  getValidFeatures,
  INTERACTIVE_LAYERS,
} from '../../../utils/projectV2';
import MapControls from './MapControls';
import MapTabs from './ProjectMapTabs';
import { useProjects } from '../ProjectsContext';
import MultiTreeInfo from '../ProjectDetails/components/MultiTreeInfo';
import SingleTreeInfo from '../ProjectDetails/components/SingleTreeInfo';
import styles from './ProjectsMap.module.scss';
import { useDebouncedEffect } from '../../../utils/useDebouncedEffect';
import { zoomOutMap } from '../../../utils/mapsV2/zoomToProjectSite';
import OtherInterventionInfo from '../ProjectDetails/components/OtherInterventionInfo';
import { PLANTATION_TYPES } from '../../../utils/constants/intervention';
import ExploreLayers from './ExploreLayers';
import { clsx } from 'clsx';
import { useProjectMapStore } from '../../../stores/projectMapStore';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';

const TimeTravel = dynamic(() => import('./TimeTravel'), {
  ssr: false,
  loading: () => <p>Loading comparison...</p>,
});

export type ProjectsMapDesktopProps = {
  isMobile: false;
  page: 'project-list' | 'project-details';
};
export type ProjectsMapMobileProps = {
  selectedMode: ViewMode;
  setSelectedMode: SetState<ViewMode>;
  isMobile: true;
  page: 'project-list' | 'project-details';
};
export type ProjectsMapProps = ProjectsMapMobileProps | ProjectsMapDesktopProps;

function ProjectsMap(props: ProjectsMapProps) {
  // Fetch layers data
  useFetchLayers();
  const mapRef: MapLibreRef = useRef<ExtendedMapLibreMap | null>(null);
  const { isContextLoaded, embed } = useContext(ParamsContext);

  const mapOptions = useProjectMapStore((state) => state.mapOptions);
  const timeTravelConfig = useProjectMapStore(
    (state) => state.timeTravelConfig
  );

  const viewState = useProjectMapStore((state) => state.viewState);
  const mapState = useProjectMapStore((state) => state.mapState);

  const initializeMapStyle = useProjectMapStore(
    (state) => state.initializeMapStyle
  );
  const setTimeTravelConfig = useProjectMapStore(
    (state) => state.setTimeTravelConfig
  );
  const handleViewStateChange = useProjectMapStore(
    (state) => state.handleViewStateChange
  );
  const setMapState = useProjectMapStore((state) => state.setMapState);

  const {
    interventions,
    setHoveredIntervention,
    setSelectedIntervention,
    setSelectedSite,
    setSelectedSampleTree,
    filteredProjects,
    projects,
    singleProject,
    selectedIntervention,
    selectedSampleTree,
  } = useProjects();
  const [selectedTab, setSelectedTab] = useState<SelectedTab | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [wasTimeTravelMounted, setWasTimeTravelMounted] = useState(false);
  const isQueryParamsLoaded = isContextLoaded;
  const isEmbedded = embed === 'true';
  const sitesGeoJson = useMemo(
    () => getSitesGeoJson(singleProject?.sites ?? []),
    [singleProject?.sites]
  );
  const isExploreMode = useMemo(() => {
    const enabledLayers = Object.entries(mapOptions).filter(
      ([key, value]) => key !== 'projects' && value === true
    );
    return enabledLayers.length > 0;
  }, [mapOptions]);

  useEffect(() => {
    initializeMapStyle();
  }, [initializeMapStyle]);

  useEffect(() => {
    if (!mapLoaded) return;
    // Ensure the map resizes properly once it's fully loaded.
    mapRef.current?.resize();
  }, [mapLoaded]);

  useEffect(() => {
    if (props.page === 'project-details') {
      setSelectedTab('field');
    } else {
      setTimeTravelConfig(null);
      setSelectedTab(null);
      setWasTimeTravelMounted(false);
    }
  }, [props.page]);

  useEffect(() => {
    if (selectedTab === 'timeTravel') {
      setWasTimeTravelMounted(true);
    }
  }, [selectedTab]);

  useEffect(() => {
    // Update mapState when embed status changes, but only after query params are loaded
    if (isQueryParamsLoaded) {
      setMapState({ scrollZoom: !isEmbedded });
    }
  }, [isQueryParamsLoaded, isEmbedded, setMapState]);

  useDebouncedEffect(
    () => {
      const map = mapRef.current;
      const shouldCenterMap =
        filteredProjects !== undefined &&
        filteredProjects.length > 0 &&
        (filteredProjects.length < 30 ||
          filteredProjects.length === projects?.length) &&
        map !== null &&
        props.page === 'project-list';

      if (!shouldCenterMap) return;
      const validFeatures = getValidFeatures(filteredProjects);
      if (validFeatures.length === 0) return;

      const centroid = calculateCentroid(validFeatures);
      if (!centroid.geometry) return;

      const currentCenter = map.getCenter();
      if (areMapCoordsEqual(currentCenter, centroid.geometry.coordinates))
        return;

      centerMapOnCoordinates(mapRef, centroid.geometry.coordinates);
    },
    250,
    [filteredProjects]
  );

  const shouldShowSingleProjectsView =
    singleProject !== null && props.page === 'project-details' && mapLoaded;
  const shouldShowMultipleProjectsView =
    Boolean(mapOptions.projects) &&
    projects &&
    projects.length > 0 &&
    !shouldShowSingleProjectsView &&
    mapLoaded;
  const shouldShowMultiTreeInfo =
    props.isMobile &&
    selectedSampleTree === null &&
    selectedIntervention?.type === 'multi-tree-registration';
  const shouldShowSingleTreeInfo =
    props.isMobile &&
    (selectedSampleTree !== null ||
      selectedIntervention?.type === 'single-tree-registration');
  const shouldShowNavigationControls = !(
    shouldShowMultiTreeInfo || shouldShowSingleTreeInfo
  );
  const isTimeTravelEnabled =
    shouldShowSingleProjectsView &&
    timeTravelConfig !== null &&
    timeTravelConfig.sources !== null &&
    timeTravelConfig.projectId === singleProject?.id &&
    !props.isMobile;
  const shouldShowTimeTravel =
    isTimeTravelEnabled &&
    (selectedTab === 'timeTravel' || wasTimeTravelMounted);
  const shouldShowMapTabs = selectedTab !== null;
  const shouldShowExploreLayers =
    props.page === 'project-list' && isExploreMode;

  const mobileOS = useMemo(() => getDeviceType(), [props.isMobile]);
  const mapControlProps = {
    selectedMode: props.isMobile ? props.selectedMode : undefined,
    setSelectedMode: props.isMobile ? props.setSelectedMode : undefined,
    selectedTab,
    isMobile: props.isMobile,
    page: props.page,
    mobileOS,
  };

  useEffect(() => {
    if (props.page === 'project-details' || !mapLoaded) return;

    if (mapRef.current) {
      const map = mapRef.current.getMap
        ? mapRef.current.getMap()
        : mapRef.current;

      try {
        zoomOutMap(map, () => {
          handleViewStateChange({
            ...map.getCenter(),
            zoom: map.getZoom(),
          });
        });
      } catch (err) {
        console.error('Failed to zoom out map:', err);
      }
    }
  }, [props.page, mapLoaded]);

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      handleViewStateChange(evt.viewState);
    },
    [handleViewStateChange]
  );

  const onMouseMove = useCallback(
    (e) => {
      if (props.page !== 'project-details') return;
      const features = getFeaturesAtPoint(mapRef, e.point);
      if (!features || features.length === 0) return;

      const newIntervention = getInterventionInfo(interventions, features);

      if (
        !newIntervention ||
        newIntervention.hid === selectedIntervention?.hid
      ) {
        setHoveredIntervention(null);
        return;
      }
      setHoveredIntervention(newIntervention);
    },
    [interventions, props.page, selectedIntervention]
  );
  /**
   * Map click handler invoked when user clicks on the map in 'project-details' or 'project-list' page (which results in an early return).
   * Is not invoked while clicking on SampleTreeMarkers as propagation is stopped there.
   * This onClick handler is responsible for:
   * - Selecting: point intervention(single tree), polygon intervention(multi tree), or project sites
   * - Deselecting: point intervention ,sample point intervention, other interventions(point geometry)
   */
  const onClick = useCallback(
    (e) => {
      if (props.page !== 'project-details') return;

      const features = getFeaturesAtPoint(mapRef, e.point);
      if (!features || features.length === 0) return;

      const newIntervention = getInterventionInfo(interventions, features);
      const isSamePlant = newIntervention?.id === selectedIntervention?.id;
      const isPointGeometry =
        newIntervention !== undefined &&
        newIntervention.geometry.type === 'Point';

      const sites = singleProject?.sites || [];
      const hasSites = sites.length > 0;
      const siteIndex = hasSites ? getSiteIndex(sites, features) : null;

      // Deselect sample tree when clicking the parent multi tree polygon
      if (selectedSampleTree) setSelectedSampleTree(null);

      // Deselect if clicking the same point intervention again
      if (isSamePlant && isPointGeometry) {
        setSelectedIntervention(null);
        if (siteIndex !== null && siteIndex >= 0) {
          setSelectedSite(siteIndex);
        } else {
          setSelectedSite(null);
        }
        return;
      }
      // If clicking a point/polygon intervention, set it and clear selected site
      if (newIntervention) {
        setSelectedIntervention(newIntervention);
        setSelectedSite(null);
        return;
      } else {
        // Otherwise, check if a site polygon was clicked
        if (siteIndex !== null && siteIndex >= 0) {
          setSelectedSite(siteIndex);
          setSelectedIntervention(null);
          setHoveredIntervention(null);
          return;
        }
      }
    },
    [
      interventions,
      props.page,
      selectedIntervention,
      singleProject,
      selectedSampleTree,
    ]
  );

  const singleProjectViewProps = {
    mapRef,
    selectedTab,
    sitesGeoJson,
  };

  const multipleProjectsViewProps = {
    mapRef,
    page: props.page,
  };

  const baseInterventionInfoProps = {
    isMobile: props.isMobile,
    setSelectedSampleTree,
  };

  const shouldShowOtherIntervention =
    props.isMobile &&
    selectedIntervention !== null &&
    !PLANTATION_TYPES.includes(selectedIntervention.type);

  return (
    <>
      <MapControls {...mapControlProps} />

      <div className={clsx(styles.mapContainer, mobileOS && styles[mobileOS])}>
        {shouldShowMapTabs && (
          <MapTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            isTimeTravelEnabled={isTimeTravelEnabled}
          />
        )}
        {shouldShowTimeTravel && (
          <div>
            <TimeTravel
              sitesGeoJson={sitesGeoJson}
              isVisible={selectedTab === 'timeTravel'}
            />
          </div>
        )}
        <Map
          {...viewState}
          {...mapState}
          onMove={onMove}
          onLoad={() => setMapLoaded(true)}
          onMouseMove={onMouseMove}
          onMouseOut={() => setHoveredIntervention(null)}
          onClick={onClick}
          attributionControl={false}
          ref={mapRef}
          interactiveLayerIds={
            singleProject !== null ? INTERACTIVE_LAYERS : undefined
          }
          style={{ width: '100%', height: '100%' }}
        >
          {shouldShowExploreLayers && <ExploreLayers />}
          {shouldShowSingleProjectsView && (
            <SingleProjectView {...singleProjectViewProps} />
          )}
          {shouldShowMultipleProjectsView && (
            <MultipleProjectsView {...multipleProjectsViewProps} />
          )}
          {shouldShowNavigationControls && (
            <NavigationControl position="bottom-right" showCompass={false} />
          )}
        </Map>
      </div>
      {shouldShowMultiTreeInfo && (
        <MultiTreeInfo
          activeMultiTree={selectedIntervention}
          {...baseInterventionInfoProps}
        />
      )}
      {shouldShowSingleTreeInfo && (
        <SingleTreeInfo
          activeSingleTree={
            selectedSampleTree ||
            (selectedIntervention as SingleTreeRegistration)
          }
          {...baseInterventionInfoProps}
        />
      )}
      {shouldShowOtherIntervention ? (
        <OtherInterventionInfo
          selectedIntervention={
            selectedIntervention?.type !== 'single-tree-registration' &&
            selectedIntervention?.type !== 'multi-tree-registration'
              ? selectedIntervention
              : null
          }
          {...baseInterventionInfoProps}
        />
      ) : null}
    </>
  );
}

export default ProjectsMap;

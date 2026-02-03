import type { ViewStateChangeEvent } from 'react-map-gl-v7/maplibre';
import type { SelectedTab } from './ProjectMapTabs';
import type { SingleTreeRegistration } from '@planet-sdk/common';
import type { ExtendedMapLibreMap, MapLibreRef } from '../../common/types/map';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  isPlantFeature,
} from '../../../utils/projectV2';
import MapControls from './MapControls';
import MapTabs from './ProjectMapTabs';
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
import { useQueryParamStore } from '../../../stores/queryParamStore';
import {
  useInterventionStore,
  useProjectStore,
  useSingleProjectStore,
  useViewStore,
} from '../../../stores';
import { useFilteredProjects } from '../../../hooks/useFilteredProjects';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/router';

const TimeTravel = dynamic(() => import('./TimeTravel'), {
  ssr: false,
  loading: () => <p>Loading comparison...</p>,
});

export type ProjectsMapDesktopProps = {
  isMobile: false;
};
export type ProjectsMapMobileProps = {
  isMobile: true;
};
export type ProjectsMapProps = ProjectsMapMobileProps | ProjectsMapDesktopProps;

function ProjectsMap(props: ProjectsMapProps) {
  // Fetch layers data
  useFetchLayers();
  const { isMobile } = props;
  const locale = useLocale();
  const router = useRouter();
  const mapRef: MapLibreRef = useRef<ExtendedMapLibreMap | null>(null);
  // track last hovered intervention to avoid duplicate state updates
  const lastHoveredIdRef = useRef<string | null>(null);
  const { filteredProjects } = useFilteredProjects();
  // store: state
  const currentPage = useViewStore((state) => state.page);
  const isEmbedded = useQueryParamStore((state) => state.embed === 'true');
  const isQueryParamsLoaded = useQueryParamStore(
    (state) => state.isContextLoaded
  );
  const mapOptions = useProjectMapStore((state) => state.mapOptions);
  const timeTravelConfig = useProjectMapStore(
    (state) => state.timeTravelConfig
  );
  const viewState = useProjectMapStore((state) => state.viewState);
  const mapState = useProjectMapStore((state) => state.mapState);
  const projects = useProjectStore((state) => state.projects);
  const singleProject = useSingleProjectStore((state) => state.singleProject);
  const selectedSampleTree = useSingleProjectStore(
    (state) => state.selectedSampleTree
  );
  const selectedIntervention = useInterventionStore(
    (state) => state.selectedIntervention
  );
  const interventions = useInterventionStore((state) => state.interventions);
  // store: action
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
  const setSelectedSampleTree = useSingleProjectStore(
    (state) => state.setSelectedSampleTree
  );
  const selectSiteAndSyncUrl = useSingleProjectStore(
    (state) => state.selectSiteAndSyncUrl
  );
  const setHoveredIntervention = useInterventionStore(
    (state) => state.setHoveredIntervention
  );
  const selectInterventionSyncUrl = useInterventionStore(
    (state) => state.selectInterventionSyncUrl
  );

  const [selectedTab, setSelectedTab] = useState<SelectedTab | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [wasTimeTravelMounted, setWasTimeTravelMounted] = useState(false);

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
    if (currentPage === 'project-details') {
      setSelectedTab('field');
    } else {
      setTimeTravelConfig(null);
      setSelectedTab(null);
      setWasTimeTravelMounted(false);
    }
  }, [currentPage]);

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
        filteredProjects.length > 0 &&
        (filteredProjects.length < 30 ||
          filteredProjects.length === projects?.length) &&
        map !== null &&
        currentPage === 'project-list';

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
    singleProject !== null && currentPage === 'project-details' && mapLoaded;
  const shouldShowMultipleProjectsView =
    Boolean(mapOptions.projects) &&
    projects &&
    projects.length > 0 &&
    !shouldShowSingleProjectsView &&
    mapLoaded;
  const shouldShowMultiTreeInfo =
    isMobile &&
    selectedSampleTree === null &&
    selectedIntervention?.type === 'multi-tree-registration';
  const shouldShowSingleTreeInfo =
    isMobile &&
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
    !isMobile;
  const shouldShowTimeTravel =
    isTimeTravelEnabled &&
    (selectedTab === 'timeTravel' || wasTimeTravelMounted);
  const shouldShowMapTabs = selectedTab !== null;
  const shouldShowExploreLayers =
    currentPage === 'project-list' && isExploreMode;

  const mobileOS = useMemo(() => getDeviceType(), [isMobile]);

  useEffect(() => {
    if (currentPage === 'project-details' || !mapLoaded) return;

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
  }, [currentPage, mapLoaded]);

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      handleViewStateChange(evt.viewState);
    },
    [handleViewStateChange]
  );

  const onMouseMove = useCallback(
    (e) => {
      if (currentPage !== 'project-details') return;

      const features = getFeaturesAtPoint(mapRef, e.point);
      if (!features?.length) {
        // only clear hover if something was previously hovered
        if (lastHoveredIdRef.current !== null) {
          lastHoveredIdRef.current = null;
          setHoveredIntervention(null);
        }
        return;
      }

      // Map libraries typically return features ordered by render stack,
      // where the first item represents the topmost visible layer at the point.
      if (!isPlantFeature(features[0])) return;
      if (features[0].properties.id === lastHoveredIdRef.current) return;

      const newIntervention = getInterventionInfo(interventions, features[0]);
      const newId = newIntervention?.id ?? null;

      lastHoveredIdRef.current = newId;
      setHoveredIntervention(newIntervention ?? null);
    },
    [interventions, currentPage]
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
      if (currentPage !== 'project-details') return;

      const features = getFeaturesAtPoint(mapRef, e.point);
      if (!features || features.length === 0) return;

      const sites = singleProject?.sites || [];
      const projectSlug = singleProject?.slug ?? '';
      const hasSites = sites.length > 0;
      const siteIndex = hasSites ? getSiteIndex(sites, features) : null;

      // Deselect sample tree when clicking the parent multi tree polygon
      if (selectedSampleTree) setSelectedSampleTree(null);

      if (isPlantFeature(features[0])) {
        const isSameIntervention =
          features[0].properties?.id === selectedIntervention?.id;
        if (isSameIntervention) return;

        const newIntervention = getInterventionInfo(interventions, features[0]);

        // Clicking an intervention → select it
        if (newIntervention) {
          selectInterventionSyncUrl(
            newIntervention,
            locale,
            projectSlug,
            router
          );
          return;
        }
      }

      // Otherwise, handle site selection
      if (siteIndex !== null && siteIndex >= 0) {
        selectSiteAndSyncUrl(siteIndex, locale, router);
      }
    },
    [
      interventions,
      currentPage,
      selectedIntervention,
      singleProject,
      selectedSampleTree,
    ]
  );

  const mapControlProps = {
    selectedTab,
    isMobile,
    currentPage,
    mobileOS,
  };

  const singleProjectViewProps = {
    mapRef,
    selectedTab,
    sitesGeoJson,
  };

  const shouldShowOtherIntervention =
    isMobile &&
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
          {shouldShowMultipleProjectsView && <MultipleProjectsView />}
          {shouldShowNavigationControls && (
            <NavigationControl position="bottom-right" showCompass={false} />
          )}
        </Map>
      </div>
      {shouldShowMultiTreeInfo && (
        <MultiTreeInfo
          activeMultiTree={selectedIntervention}
          isMobile={isMobile}
        />
      )}
      {shouldShowSingleTreeInfo && (
        <SingleTreeInfo
          activeSingleTree={
            selectedSampleTree ||
            (selectedIntervention as SingleTreeRegistration)
          }
          isMobile={isMobile}
        />
      )}
      {shouldShowOtherIntervention && (
        <OtherInterventionInfo isMobile={isMobile} />
      )}
    </>
  );
}

export default ProjectsMap;

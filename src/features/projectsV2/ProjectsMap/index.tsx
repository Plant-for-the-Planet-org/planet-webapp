import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useCallback } from 'react';
import { useRef, MutableRefObject } from 'react';
import { useProjectsMap } from '../ProjectsMapContext';
import MultipleProjectsView from './MultipleProjectsView';
import SingleProjectView from './SingleProjectView';
import {
  getPlantLocationInfo,
  updateUrlWithSiteId,
} from '../../../utils/projectV2';
import MapControls from './MapControls';
import { useProjects } from '../ProjectsContext';
import { ViewMode } from '../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import { SetState } from '../../common/types/common';
import { useRouter } from 'next/router';
import { useLocale } from 'next-intl';

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
  const mapRef: MutableRefObject<null> = useRef(null);
  const { viewState, setViewState, mapState, mapOptions } = useProjectsMap();
  const {
    plantLocations,
    setHoveredPlantLocation,
    setSelectedPlantLocation,
    setSelectedSite,
  } = useProjects();
  const { projects, singleProject, selectedPlantLocation } = useProjects();
  const router = useRouter();
  const locale = useLocale();

  const updateSiteAndUrl = (
    locale: string,
    projectSlug: string,
    siteIndex: number
  ) => {
    if (singleProject?.sites?.length === 0) return;
    setSelectedSite(siteIndex);
    const siteId = singleProject?.sites?.[siteIndex].properties.id;
    if (siteId) updateUrlWithSiteId(locale, projectSlug, siteId, router);
  };

  const shouldShowSingleProjectsView =
    singleProject !== null && props.page === 'project-details';
  const shouldShowMultipleProjectsView =
    mapOptions.showProjects &&
    projects &&
    projects.length > 0 &&
    !shouldShowSingleProjectsView;

  const mapControlProps = {
    selectedMode: props.isMobile ? props.selectedMode : undefined,
    setSelectedMode: props.isMobile ? props.setSelectedMode : undefined,
    isMobile: props.isMobile,
    page: props.page,
  };

  const onMouseMove = useCallback(
    (e) => {
      if (props.page !== 'project-details') return;
      const hoveredPlantLocation = getPlantLocationInfo(
        plantLocations,
        mapRef,
        e.point
      );
      if (
        !hoveredPlantLocation ||
        hoveredPlantLocation.hid === selectedPlantLocation?.hid
      ) {
        setHoveredPlantLocation(null);
        return;
      }
      setHoveredPlantLocation(hoveredPlantLocation);
    },
    [plantLocations, props.page, selectedPlantLocation]
  );
  const onClick = useCallback(
    (e) => {
      if (props.page !== 'project-details') return;
      const result = getPlantLocationInfo(plantLocations, mapRef, e.point);
      if (
        result?.geometry.type === 'Point' &&
        result.id === selectedPlantLocation?.id &&
        singleProject?.slug
      ) {
        updateSiteAndUrl(locale, singleProject?.slug, 0);
        setSelectedPlantLocation(null);
        return;
      }
      if (result) {
        setSelectedSite(null);
        setSelectedPlantLocation(result);
      }
    },
    [plantLocations, props.page, selectedPlantLocation]
  );
  return (
    <>
      <MapControls {...mapControlProps} />
      <Map
        {...viewState}
        {...mapState}
        onMove={(e) => setViewState(e.viewState)}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHoveredPlantLocation(null)}
        onClick={onClick}
        attributionControl={false}
        ref={mapRef}
        interactiveLayerIds={
          singleProject !== null
            ? ['plant-polygon-layer', 'point-layer']
            : undefined
        }
      >
        {shouldShowSingleProjectsView && <SingleProjectView mapRef={mapRef} />}
        {shouldShowMultipleProjectsView && (
          <MultipleProjectsView setViewState={setViewState} mapRef={mapRef} />
        )}
        <NavigationControl
          position="bottom-right"
          showCompass={false}
          style={{
            position: 'relative',
            bottom: props.isMobile ? '120px' : '0px',
          }}
        />
      </Map>
    </>
  );
}

export default ProjectsMap;

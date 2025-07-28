import type { MapRef } from '../../common/types/projectv2';
import type { SelectedTab } from './ProjectMapTabs';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useProjects } from '../ProjectsContext';
import { useProjectsMap } from '../ProjectsMapContext';
import SatelliteLayer from './microComponents/SatelliteLayer';
import { zoomInToProjectSite } from '../../../utils/mapsV2/zoomToProjectSite';
import SitePolygon from './microComponents/SitePolygon';
import Interventions from './microComponents/Interventions';
import { zoomToPolygonIntervention } from '../../../utils/mapsV2/zoomToPolygonIntervention';
import zoomToLocation from '../../../utils/mapsV2/zoomToLocation';
import ProjectLocation from './microComponents/ProjectLocation';
import { MAIN_MAP_ANIMATION_DURATIONS } from '../../../utils/projectV2';
import FireLocations from './microComponents/FireLocations';
import FeatureFlag from './microComponents/FeatureFlag';
import { isFirealertFiresEnabled } from '../../../utils/projectV2';

interface Props {
  mapRef: MapRef;
  selectedTab: SelectedTab | null;
}

const SingleProjectView = ({ mapRef, selectedTab }: Props) => {
  const { singleProject, selectedSite, selectedIntervention, interventions } =
    useProjects();
  if (singleProject === null) return null;

  const router = useRouter();
  const { ploc: requestedPlantLocation, site: requestedSite } = router.query;

  const { isSatelliteView, handleViewStateChange, setIsSatelliteView } =
    useProjectsMap();

  const sitesGeoJson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features:
        singleProject?.sites?.filter((site) => site.geometry !== null) ?? [],
    };
  }, [singleProject?.sites]);
  const hasNoSites = sitesGeoJson.features.length === 0;
  // Zoom to intervention
  useEffect(() => {
    if (!router.isReady || selectedIntervention === null) return;
    const { geometry } = selectedIntervention;
    const { type, coordinates } = geometry;

    const isPolygonLocation = type === 'Polygon';
    const isPointLocation = type === 'Point';

    if (isPolygonLocation) {
      const polygonCoordinates = coordinates[0];
      zoomToPolygonIntervention(
        polygonCoordinates,
        mapRef,
        handleViewStateChange,
        MAIN_MAP_ANIMATION_DURATIONS.ZOOM_IN
      );
    } else if (isPointLocation) {
      const [lon, lat] = coordinates;
      if (typeof lon === 'number' && typeof lat === 'number') {
        zoomToLocation(
          handleViewStateChange,
          lon,
          lat,
          20,
          MAIN_MAP_ANIMATION_DURATIONS.ZOOM_IN,
          mapRef
        );
      }
    }
  }, [selectedIntervention, router.isReady]);

  // Zoom to project site
  useEffect(() => {
    if (
      !router.isReady ||
      selectedIntervention !== null ||
      Boolean(requestedPlantLocation)
    )
      return;
    if (sitesGeoJson.features.length > 0 && selectedSite !== null) {
      zoomInToProjectSite(
        mapRef,
        sitesGeoJson,
        selectedSite,
        handleViewStateChange,
        MAIN_MAP_ANIMATION_DURATIONS.ZOOM_IN
      );
    } else {
      const { lat: latitude, lon: longitude } = singleProject.coordinates;
      if (!(singleProject.sites?.length === 0)) return;

      if (typeof latitude === 'number' && typeof longitude === 'number') {
        // Zoom into the project location that has no site
        zoomToLocation(
          handleViewStateChange,
          longitude,
          latitude,
          10,
          4000,
          mapRef
        );
      }
    }
  }, [selectedSite, requestedSite, router.isReady]);
  // Enable satellite view for 'conservation' projects or 'trees' projects without plant locations(tree mapper data).
  useEffect(() => {
    const isSatelliteView =
      singleProject.purpose === 'conservation' ||
      (singleProject.purpose === 'trees' &&
        (!interventions || interventions.length === 0));

    setIsSatelliteView(isSatelliteView);
  }, [interventions, singleProject.purpose]);
  return (
    <>
      {hasNoSites ? (
        <ProjectLocation
          latitude={singleProject.coordinates.lat}
          longitude={singleProject.coordinates.lon}
          purpose={singleProject.purpose}
        />
      ) : (
        <>
          <SitePolygon
            isSatelliteView={isSatelliteView}
            geoJson={sitesGeoJson}
          />
          {isSatelliteView && <SatelliteLayer />}
        </>
      )}
      {selectedTab === 'field' && <Interventions />}
      <FeatureFlag condition={isFirealertFiresEnabled()}>
        <FireLocations />
      </FeatureFlag>
    </>
  );
};
export default SingleProjectView;

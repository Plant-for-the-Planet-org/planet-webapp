import type { MapRef } from '../../common/types/projectv2';
import type { SelectedTab } from './ProjectMapTabs';
import type { SiteFeatureCollection } from '../../common/types/projectv2';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProjects } from '../ProjectsContext';
import { useProjectsMap } from '../ProjectsMapContext';
import SatelliteLayer from './microComponents/SatelliteLayer';
import { zoomInToProjectSite } from '../../../utils/mapsV2/zoomToProjectSite';
import SiteLayers from './microComponents/SiteLayers';
import InterventionLayers from './microComponents/InterventionLayers';
import { zoomToPolygonPlantLocation } from '../../../utils/mapsV2/zoomToPolygonPlantLocation';
import zoomToLocation from '../../../utils/mapsV2/zoomToLocation';
import ProjectLocationMarker from './microComponents/ProjectLocationMarker';
import FireLocationsMarker from './microComponents/FireLocationsMarker';
import { MAIN_MAP_ANIMATION_DURATIONS } from '../../../utils/projectV2';
import FeatureFlag from './microComponents/FeatureFlag';
import { isFirealertFiresEnabled } from '../../../utils/projectV2';

interface Props {
  mapRef: MapRef;
  selectedTab: SelectedTab | null;
  sitesGeoJson: SiteFeatureCollection;
}

const SingleProjectView = ({ mapRef, selectedTab, sitesGeoJson }: Props) => {
  const { singleProject, selectedSite, selectedPlantLocation, plantLocations } =
    useProjects();
  if (singleProject === null) return null;
  const { isSatelliteView, handleViewStateChange, setIsSatelliteView } =
    useProjectsMap();
  const router = useRouter();

  const hasSitesFeature = sitesGeoJson.features.length > 0;
  const displayIntervention = selectedTab === 'field' && !isSatelliteView;

  const { ploc: requestedPlantLocation, site: requestedSite } = router.query;

  // Zoom to plant location
  useEffect(() => {
    if (!router.isReady || selectedPlantLocation === null) return;
    const { geometry } = selectedPlantLocation;
    const { type, coordinates } = geometry;

    const isPolygonLocation = type === 'Polygon';
    const isPointLocation = type === 'Point';

    if (isPolygonLocation) {
      const polygonCoordinates = coordinates[0];
      zoomToPolygonPlantLocation(
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
  }, [selectedPlantLocation, router.isReady]);

  // Zoom to project site
  useEffect(() => {
    if (
      !router.isReady ||
      selectedPlantLocation !== null ||
      Boolean(requestedPlantLocation)
    )
      return;
    if (hasSitesFeature && selectedSite !== null) {
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
        // Zoom into the project location that has no site and plant location
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
        (!plantLocations || plantLocations.length === 0));

    setIsSatelliteView(isSatelliteView);
  }, [plantLocations, singleProject.purpose]);
  return (
    <>
      {hasSitesFeature ? (
        <>
          <SiteLayers
            isSatelliteView={isSatelliteView}
            geoJson={sitesGeoJson}
          />
          {isSatelliteView && <SatelliteLayer />}
        </>
      ) : (
        <ProjectLocationMarker
          latitude={singleProject.coordinates.lat}
          longitude={singleProject.coordinates.lon}
          purpose={singleProject.purpose}
        />
      )}
      {displayIntervention && <InterventionLayers />}
      <FeatureFlag condition={isFirealertFiresEnabled()}>
        <FireLocationsMarker />
      </FeatureFlag>
    </>
  );
};
export default SingleProjectView;

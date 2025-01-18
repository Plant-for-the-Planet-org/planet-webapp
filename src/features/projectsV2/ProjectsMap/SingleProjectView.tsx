import type { MapRef } from '../../common/types/projectv2';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useProjects } from '../ProjectsContext';
import { useProjectsMap } from '../ProjectsMapContext';
import SatelliteLayer from './microComponents/SatelliteLayer';
import { zoomInToProjectSite } from '../../../utils/mapsV2/zoomToProjectSite';
import SitePolygon from './microComponents/SitePolygon';
import PlantLocations from './microComponents/PlantLocations';
import { zoomToPolygonPlantLocation } from '../../../utils/mapsV2/zoomToPolygonPlantLocation';
import zoomToLocation from '../../../utils/mapsV2/zoomToLocation';
import ProjectLocation from './microComponents/ProjectLocation';
import { MAIN_MAP_ANIMATION_DURATIONS } from '../../../utils/projectV2';

interface Props {
  mapRef: MapRef;
}

const SingleProjectView = ({ mapRef }: Props) => {
  const router = useRouter();
  const { singleProject, selectedSite, selectedPlantLocation, plantLocations } =
    useProjects();
  const { ploc: requestedPlantLocation, site: requestedSite } = router.query;
  if (singleProject === null) return null;
  const { isSatelliteView, handleViewStateChange, setIsSatelliteView } =
    useProjectsMap();

  const sitesGeojson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features:
        singleProject?.sites?.filter((site) => site.geometry !== null) ?? [],
    };
  }, [singleProject?.sites]);
  const hasNoSites = sitesGeojson.features.length === 0;
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
  }, [selectedPlantLocation, router.isReady, requestedPlantLocation]);

  // Zoom to project site
  useEffect(() => {
    if (
      !router.isReady ||
      selectedPlantLocation !== null ||
      Boolean(requestedPlantLocation)
    )
      return;
    if (sitesGeojson.features.length > 0 && selectedSite !== null) {
      zoomInToProjectSite(
        mapRef,
        sitesGeojson,
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
  }, [
    selectedSite,
    sitesGeojson,
    router.isReady,
    selectedPlantLocation,
    requestedPlantLocation,
    requestedSite,
  ]);

  // Enable satellite view for 'conservation' projects or 'trees' projects without plant locations(tree mapper data).
  useEffect(() => {
    const isSatelliteView =
      singleProject.purpose === 'conservation' ||
      (singleProject.purpose === 'trees' && plantLocations?.length === 0);

    setIsSatelliteView(isSatelliteView);
  }, [plantLocations, singleProject.purpose]);
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
            geoJson={sitesGeojson}
          />
          {isSatelliteView && <SatelliteLayer />}
        </>
      )}

      <PlantLocations />
    </>
  );
};
export default SingleProjectView;

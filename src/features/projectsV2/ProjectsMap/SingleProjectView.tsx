import { useEffect, useMemo } from 'react';
import { useProjects } from '../ProjectsContext';
import { useProjectsMap } from '../ProjectsMapContext';
import SatelliteLayer from './microComponents/SatelliteLayer';
import { zoomInToProjectSite } from '../../../utils/mapsV2/zoomToProjectSite';
import SitePolygon from './microComponents/SitePolygon';
import { useRouter } from 'next/router';
import PlantLocations from './microComponents/PlantLocations';
import { MapRef } from '../../../utils/mapsV2/zoomToProjectSite';
import { zoomToPolygonPlantLocation } from '../../../utils/mapsV2/zoomToPolygonPlantLocation';
import zoomToLocation from '../../../utils/mapsV2/zoomToLocation';
import ProjectLocation from './microComponents/ProjectLocation';
import { SetState } from '../../common/types/common';

interface Props {
  setIsOnSampleMarker: SetState<boolean>;
  mapRef: MapRef;
}

const SingleProjectView = ({ mapRef, setIsOnSampleMarker }: Props) => {
  const { singleProject, selectedSite, selectedPlantLocation } = useProjects();
  if (!singleProject?.sites) {
    return null;
  }
  const hasNoSites = singleProject.sites?.length === 0;
  const { isSatelliteView, setViewState } = useProjectsMap();
  const router = useRouter();
  const {
    p: projectSlug,
    ploc: requestedPlantLocation,
    site: requestedSite,
  } = router.query;
  const sitesGeojson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: singleProject?.sites ?? [],
    };
  }, [projectSlug]);
  // Zoom to plant location polygon
  useEffect(() => {
    const isPlantLocationReadyToZoom =
      selectedPlantLocation && router.isReady && requestedPlantLocation;
    if (
      isPlantLocationReadyToZoom &&
      selectedPlantLocation.geometry.type === 'Polygon'
    ) {
      const locationCoordinates = selectedPlantLocation.geometry.coordinates[0];
      zoomToPolygonPlantLocation(
        locationCoordinates,
        mapRef,
        setViewState,
        2500
      );
    }
  }, [selectedPlantLocation, requestedPlantLocation, router.isReady]);
  // Zoom to project site polygon
  useEffect(() => {
    const isSiteReadyToZoom =
      router.isReady && selectedSite !== null && requestedSite;
    if (isSiteReadyToZoom) {
      zoomInToProjectSite(
        mapRef,
        sitesGeojson,
        selectedSite,
        setViewState,
        3000
      );
    }
  }, [selectedSite, requestedSite, router.isReady]);

  useEffect(() => {
    if (
      singleProject &&
      hasNoSites &&
      !selectedPlantLocation &&
      router.isReady
    ) {
      const latitude = singleProject.coordinates.lat;
      const longitude = singleProject.coordinates.lon;
      // Zoom into location for a project  which has no site
      zoomToLocation(setViewState, longitude, latitude, 10, 4000, mapRef);
    } else if (
      selectedPlantLocation?.geometry?.type === 'Point' &&
      selectedPlantLocation?.geometry.coordinates.length === 2
    ) {
      const [lon, lat] = selectedPlantLocation.geometry.coordinates;
      if (lon !== undefined && lat !== undefined) {
        // Zoom into single tree registration
        zoomToLocation(setViewState, lon, lat, 19, 3000, mapRef);
      }
    }
  }, [
    singleProject.sites,
    selectedPlantLocation,
    router.isReady,
    selectedPlantLocation,
  ]);

  return (
    <>
      {hasNoSites ? (
        <ProjectLocation
          latitude={singleProject.coordinates.lat}
          longitude={singleProject.coordinates.lon}
          purpose={singleProject.purpose}
        />
      ) : (
        <SitePolygon isSatelliteView={isSatelliteView} geoJson={sitesGeojson} />
      )}
      {isSatelliteView && <SatelliteLayer />}
      <PlantLocations setIsOnSampleMarker={setIsOnSampleMarker} />
    </>
  );
};
export default SingleProjectView;

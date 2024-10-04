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

const SingleProjectView = ({ mapRef }: { mapRef: MapRef }) => {
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

  useEffect(() => {
    const isSiteReadyToZoom =
      router.isReady && selectedSite !== null && requestedSite;
    if (isSiteReadyToZoom) {
      zoomInToProjectSite(
        mapRef,
        sitesGeojson,
        selectedSite,
        setViewState,
        4000
      );
    }
  }, [selectedSite, requestedSite, router.isReady]);
  // zoom to project location (when project does not have sites)
  useEffect(() => {
    if (singleProject && hasNoSites) {
      zoomToLocation(
        setViewState,
        singleProject.coordinates.lon,
        singleProject.coordinates.lat,
        10,
        4000,
        mapRef
      );
    }
  }, [singleProject.sites]);

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
      <PlantLocations />
    </>
  );
};
export default SingleProjectView;

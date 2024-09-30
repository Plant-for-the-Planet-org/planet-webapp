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

const SingleProjectView = ({ mapRef }: { mapRef: MapRef }) => {
  const { singleProject, selectedSite, selectedPlantLocation } = useProjects();
  if (!singleProject?.sites) {
    return null;
  }
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
      selectedPlantLocation && requestedPlantLocation && router.isReady;
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
      singleProject.sites &&
      !selectedPlantLocation &&
      requestedSite &&
      router.isReady &&
      selectedSite !== null;
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
  return (
    <>
      <SitePolygon isSatelliteView={isSatelliteView} geoJson={sitesGeojson} />
      {isSatelliteView && <SatelliteLayer />}
      <PlantLocations />
    </>
  );
};
export default SingleProjectView;

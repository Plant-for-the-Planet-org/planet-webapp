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
  const { p: projectSlug } = router.query;
  const sitesGeojson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: singleProject?.sites ?? [],
    };
  }, [projectSlug]);
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
        setViewState,
        4000
      );
    } else if (isPointLocation) {
      const [lon, lat] = coordinates;
      if (typeof lon === 'number' && typeof lat === 'number') {
        zoomToLocation(setViewState, lon, lat, 20, 4000, mapRef);
      }
    }
  }, [selectedPlantLocation, router.isReady]);

  // Zoom to project site
  useEffect(() => {
    if (!router.isReady || selectedPlantLocation !== null) return;

    if (selectedSite !== null) {
      zoomInToProjectSite(
        mapRef,
        sitesGeojson,
        selectedSite,
        setViewState,
        4000
      );
    } else {
      const { lat: latitude, lon: longitude } = singleProject.coordinates;

      if (typeof latitude === 'number' && typeof longitude === 'number') {
        // Zoom into the project location that has no site
        zoomToLocation(setViewState, longitude, latitude, 10, 4000, mapRef);
      }
    }
  }, [selectedSite, router.isReady, selectedPlantLocation]);

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

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
import FireLocations from './microComponents/FireLocations';
import FeatureFlag, {
  isFirealertFiresEnabled,
} from './microComponents/FeatureFlag';

interface Props {
  mapRef: MapRef;
}

const SingleProjectView = ({ mapRef }: Props) => {
  const { singleProject, selectedSite, selectedPlantLocation, plantLocations } =
    useProjects();
  if (singleProject === null) return null;

  const { isSatelliteView, handleViewStateChange, setIsSatelliteView } =
    useProjectsMap();
  const router = useRouter();

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
        4000
      );
    } else if (isPointLocation) {
      const [lon, lat] = coordinates;
      if (typeof lon === 'number' && typeof lat === 'number') {
        zoomToLocation(handleViewStateChange, lon, lat, 20, 4000, mapRef);
      }
    }
  }, [selectedPlantLocation, router.isReady]);

  // Zoom to project site
  useEffect(() => {
    if (!router.isReady || selectedPlantLocation !== null) return;
    if (sitesGeojson.features.length > 0 && selectedSite !== null) {
      zoomInToProjectSite(
        mapRef,
        sitesGeojson,
        selectedSite,
        handleViewStateChange,
        4000
      );
    } else {
      const { lat: latitude, lon: longitude } = singleProject.coordinates;

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
  }, [selectedSite, sitesGeojson, router.isReady, selectedPlantLocation]);

  useEffect(() => {
    const hasNoPlantLocations = !plantLocations?.length;
    const isSingleProjectLocation = hasNoPlantLocations && hasNoSites;
    // Satellite view will be:
    // - false if there are no plant locations and no sites (i.e., a single project location only)
    // - true if there are no plant locations but there are multiple sites
    setIsSatelliteView(!isSingleProjectLocation && hasNoPlantLocations);
  }, [plantLocations, hasNoSites]);

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
          {isSatelliteView && plantLocations !== null && <SatelliteLayer />}
        </>
      )}

      <PlantLocations />

      <FeatureFlag
        condition={isFirealertFiresEnabled()}
        // component={FireLocations} // Pass component or children
      >
        <FireLocations />
      </FeatureFlag>
    </>
  );
};
export default SingleProjectView;

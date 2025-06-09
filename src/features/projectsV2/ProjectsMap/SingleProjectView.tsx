import type { MapRef } from '../../common/types/projectv2';
import type { SelectedTab } from './ProjectMapTabs';

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
import FeatureFlag from './microComponents/FeatureFlag';
import { isFirealertFiresEnabled } from '../../../utils/projectV2';
import { useFetchSiteLayers } from '../../../utils/mapsV2/useFetchSiteLayers';
import { useSiteLayerAutoSelection } from '../../../utils/mapsV2/useSiteLayerAutoSelection';

interface Props {
  mapRef: MapRef;
  selectedTab: SelectedTab | null;
}

const SingleProjectView = ({ mapRef, selectedTab }: Props) => {
  const { singleProject, selectedSite, selectedPlantLocation } = useProjects();
  useFetchSiteLayers();
  useSiteLayerAutoSelection();

  if (singleProject === null) return null;

  const { handleViewStateChange } = useProjectsMap();
  const router = useRouter();

  const sitesGeoJson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features:
        singleProject?.sites?.filter((site) => site.geometry !== null) ?? [],
    };
  }, [singleProject?.sites]);
  const hasNoSites = sitesGeoJson.features.length === 0;
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
    if (sitesGeoJson.features.length > 0 && selectedSite !== null) {
      zoomInToProjectSite(
        mapRef,
        sitesGeoJson,
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
  }, [selectedSite, sitesGeoJson, router.isReady, selectedPlantLocation]);

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
            isSatelliteBackground={selectedTab === 'satellite'}
            geoJson={sitesGeoJson}
          />
          {selectedTab === 'satellite' && <SatelliteLayer />}
        </>
      )}
      {selectedTab === 'field' && <PlantLocations />}
      <FeatureFlag condition={isFirealertFiresEnabled()}>
        <FireLocations />
      </FeatureFlag>
    </>
  );
};
export default SingleProjectView;

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

  const { isSatelliteView, handleViewStateChange, setIsSatelliteView } =
    useProjectsMap();
  const router = useRouter();

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
        4000
      );
    } else if (isPointLocation) {
      const [lon, lat] = coordinates;
      if (typeof lon === 'number' && typeof lat === 'number') {
        zoomToLocation(handleViewStateChange, lon, lat, 20, 4000, mapRef);
      }
    }
  }, [selectedIntervention, router.isReady]);

  // Zoom to project site
  useEffect(() => {
    if (!router.isReady || selectedIntervention !== null) return;
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
  }, [selectedSite, sitesGeoJson, router.isReady, selectedIntervention]);

  useEffect(() => {
    const hasNoInterventions = !interventions?.length;
    const isSingleProjectLocation = hasNoInterventions && hasNoSites;
    // Satellite view will be:
    // - false if there are no plant locations and no sites (i.e., a single project location only)
    // - true if there are no plant locations but there are multiple sites
    setIsSatelliteView(!isSingleProjectLocation && hasNoInterventions);
  }, [interventions, hasNoSites]);

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
          {isSatelliteView && interventions !== null && <SatelliteLayer />}
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

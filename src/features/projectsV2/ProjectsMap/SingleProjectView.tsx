import type { SelectedTab } from './ProjectMapTabs';
import type {
  MapLibreRef,
  ProjectSiteFeatureCollection,
} from '../../common/types/map';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SatelliteLayer from './microComponents/SatelliteLayer';
import { zoomInToProjectSite } from '../../../utils/mapsV2/zoomToProjectSite';
import SiteLayers from './microComponents/SiteLayers';
import InterventionLayers from './microComponents/InterventionLayers';
import { zoomToPolygonIntervention } from '../../../utils/mapsV2/zoomToPolygonIntervention';
import zoomToLocation from '../../../utils/mapsV2/zoomToLocation';
import ProjectLocationMarker from './microComponents/ProjectLocationMarker';
import FireLocationsMarker from './microComponents/FireLocationsMarker';
import { MAIN_MAP_ANIMATION_DURATIONS } from '../../../utils/projectV2';
import FeatureFlag from './microComponents/FeatureFlag';
import { isFirealertFiresEnabled } from '../../../utils/projectV2';
import { useProjectMapStore } from '../../../stores/projectMapStore';
import { useInterventionStore, useSingleProjectStore } from '../../../stores';

interface Props {
  mapRef: MapLibreRef;
  selectedTab: SelectedTab | null;
  sitesGeoJson: ProjectSiteFeatureCollection;
}

const SingleProjectView = ({ mapRef, selectedTab, sitesGeoJson }: Props) => {
  const singleProject = useSingleProjectStore((state) => state.singleProject);
  if (singleProject === null) return null;

  const selectedSite = useSingleProjectStore((state) => state.selectedSite);
  const isSatelliteView = useProjectMapStore((state) => state.isSatelliteView);
  const selectedIntervention = useInterventionStore(
    (state) => state.selectedIntervention
  );
  const interventions = useInterventionStore((state) => state.interventions);
  // store: action
  const setIsSatelliteView = useProjectMapStore(
    (state) => state.setIsSatelliteView
  );
  const handleViewStateChange = useProjectMapStore(
    (state) => state.handleViewStateChange
  );
  const router = useRouter();
  const { ploc: requestedIntervention, site: requestedSite } = router.query;
  const hasOnlyRequestedIntervention = Boolean(
    !requestedSite && requestedIntervention
  );

  const canShowSites = sitesGeoJson.features.length > 0;
  const displayIntervention = selectedTab === 'field' && !isSatelliteView;

  // Zoom to plant location
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
      hasOnlyRequestedIntervention
    )
      return;
    if (canShowSites && selectedSite !== null) {
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
        Array.isArray(interventions) &&
        interventions.length === 0);

    setIsSatelliteView(isSatelliteView);
  }, [interventions, singleProject.purpose]);
  return (
    <>
      {canShowSites ? (
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

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
  const { singleProject, selectedSite, selectedPl } = useProjects();
  if (!singleProject?.sites) {
    return null;
  }
  const { isSatelliteView, setViewState } = useProjectsMap();
  const { query, isReady } = useRouter();
  const isPlantLocationReadyToZoom = selectedPl && query.ploc && isReady;
  const isSiteReadyToZoom =
    singleProject.sites && !selectedPl && query.site && isReady;
  const sitesGeojson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: singleProject?.sites ?? [],
    };
  }, [query.p]);

  useEffect(() => {
    if (isPlantLocationReadyToZoom && selectedPl.geometry.type === 'Polygon') {
      const locationCoordinates = selectedPl.geometry.coordinates[0];
      zoomToPolygonPlantLocation(
        locationCoordinates,
        mapRef,
        setViewState,
        2500
      );
    }
  }, [selectedPl, query.ploc, isReady]);

  useEffect(() => {
    if (isSiteReadyToZoom) {
      zoomInToProjectSite(
        mapRef,
        sitesGeojson,
        selectedSite,
        setViewState,
        4000
      );
    }
  }, [selectedSite, query.site]);
  return (
    <>
      <SitePolygon isSatelliteView={isSatelliteView} geoJson={sitesGeojson} />
      {isSatelliteView && <SatelliteLayer />}
      <PlantLocations />
    </>
  );
};
export default SingleProjectView;

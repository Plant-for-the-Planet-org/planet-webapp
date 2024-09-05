import { useEffect, useMemo } from 'react';
import { useProjects } from '../ProjectsContext';
import { useProjectsMap } from '../ProjectsMapContext';
import SatelliteLayer from './microComponents/SatelliteLayer';
import { zoomInToProjectSite } from '../../../utils/mapsV2/zoomToProjectSite';
import SitePolygon from './microComponents/SitePolygon';
import { useRouter } from 'next/router';
import PlantLocations from './microComponents/PlantLocations';
import { MapRef } from '../../../utils/mapsV2/zoomToProjectSite';
import zoomToLocation from '../../../utils/maps/zoomToLocation';
import { zoomToPolygonPlantLocation } from '../../../utils/mapsV2/zoomToPolygonPlantLocation';

const SingleProjectView = ({ mapRef }: { mapRef: MapRef }) => {
  const { singleProject, selectedSite, selectedPl } = useProjects();
  if (!singleProject?.sites) {
    return null;
  }
  const { isSatelliteView, setViewState, viewState } = useProjectsMap();
  console.log(viewState.zoom, '==1');
  const { query } = useRouter();
  const sitesGeojson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: singleProject.sites ?? [],
    };
  }, [query.p]);
  useEffect(() => {
    if (selectedPl && selectedPl.geometry.type === 'Polygon') {
      console.log('i am running');
      const locationCoordinates = selectedPl.geometry.coordinates[0];
      zoomToPolygonPlantLocation(
        locationCoordinates,
        mapRef,
        setViewState,
        1200
      );
    } else {
      // const locationCoordinates = selectedPl?.geometry.coordinates ?? [0, 0];
      // zoomToLocation(
      //   viewState,
      //   setViewState,
      //   locationCoordinates[0],
      //   locationCoordinates[1],
      //   17,
      //   1200
      // );
    }
    if (singleProject.sites && !selectedPl) {
      zoomInToProjectSite(
        mapRef,
        sitesGeojson,
        selectedSite,
        setViewState,
        4000
      );
    }
  }, [query.p, selectedSite, selectedPl]);

  return (
    <>
      <SitePolygon isSatelliteView={isSatelliteView} geoJson={sitesGeojson} />
      {isSatelliteView && <SatelliteLayer />}
      <PlantLocations />
    </>
  );
};
export default SingleProjectView;

import { useEffect, MutableRefObject, useMemo } from 'react';
import { useProjects } from '../ProjectsContext';
import { useProjectsMap } from '../ProjectsMapContext';
import SatelliteLayer from './microComponents/SatelliteLayer';
import SiteLocation from './microComponents/SiteLocation';
import { zoomInToProjectSite } from '../../../utils/mapsV2/zoomToProjectSite';

const SingleProjectView = ({ mapRef }: { mapRef: MutableRefObject<null> }) => {
  const { isSatelliteView, setViewState } = useProjectsMap();
  const { singleProject, selectedSite } = useProjects();
  const sitesGeojson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: singleProject?.sites ?? [],
    };
  }, [singleProject]);
  useEffect(() => {
    if (singleProject?.sites)
      zoomInToProjectSite(
        mapRef,
        sitesGeojson,
        selectedSite,
        setViewState,
        4000
      );
  }, [singleProject?.sites, selectedSite]);
  return (
    <>
      {isSatelliteView && <SatelliteLayer />}
      <SiteLocation
        isSatelliteView={isSatelliteView}
        sitesGeojson={sitesGeojson}
      />
      {/* <PlantLocation /> */}
    </>
  );
};
export default SingleProjectView;

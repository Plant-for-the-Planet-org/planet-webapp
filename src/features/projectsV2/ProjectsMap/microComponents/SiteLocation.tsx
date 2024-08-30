import { zoomInToProjectSite } from '../../../../utils/mapsV2/zoomToProjectSite';
import { useProjects } from '../../ProjectsContext';
import { useEffect, useMemo, MutableRefObject } from 'react';
import { useProjectsMap } from '../../ProjectsMapContext';
import SitePolygon from './SitePolygon';

const SiteLocation = ({ mapRef }: { mapRef: MutableRefObject<null> }) => {
  const { singleProject, selectedSite } = useProjects();
  const { setViewState } = useProjectsMap();
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

  return <SitePolygon geoJson={sitesGeojson} id="sitePolygon" />;
};

export default SiteLocation;

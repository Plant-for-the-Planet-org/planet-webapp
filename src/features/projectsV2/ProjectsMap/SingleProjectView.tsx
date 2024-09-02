import { useEffect, MutableRefObject, useMemo } from 'react';
import { useProjects } from '../ProjectsContext';
import { useProjectsMap } from '../ProjectsMapContext';
import SatelliteLayer from './microComponents/SatelliteLayer';
import { zoomInToProjectSite } from '../../../utils/mapsV2/zoomToProjectSite';
import SitePolygon from './microComponents/SitePolygon';
import { useRouter } from 'next/router';
import LayerIcon from '../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../public/assets/images/icons/LayerDisabled';
import styles from '.././ProjectsMap/ProjectsMap.module.scss';

const SingleProjectView = ({ mapRef }: { mapRef: MutableRefObject<null> }) => {
  const { isSatelliteView, setViewState, setIsSatelliteView } =
    useProjectsMap();
  const { singleProject, selectedSite } = useProjects();
  const { query } = useRouter();
  const sitesGeojson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: singleProject?.sites ?? [],
    };
  }, [singleProject?.sites]);

  useEffect(() => {
    if (singleProject?.sites)
      zoomInToProjectSite(
        mapRef,
        sitesGeojson,
        selectedSite,
        setViewState,
        4000
      );
  }, [query.p, selectedSite]);

  return (
    <>
      <button
        className={styles.layerToggle}
        onClick={() => setIsSatelliteView(!isSatelliteView)}
      >
        {isSatelliteView ? <LayerIcon /> : <LayerDisabled />}
      </button>
      {isSatelliteView && <SatelliteLayer />}
      <SitePolygon isSatelliteView={isSatelliteView} geoJson={sitesGeojson} />
    </>
  );
};
export default SingleProjectView;

import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import ProjectPolygon from './ProjectPolygon';
import SatelliteLayer from './SatelliteLayer';
import VegetationChange from './VegetationChange';

interface Props {

}

export default function Sites({

}: Props): ReactElement {
  const {
    viewport,
    setViewPort,
    geoJson,
    selectedSite,
    isMobile,
    mapState,
    setMapState,
    mapRef,
    selectedMode, rasterData
  } = React.useContext(ProjectPropsContext);

  React.useEffect(() => {
    zoomToProjectSite(
      geoJson,
      selectedSite,
      viewport,
      isMobile,
      setViewPort,
      4000
    );
  }, [selectedSite]);

  return (
    <>
      {selectedMode === 'location' && (
        <>
          <SatelliteLayer />
          <ProjectPolygon id="locationPolygon" geoJson={geoJson} />
        </>
      )}
      {Object.keys(rasterData.imagery).length !== 0 &&
        rasterData.imagery.constructor === Object && (
          <>
            {selectedMode === 'vegetation' && (
              <VegetationChange rasterData={rasterData} />
            )}
          </>
        )}
    </>
  );
}

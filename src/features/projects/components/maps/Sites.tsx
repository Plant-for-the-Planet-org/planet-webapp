import type { ReactElement } from 'react';

import React from 'react';
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import SatelliteLayer from './SatelliteLayer';
import VegetationChange from './VegetationChange';

export default function Sites(): ReactElement {
  const {
    viewport,
    setViewPort,
    geoJson,
    selectedSite,
    selectedMode,
    rasterData,
    satellite,
    selectedPl,
    hoveredPl,
    setSiteViewPort,
    interventionsLoaded,
  } = useProjectProps();

  React.useEffect(() => {
    if (!hoveredPl && !selectedPl) {
      zoomToProjectSite(
        geoJson,
        selectedSite,
        viewport,
        setViewPort,
        setSiteViewPort,
        4000
      );
    }
  }, [selectedSite, selectedMode]);

  return (
    <>
      {selectedMode === 'location' && (
        <>
          {interventionsLoaded && satellite && <SatelliteLayer />}
          {/* <ProjectPolygon id="locationPolygon" geoJson={geoJson} /> */}
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

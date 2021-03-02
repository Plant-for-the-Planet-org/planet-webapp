import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import ProjectPolygon from './ProjectPolygon';
import ProjectTabs from './ProjectTabs';
import SatelliteLayer from './SatelliteLayer';
import SitesDropdown from './SitesDropdown';
// import TimeTravel from './TimeTravel';
import VegetationChange from './VegetationChange';

const TimeTravel = dynamic(() => import('./TimeTravel'), { ssr: false });

interface Props {
  viewport: Object;
  setViewPort: Function;
  geoJson: Object | null;
  selectedSite: number;
  setSelectedSite: Function;
  isMobile: boolean;
  selectedMode: string;
  setSelectedMode: Function;
  rasterData: Object | null;
  mapRef: Object;
  mapState: Object;
  setMapState: Function;
}

export default function Sites({
  viewport,
  setViewPort,
  geoJson,
  selectedSite,
  setSelectedSite,
  isMobile,
  selectedMode,
  setSelectedMode,
  rasterData,
  mapState,
  setMapState,
  mapRef,
}: Props): ReactElement {
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

  const dropDownProps = {
    geoJson,
    selectedSite,
    setSelectedSite,
    isMobile,
  };
  const projectTabs = {
    selectedMode,
    setSelectedMode,
    rasterData,
  };
  const timeTravelProps = {
    rasterData,
    mapRef,
    geoJson,
    isMobile,
    mapState,
    setMapState,
  };

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
            <ProjectTabs {...projectTabs} />
            {selectedMode === 'vegetation' && (
              <VegetationChange rasterData={rasterData} />
            )}
            {selectedMode === 'imagery' && <TimeTravel {...timeTravelProps} />}
          </>
        )}
      <SitesDropdown {...dropDownProps} />
    </>
  );
}

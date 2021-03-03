import React, { ReactElement } from 'react';
import { getRasterData } from '../../../../utils/apiRequests/api';
import zoomToLocation from '../../../../utils/maps/zoomToLocation';
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import Location from './Location';
import Sites from './Sites';

interface Props {
  project: Object;
  defaultMapCenter: Array<number>;
  viewport: Object;
  setViewPort: Function;
  isMobile: Boolean;
  mapRef: Object;
  mapState: Object;
  setMapState: Function;
}

export default function Project({
  project,
  defaultMapCenter,
  viewport,
  setViewPort,
  isMobile,
  mapRef,
  mapState,
  setMapState,
}: Props): ReactElement {
  const [selectedMode, setSelectedMode] = React.useState('location');
  const [geoJson, setGeoJson] = React.useState(null);

  //Sites
  const [siteExists, setsiteExists] = React.useState(false);
  const [selectedSite, setSelectedSite] = React.useState(0);

  //Zoom 3
  const [rasterData, setRasterData] = React.useState({
    evi: '',
    imagery: {},
  });

  React.useEffect(() => {
    if (typeof project.sites !== 'undefined' && project.sites.length > 0) {
      if (project.sites[0].geometry) {
        setsiteExists(true);
        setGeoJson({
          type: 'FeatureCollection',
          features: project.sites,
        });
      } else {
        setsiteExists(false);
        setGeoJson(null);
        zoomToLocation(
          viewport,
          setViewPort,
          project.coordinates.lon,
          project.coordinates.lat,
          5,
          3000
        );
      }
    } else {
      setsiteExists(false);
      setGeoJson(null);
      zoomToLocation(
        viewport,
        setViewPort,
        project.coordinates.lon,
        project.coordinates.lat,
        5,
        3000
      );
    }
  }, []);

  React.useEffect(() => {
    async function loadRasterData() {
      const result = await getRasterData('');
      const result2 = await getRasterData(project.id);
      if (result && result2) {
        setRasterData({
          ...rasterData,
          imagery: result.imagery,
          evi: result2.evi,
        });
      } else if (result) {
        setRasterData({ ...rasterData, imagery: result.imagery });
      }
    }
    if (geoJson) {
      zoomToProjectSite(
        geoJson,
        selectedSite,
        viewport,
        isMobile,
        setViewPort,
        4000
      );
      loadRasterData();
    }
  }, [geoJson]);

  // React.useEffect(() => {
  //   if (selectedMode === 'imagery') {
  //     setMapState({ ...mapState, dragPan: false });
  //   } else {
  //     setMapState({ ...mapState, dragPan: true });
  //   }
  // }, [selectedMode]);

  //Props
  const locationProps = {
    siteExists,
    geoJson,
    project,
  };
  const sitesProps = {
    viewport,
    setViewPort,
    geoJson,
    selectedSite,
    setSelectedSite,
    isMobile,
    selectedMode,
    setSelectedMode,
    rasterData,
    mapRef,
    mapState,
    setMapState,
  };

  return (
    <>
      {siteExists && <Sites {...sitesProps} />}
      <Location {...locationProps} />
    </>
  );
}

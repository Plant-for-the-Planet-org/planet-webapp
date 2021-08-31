import React, { ReactElement } from 'react';
import { getRasterData } from '../../../../utils/apiRequests/api';
import zoomToLocation from '../../../../utils/maps/zoomToLocation';
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import Location from './Location';
import Sites from './Sites';

interface Props {
  project: Object;
  viewport: Object;
  setViewPort: Function;
}

export default function Project({
  project,
  viewport,
  setViewPort,
}: Props): ReactElement {
  const {
    geoJson,
    selectedSite,
    siteExists,
    rasterData,
    setRasterData,
    isMobile,
    setSiteViewPort
  } = React.useContext(ProjectPropsContext);

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
  React.useEffect(() => {
    if (siteExists) {
      loadRasterData();
      zoomToProjectSite(
        {
          type: 'FeatureCollection',
          features: project.sites,
        },
        selectedSite,
        viewport,
        setViewPort,
        setSiteViewPort,
        4000
      );
    } else {
      zoomToLocation(
        viewport,
        setViewPort,
        project.coordinates.lon,
        project.coordinates.lat,
        5,
        3000
      );
    }
  }, [project, siteExists]);

  //Props
  const locationProps = {
    siteExists,
    geoJson,
    project,
  };

  return (
    <>
      {siteExists && <Sites />}
      <Location {...locationProps} />
    </>
  );
}

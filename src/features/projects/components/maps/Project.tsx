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
  isMobile: Boolean;
}

export default function Project({
  project,
  viewport,
  setViewPort,
  isMobile,
}: Props): ReactElement {
  const {
    geoJson,
    selectedSite,
    siteExists,
    rasterData,
    setRasterData,
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
      zoomToProjectSite(
        {
          type: 'FeatureCollection',
          features: project.sites,
        },
        selectedSite,
        viewport,
        isMobile,
        setViewPort,
        4000
      );
      loadRasterData();
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
  }, []);

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

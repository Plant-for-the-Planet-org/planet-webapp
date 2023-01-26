import React, { ReactElement } from 'react';
import { getRasterData } from '../../../../utils/apiRequests/api';
import zoomToLocation from '../../../../utils/maps/zoomToLocation';
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import Location from './Location';
import Sites from './Sites';
import { useRouter } from 'next/router';
import { zoomToPlantLocation } from '../../../../../src/utils/maps/plantLocations';
import { handleError, APIError } from '@planet-sdk/common'

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
    selectedPl,
    plantLocations,
    geoJson,
    selectedSite,
    siteExists,
    rasterData,
    setRasterData,
    isMobile,
    setSiteViewPort,
  } = React.useContext(ProjectPropsContext);

  const { setErrors } = React.useContext(ErrorHandlingContext);
  const router = useRouter();
  const [plantPolygonCoordinates, setPlantPolygonCoordinates] =
    React.useState(null);

  async function loadRasterData() {

    let result;
    let result2;

    try {
      result = await getRasterData('');
    } catch (err) {
      setErrors(handleError(err as APIError))
    }

    try {
      result2 = await getRasterData(project.id);
    } catch (err) {
      setErrors(handleError(err as APIError))
    }

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
    if (plantLocations && selectedPl) {
      setPlantPolygonCoordinates(selectedPl?.geometry.coordinates[0]);
    }
  }, [router, selectedPl, plantLocations]);

  React.useEffect(() => {
    if (selectedPl && plantPolygonCoordinates) {
      router.push(`/${project.slug}?ploc=${selectedPl?.hid}`);
    }
  }, [selectedPl, plantPolygonCoordinates]);

  React.useEffect(() => {
    if (siteExists && !router.query.ploc) {
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
    } else if (
      plantPolygonCoordinates &&
      plantLocations &&
      router.query.ploc &&
      selectedPl
    ) {
      zoomToPlantLocation(
        plantPolygonCoordinates,
        viewport,
        isMobile,
        setViewPort,
        1200
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
  }, [
    project,
    siteExists,
    plantLocations,
    router.query.ploc,
    selectedPl,
    plantPolygonCoordinates,
  ]);

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

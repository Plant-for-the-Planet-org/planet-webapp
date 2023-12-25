import React, { ReactElement } from 'react';
import { getRasterData } from '../../../../utils/apiRequests/api';
import zoomToLocation from '../../../../utils/maps/zoomToLocation';
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import Location from './Location';
import Sites from './Sites';
import { useRouter } from 'next/router';
import { zoomToPlantLocation } from '../../../../../src/utils/maps/plantLocations';
import {
  TreeProjectExtended,
  ConservationProjectExtended,
} from '@planet-sdk/common';
import {
  Imagery,
  RasterData,
  ViewPort,
} from '../../../common/types/ProjectPropsContextInterface';
import { SetState } from '../../../common/types/common';
import { Position } from 'geojson';

interface Props {
  project: TreeProjectExtended | ConservationProjectExtended;
  viewport: ViewPort;
  setViewPort: SetState<ViewPort>;
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
  } = useProjectProps();

  const router = useRouter();
  const [plantPolygonCoordinates, setPlantPolygonCoordinates] = React.useState<
    Position[] | null
  >(null);

  async function loadRasterData() {
    let result;
    let result2;

    try {
      result = await getRasterData<
        | { imagery: Imagery; message: never }
        | { imagery: never; message: string }
      >('');
    } catch (err) {
      // disable-error-handling-for-fetching-layers
      // setErrors(handleError(err as APIError));

      console.error('error fetching layers', err);
    }

    try {
      result2 = await getRasterData<
        RasterData | { message: string; evi: never }
      >(project.id);
    } catch (err) {
      // disable-error-handling-for-fetching-layers
      // setErrors(handleError(err as APIError));
      console.error('error fetching layers', err);
    }

    // If result does not exist or does not contain imagery, the raster data will not be set.
    // This is an error scenario which could happen if GEE does not provide expected data
    if (result && result.imagery) {
      if (result2) {
        // Raster data for multipolygons is not supported and is returned with an error message (but a 200 response) for such projects.
        // In this case rasterData.evi will not exist and is not set as a result
        setRasterData({
          ...rasterData,
          imagery: result.imagery,
          evi: result2.evi || '',
        });
      } else {
        setRasterData({ ...rasterData, imagery: result.imagery });
      }
    }
  }

  React.useEffect(() => {
    if (plantLocations && selectedPl && selectedPl.type === 'multi') {
      setPlantPolygonCoordinates(selectedPl.geometry.coordinates[0]);
    }
    if (selectedPl) router.push(`/${project.slug}?ploc=${selectedPl?.hid}`);
  }, [selectedPl]);

  React.useEffect(() => {
    if (project.sites && siteExists && !router.query.ploc) {
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
    } else if (plantLocations && router.query.ploc && selectedPl) {
      if (selectedPl?.type === 'multi' && plantPolygonCoordinates) {
        zoomToPlantLocation(
          plantPolygonCoordinates,
          viewport,
          isMobile,
          setViewPort,
          1200
        );
      }
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

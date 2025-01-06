import type { ReactElement } from 'react';
import type {
  TreeProjectExtended,
  ConservationProjectExtended,
} from '@planet-sdk/common';
import type {
  Imagery,
  RasterData,
  ViewPort,
} from '../../../common/types/ProjectPropsContextInterface';
import type { SetState } from '../../../common/types/common';
import type { Position } from 'geojson';

import React from 'react';
import { getRasterData } from '../../../../utils/apiRequests/api';
import zoomToLocation from '../../../../utils/maps/zoomToLocation';
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import Location from './Location';
import Sites from './Sites';
import { useRouter } from 'next/router';
import { zoomToPolygonPlantLocation } from '../../../../../src/utils/maps/plantLocations';

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
    hoveredPl,
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
        /* setRasterData({
          ...rasterData,
          imagery: result.imagery,
          evi: result2.evi || '',
        }); */
      } else {
        /* setRasterData({ ...rasterData, imagery: result.imagery }); */
      }
    }
  }

  React.useEffect(() => {
    if (
      plantLocations &&
      selectedPl &&
      selectedPl.type === 'multi-tree-registration' &&
      selectedPl.geometry.type === 'Polygon'
    ) {
      setPlantPolygonCoordinates(selectedPl.geometry.coordinates[0]);
    }
    if (selectedPl)
      router.push(`/projects-archive/${project.slug}?ploc=${selectedPl?.hid}`);
  }, [selectedPl]);

  React.useEffect(() => {
    if (selectedPl) {
      if (selectedPl.geometry.type === 'Polygon') {
        const locationCoordinates = selectedPl.geometry.coordinates[0];
        zoomToPolygonPlantLocation(
          locationCoordinates,
          viewport,
          isMobile,
          setViewPort,
          1200
        );
      } else {
        const locationCoordinates = selectedPl.geometry.coordinates;
        zoomToLocation(
          viewport,
          setViewPort,
          locationCoordinates[0],
          locationCoordinates[1],
          18,
          1200
        );
      }
      return;
    }

    if (project && project.sites && siteExists && !selectedPl) {
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
      loadRasterData();
      return;
    }

    if (!selectedPl || !hoveredPl) {
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

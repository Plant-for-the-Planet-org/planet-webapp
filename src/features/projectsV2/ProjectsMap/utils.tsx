import { MutableRefObject } from 'react';
import { PlantLocation } from '../../common/types/plantLocation';
import {
  ExtendedProject,
  MapProjectProperties,
} from '../../common/types/projectv2';
import { MapRef, PointLike } from 'react-map-gl-v7/maplibre';

export const getProjectCategory = (
  projectProperties: MapProjectProperties | ExtendedProject
) => {
  if (
    projectProperties.purpose === 'trees' &&
    projectProperties.isTopProject &&
    projectProperties.isApproved
  ) {
    return 'topProject';
  } else if (projectProperties.allowDonations) {
    return 'regularProject';
  } else {
    return 'nonDonatableProject';
  }
};

export const getPlantLocationInfo = (
  plantLocations: PlantLocation[] | null,
  mapRef: MutableRefObject<MapRef | null>,
  point: PointLike
) => {
  if (!mapRef.current) {
    return;
  }
  const map = mapRef.current.getMap();
  const features = map.queryRenderedFeatures(point, {
    layers: ['plant-polygon-layer', 'point-layer'],
  });
  if (features && features.length > 0) {
    map.getCanvas().style.cursor = 'pointer';
    const activePlantLocation = plantLocations?.find(
      (pl) => pl.id === features[0].properties.id
    );
    return activePlantLocation;
  } else {
    map.getCanvas().style.cursor = '';
  }
};

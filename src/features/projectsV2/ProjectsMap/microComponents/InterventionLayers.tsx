import type {
  PlantLocation,
  PlantLocationMulti,
  PlantLocationSingle,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import type { Feature, Point, Polygon } from 'geojson';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Layer, Source, Marker } from 'react-map-gl-v7/maplibre';
import * as turf from '@turf/turf';
import styles from '../ProjectsMap.module.scss';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { useProjects } from '../../ProjectsContext';
import { useProjectsMap } from '../../ProjectsMapContext';
import { FillColor } from '../../../../utils/constants/intervention';

interface SampleTreeMarkerProps {
  sample: SamplePlantLocation;
  selectedSamplePlantLocation: SamplePlantLocation | null;
  openPl: (
    e: React.MouseEvent<HTMLDivElement>,
    pl: SamplePlantLocation
  ) => void;
}

const SampleTreeMarker = ({
  sample,
  selectedSamplePlantLocation,
  openPl,
}: SampleTreeMarkerProps) => (
  <Marker
    key={`${sample.id}-sample`}
    latitude={sample.geometry.coordinates[1]}
    longitude={sample.geometry.coordinates[0]}
    anchor="center"
  >
    <div
      key={`${sample.id}-marker`}
      className={`${styles.single} ${
        sample.hid === selectedSamplePlantLocation?.hid
          ? styles.singleSelected
          : ''
      }`}
      role="button"
      tabIndex={0}
      onClick={(e) => openPl(e, sample)}
    />
  </Marker>
);

export default function InterventionLayers(): React.ReactElement {
  const {
    plantLocations,
    hoveredPlantLocation,
    selectedPlantLocation,
    setSelectedPlantLocation,
    setSelectedSamplePlantLocation,
    selectedSamplePlantLocation,
    selectedInterventionType,
  } = useProjects();
  const { isSatelliteView, viewState } = useProjectsMap();

  const t = useTranslations('Maps');
  const locale = useLocale();

  const openPl = (
    e: React.MouseEvent<HTMLDivElement>,
    pl: PlantLocationSingle | SamplePlantLocation
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (selectedSamplePlantLocation?.hid === pl.hid) {
      setSelectedSamplePlantLocation(null);
    } else {
      switch (pl.type) {
        case 'sample-tree-registration':
          setSelectedSamplePlantLocation(pl);
          break;
        case 'single-tree-registration':
          setSelectedPlantLocation(pl);
          break;
        default:
          break;
      }
    }
  };

  const getPlTreeCount = (pl: PlantLocationMulti) => {
    let count = 0;
    if (pl && pl.plantedSpecies) {
      for (const key in pl.plantedSpecies) {
        if (Object.prototype.hasOwnProperty.call(pl.plantedSpecies, key)) {
          const element = pl.plantedSpecies[key];
          count += element.treeCount;
        }
      }
      return count;
    } else {
      return 0;
    }
  };
  const getPlArea = (pl: PlantLocationMulti) => {
    if (pl && pl.type === 'multi-tree-registration') {
      const area = turf.area(pl.geometry);
      return area / 10000;
    } else {
      return 0;
    }
  };

  const getPolygonColor = (pl: PlantLocationMulti) => {
    const treeCount = getPlTreeCount(pl);
    const plantationArea = getPlArea(pl);
    const density = treeCount / plantationArea;
    if (density > 2500) {
      return 0.5;
    } else if (density > 2000) {
      return 0.4;
    } else if (density > 1600) {
      return 0.3;
    } else if (density > 1000) {
      return 0.2;
    } else {
      return 0.1;
    }
  };

  const getDateDiff = (pl: PlantLocation) => {
    if (!pl.interventionStartDate) {
      return null;
    }
    const today = new Date();
    const plantationDate = new Date(pl.interventionStartDate?.slice(0, 10));
    const differenceInTime = today.getTime() - plantationDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDays < 1) {
      return t('today');
    } else if (differenceInDays < 2) {
      return t('yesterday');
    } else if (differenceInDays <= 10) {
      return t('daysAgo', {
        days: localizedAbbreviatedNumber(locale, differenceInDays, 0),
      });
    } else {
      return null;
    }
  };

  const makeInterventionGeoJson = (
    geometry: Point | Polygon,
    id: string,
    extra?: Record<string, string | number | boolean | null>
  ): Feature<Point | Polygon> => {
    const properties = {
      id,
      ...extra,
    };

    return {
      type: 'Feature',
      properties,
      geometry,
    };
  };
  if (!plantLocations || plantLocations.length === 0) {
    return <></>;
  }
  const features = plantLocations
    .filter(
      (d) =>
        selectedInterventionType === 'all' ||
        (selectedInterventionType !== 'default' &&
          d.type === selectedInterventionType) ||
        (selectedInterventionType === 'default' &&
          (d.type === 'multi-tree-registration' ||
            d.type === 'single-tree-registration'))
    )
    .map((el) => {
      const isSelected =
        selectedPlantLocation && selectedPlantLocation.id === el.id;
      const isHovered =
        hoveredPlantLocation && hoveredPlantLocation.id === el.id;
      const GeoJSON = makeInterventionGeoJson(el.geometry, el.id, {
        highlightLine: isSelected || isHovered,
        opacity:
          el.type === 'multi-tree-registration' ? getPolygonColor(el) : 0.5,
        dateDiff: getDateDiff(el),
        type: el.type,
      });
      return GeoJSON;
    });

  const isValidInterventionType = [
    'multi-tree-registration',
    'enrichment-planting',
    'all',
    'default',
  ].includes(selectedInterventionType);

  const shouldRenderMarkers =
    selectedPlantLocation &&
    selectedPlantLocation.type !== 'single-tree-registration' &&
    isValidInterventionType &&
    viewState.zoom > 14 &&
    selectedPlantLocation.sampleInterventions;

  return (
    <>
      <Source
        id={'display-source'}
        type="geojson"
        data={{
          type: 'FeatureCollection',
          features: [...features],
        }}
      >
        <Layer
          id={`plant-polygon-layer`}
          type="fill"
          paint={{
            'fill-color': FillColor,
            'fill-opacity': ['get', 'opacity'],
          }}
          filter={['==', ['geometry-type'], 'Polygon']}
        />
        <Layer
          id={`point-layer`}
          type="circle"
          paint={{
            'circle-color': FillColor,
            'circle-opacity': [
              'case',
              [
                '==',
                ['get', 'id'],
                (selectedPlantLocation?.id || hoveredPlantLocation?.id) ?? 0,
              ],
              1,
              0.5,
            ],
          }}
          filter={['==', ['geometry-type'], 'Point']}
        />
        <Layer
          id={`line-selected`}
          type="line"
          paint={{
            'line-color': isSatelliteView ? '#ffffff' : FillColor,
            'line-width': 4,
          }}
          filter={['==', ['get', 'highlightLine'], true]}
        />
        <Layer
          id={`datediff-label`}
          type="symbol"
          layout={{
            'text-field': ['get', 'dateDiff'],
            'text-anchor': 'center',
            'text-font': ['Ubuntu Regular'],
          }}
          paint={{
            'text-color': isSatelliteView ? '#ffffff' : '#2f3336',
          }}
          filter={['!=', ['get', 'dateDiff'], '']}
        />
        {shouldRenderMarkers
          ? selectedPlantLocation.sampleInterventions.map((sample) => (
              <SampleTreeMarker
                key={sample.id}
                sample={sample}
                selectedSamplePlantLocation={selectedSamplePlantLocation}
                openPl={openPl}
              />
            ))
          : null}
      </Source>
    </>
  );
}

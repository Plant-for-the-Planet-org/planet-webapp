import React, { ReactElement } from 'react';
import { Layer, Marker } from 'react-map-gl';
import { Source } from 'react-map-gl';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import styles from '../../styles/PlantLocation.module.scss';
import * as turf from '@turf/turf';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { useLocale, useTranslations } from 'next-intl';
import {
  PlantLocation,
  PlantLocationMulti,
  PlantLocationSingle,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';
import { Feature, Point, Polygon } from 'geojson';

export default function PlantLocations(): ReactElement {
  const {
    plantLocations,
    hoveredPl,
    selectedPl,
    setSelectedPl,
    setHoveredPl,
    viewport,
    satellite,
    setSamplePlantLocation,
    samplePlantLocation,
  } = useProjectProps();

  const t = useTranslations('Maps');
  const locale = useLocale();

  const openPl = (pl: PlantLocationSingle | SamplePlantLocation) => {
    switch (pl.type) {
      case 'sample-tree-registration':
        setSamplePlantLocation(pl);
        break;
      case 'single-tree-registration':
        setSelectedPl(pl);
        break;
      default:
        break;
    }
  };

  const onHover = (pl: PlantLocationSingle | SamplePlantLocation) => {
    setHoveredPl(pl);
  };

  const onHoverEnd = () => {
    if (
      hoveredPl &&
      (hoveredPl.type === 'single-tree-registration' ||
        hoveredPl.type === 'sample-tree-registration')
    )
      setHoveredPl(null);
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
    const today = new Date();
    const plantationDate = new Date(pl.plantDate?.substr(0, 10));
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

  if (!plantLocations) {
    return <></>;
  }

  const features = plantLocations.map((el) => {
    const isSelected = selectedPl && selectedPl.id === el.id;
    const isHovered = hoveredPl && hoveredPl.id === el.id;
    const GeoJSON = makeInterventionGeoJson(el.geometry, el.id, {
      highlightLine: isSelected || isHovered,
      opacity:
        el.type === 'multi-tree-registration' ? getPolygonColor(el) : 0.5,
      dateDiff: getDateDiff(el),
    });
    return GeoJSON;
  });

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
          id={`polygon-layer`}
          type="fill"
          paint={{
            'fill-color': satellite ? '#ffffff' : '#007A49',
            'fill-opacity': ['get', 'opacity'],
          }}
          filter={['==', ['geometry-type'], 'Polygon']}
        />
        <Layer
          id={`point-layer`}
          type="circle"
          paint={{
            'circle-color': satellite ? '#ffffff' : '#007A49',
            'circle-opacity': 0.5,
          }}
          filter={['==', ['geometry-type'], 'Point']}
        />
        <Layer
          id={`line-selected`}
          type="line"
          paint={{
            'line-color': satellite ? '#ffffff' : '#007A49',
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
            'text-color': satellite ? '#ffffff' : '#2f3336',
          }}
          filter={['!=', ['get', 'dateDiff'], null]}
        />
        {selectedPl &&
        selectedPl.type === 'multi-tree-registration' &&
        selectedPl.sampleInterventions
          ? selectedPl.sampleInterventions.map((spl) => {
              return (
                <Marker
                  key={`${spl.id}-sample`}
                  latitude={spl.geometry.coordinates[1]}
                  longitude={spl.geometry.coordinates[0]}
                >
                  {viewport.zoom > 14 && (
                    <div
                      key={`${spl.id}-marker`}
                      className={`${styles.single} ${
                        spl.hid === samplePlantLocation?.hid
                          ? styles.singleSelected
                          : ''
                      }`}
                      role="button"
                      tabIndex={0}
                      onClick={() => openPl(spl)}
                      onMouseEnter={() => onHover(spl)}
                      onMouseLeave={onHoverEnd}
                    />
                  )}
                </Marker>
              );
            })
          : null}
      </Source>
    </>
  );
}

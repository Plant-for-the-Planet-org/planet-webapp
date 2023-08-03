import React, { ReactElement } from 'react';
import { Layer, Marker } from 'react-map-gl';
import { Source } from 'react-map-gl';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import styles from '../../styles/PlantLocation.module.scss';
import * as turf from '@turf/turf';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { useTranslation } from 'next-i18next';
import { Feature, Point, Polygon } from 'geojson';
import {
  PlantLocation,
  PlantLocationMulti,
  PlantLocationSingle,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';

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

  const { i18n, t } = useTranslation(['maps', 'common']);

  const openPl = (pl: PlantLocationSingle | SamplePlantLocation) => {
    switch (pl.type) {
      case 'sample':
        setSamplePlantLocation(pl);
        break;
      case 'single':
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
      (hoveredPl.type === 'single' || hoveredPl.type === 'sample')
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
    if (pl && pl.type === 'multi') {
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
        days: localizedAbbreviatedNumber(i18n.language, differenceInDays, 0),
      });
    } else {
      return null;
    }
  };

  return (
    <>
      {plantLocations &&
        plantLocations
          .filter((item) => {
            if (item.captureStatus === 'complete') {
              return true;
            } else {
              return false;
            }
          })
          .map((pl) => {
            if (pl.type === 'multi') {
              const dateDiff = getDateDiff(pl);
              const data: Feature<Point | Polygon> = {
                type: 'Feature',
                geometry: { ...pl.geometry },
                properties: { id: pl.id },
              };
              return (
                <React.Fragment key={pl.id}>
                  <Source
                    key={`${pl.id}-source`}
                    id={pl.id}
                    type="geojson"
                    data={data}
                  >
                    <Layer
                      key={`${pl.id}-layer`}
                      id={`${pl.id}-layer`}
                      type="fill"
                      source={pl.id}
                      paint={{
                        'fill-color': satellite ? '#ffffff' : '#007A49',
                        'fill-opacity': getPolygonColor(pl),
                      }}
                    />
                    {((selectedPl && selectedPl.id === pl.id) ||
                      (hoveredPl && hoveredPl.id === pl.id)) && (
                      <Layer
                        key={`${pl.id}-selected`}
                        id={`${pl.id}-selected-layer`}
                        type="line"
                        source={pl.id}
                        paint={{
                          'line-color': satellite ? '#ffffff' : '#007A49',
                          'line-width': 4,
                        }}
                      />
                    )}
                    {dateDiff && (
                      <Layer
                        key={`${pl.id}-label`}
                        id={`${pl.id}-label`}
                        type="symbol"
                        source={pl.id}
                        layout={{
                          'text-field': dateDiff,
                          'text-anchor': 'center',
                          'text-font': ['Ubuntu Regular'],
                        }}
                        paint={{
                          'text-color': satellite ? '#ffffff' : '#2f3336',
                        }}
                      />
                    )}
                  </Source>
                  {pl &&
                    pl.id === selectedPl?.id &&
                    pl.samplePlantLocations &&
                    pl.samplePlantLocations
                      .filter((item) => {
                        if (item.captureStatus === 'complete') {
                          return true;
                        } else {
                          return false;
                        }
                      })
                      .map((spl) => {
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
                      })}
                </React.Fragment>
              );
            } else {
              return (
                <Marker
                  key={`${pl.id}-single`}
                  latitude={pl.geometry.coordinates[1]}
                  longitude={pl.geometry.coordinates[0]}
                  // offsetLeft={5}
                  // offsetTop={-16}
                  // style={{ left: '28px' }}
                >
                  {viewport.zoom > 14 && (
                    <div
                      key={`${pl.id}-marker`}
                      onClick={() => openPl(pl)}
                      onMouseEnter={() => onHover(pl)}
                      onMouseLeave={onHoverEnd}
                      className={`${styles.single} ${
                        pl.id === selectedPl?.id ? styles.singleSelected : ''
                      }`}
                      role="button"
                      tabIndex={0}
                    />
                  )}
                </Marker>
              );
            }
          })}
    </>
  );
}

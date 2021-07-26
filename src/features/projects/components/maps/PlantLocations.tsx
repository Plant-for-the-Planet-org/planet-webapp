import React, { ReactElement } from 'react';
import { Layer, Marker } from 'react-map-gl';
import { Source } from 'react-map-gl';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import { useRouter } from 'next/router';
import styles from '../../styles/PlantLocation.module.scss';
import * as turf from '@turf/turf';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

interface Props {}

export default function PlantLocations({}: Props): ReactElement {
  const router = useRouter();
  const {
    plantLocations,
    hoveredPl,
    selectedPl,
    setSelectedPl,
    setHoveredPl,
    viewport,
    lineWidth,
    setLineWidth,
    lineBlur,
    setLineBlur,
    lineOpacity,
    setLineOpacity,
  } = React.useContext(ProjectPropsContext);

  const { i18n } = useTranslation(['common']);

  const openPl = (pl: any) => {
    setSelectedPl(pl);
  };

  const onHover = (pl: Object) => {
    setHoveredPl(pl);
  };

  const onHoverEnd = (pl: Object) => {
    if (
      hoveredPl &&
      (hoveredPl.type === 'single' || hoveredPl.type === 'sample')
    )
      setHoveredPl(null);
  };

  const getPlTreeCount = (pl: any) => {
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

  const getPlArea = (pl: any) => {
    if (pl && pl.type === 'multi') {
      const area = turf.area(pl.geometry);
      return area / 10000;
    } else {
      return 0;
    }
  };

  const getPolygonColor = (pl: any) => {
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

  const getDateDiff = (pl: any) => {
    const today = new Date();
    const plantationDate = new Date(pl.plantDate);
    const differenceInTime = today.getTime() - plantationDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDays < 1) {
      return 'Today';
    } else if (differenceInDays < 2) {
      return 'Yesterday';
    } else if (differenceInDays < 30) {
      return `${localizedAbbreviatedNumber(
        i18n.language,
        differenceInDays,
        0
      )}d`;
    } else {
      return null;
    }
  };

  return (
    <>
      {plantLocations &&
        plantLocations
          .filter((item: any) => {
            if (item.captureStatus === 'complete') {
              return true;
            } else {
              return false;
            }
          })
          .map((pl: any) => {
            const newPl = pl.geometry;
            newPl.properties = {};
            newPl.properties.id = pl.id;
            if (pl.type === 'multi') {
              const dateDiff = getDateDiff(pl);
              return (
                <>
                  <Source
                    key={`${pl.id}-source`}
                    id={pl.id}
                    type="geojson"
                    data={newPl}
                  >
                    <Layer
                      key={`${pl.id}-layer`}
                      id={`${pl.id}-layer`}
                      type="fill"
                      source={pl.id}
                      paint={{
                        'fill-color': '#007A49',
                        'fill-opacity': getPolygonColor(pl),
                      }}
                    />
                    {selectedPl?.id !== pl.id && hoveredPl?.id !== pl.id && (
                      <Layer
                        key={`${pl.id}-blur`}
                        id={`${pl.id}-blur`}
                        type="line"
                        source={pl.id}
                        paint={{
                          'line-color': '#007A49',
                          'line-width': lineWidth,
                          'line-blur': lineBlur,
                          'line-opacity': lineOpacity,
                        }}
                        layout={{
                          'line-join': 'round',
                        }}
                      />
                    )}
                    {((selectedPl && selectedPl.id === pl.id) ||
                      (hoveredPl && hoveredPl.id === pl.id)) && (
                      <Layer
                        key={`${pl.id}-selected`}
                        id={`${pl.id}-selected-layer`}
                        type="line"
                        source={pl.id}
                        paint={{
                          'line-color': '#007A49',
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
                          'text-color': '#2f3336',
                        }}
                      />
                    )}
                  </Source>
                  {pl &&
                    pl.samplePlantLocations &&
                    pl.samplePlantLocations
                      .filter((item: any) => {
                        if (item.captureStatus === 'complete') {
                          return true;
                        } else {
                          return false;
                        }
                      })
                      .map((spl: any) => {
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
                                  spl.id === selectedPl?.id
                                    ? styles.singleSelected
                                    : ''
                                }`}
                                role="button"
                                tabIndex={0}
                                onClick={() => openPl(spl)}
                                onMouseEnter={() => onHover(spl)}
                                onMouseLeave={() => onHoverEnd(spl)}
                              />
                            )}
                          </Marker>
                        );
                      })}
                </>
              );
            } else {
              return (
                <Marker
                  key={`${pl.id}-single`}
                  latitude={newPl.coordinates[1]}
                  longitude={newPl.coordinates[0]}
                  // offsetLeft={5}
                  // offsetTop={-16}
                  // style={{ left: '28px' }}
                >
                  {viewport.zoom > 14 && (
                    <div
                      key={`${pl.id}-marker`}
                      onClick={() => openPl(pl)}
                      onMouseEnter={() => onHover(pl)}
                      onMouseLeave={() => onHoverEnd(pl)}
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

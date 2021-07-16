import React, { ReactElement } from 'react';
import { Layer, Marker } from 'react-map-gl';
import { Source } from 'react-map-gl';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import { useRouter } from 'next/router';
import { zoomToPlantLocation } from '../../../../utils/maps/plantLocations';
import styles from '../../styles/PlantLocation.module.scss';
import * as turf from '@turf/turf';

interface Props {}

export default function PlantLocations({}: Props): ReactElement {
  const router = useRouter();
  const {
    project,
    plantLocations,
    mapRef,
    hoveredPl,
    zoomLevel,
    selectedLocation,
    setSelectedLocation,
    setHoveredPl,
    viewport,
  } = React.useContext(ProjectPropsContext);

  const openPl = (pl: any) => {
    setSelectedLocation(pl);
    // router.replace(`/${project.slug}/${pl.id}`);
  };

  const onHover = (pl: Object) => {
    setHoveredPl(pl);
  };

  const onHoverEnd = (pl: Object) => {
    if (hoveredPl && hoveredPl.type === 'single') setHoveredPl(null);
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

  return (
    <>
      {plantLocations &&
        plantLocations.map((pl: any) => {
          const newPl = pl.geometry;
          newPl.properties = {};
          newPl.properties.id = pl.id;
          if (pl.type === 'multi') {
            return (
              <>
                <Source key={pl.id} id={pl.id} type="geojson" data={newPl}>
                  <Layer
                    key={pl.id}
                    id={`${pl.id}-layer`}
                    type="fill"
                    source={pl.id}
                    paint={{
                      'fill-color': '#007A49',
                      'fill-opacity': getPolygonColor(pl),
                    }}
                  />
                </Source>
                {pl &&
                  pl.samplePlantLocations &&
                  pl.samplePlantLocations.map((spl: any) => {
                    return (
                      <Marker
                        key={spl.id}
                        latitude={spl.geometry.coordinates[1]}
                        longitude={spl.geometry.coordinates[0]}
                      >
                        {viewport.zoom > 18 && (
                          <div
                            className={styles.single}
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
                key={pl.id}
                latitude={newPl.coordinates[1]}
                longitude={newPl.coordinates[0]}
                // offsetLeft={5}
                // offsetTop={-16}
                // style={{ left: '28px' }}
              >
                {viewport.zoom > 18 && (
                  <div
                    onClick={() => openPl(pl)}
                    onMouseEnter={() => onHover(pl)}
                    onMouseLeave={() => onHoverEnd(pl)}
                    className={styles.single}
                    role="button"
                    tabIndex={0}
                  />
                )}
              </Marker>
            );
          }
        })}
      {selectedLocation && selectedLocation.type === 'multi' && (
        <Source
          id={`selected-source`}
          type="geojson"
          data={selectedLocation.geometry}
        >
          <Layer
            id={`selected-layer`}
            type="line"
            source={`${selectedLocation.id}-selected`}
            paint={{
              'line-color': '#007A49',
              'line-width': 4,
            }}
          />
        </Source>
      )}
    </>
  );
}

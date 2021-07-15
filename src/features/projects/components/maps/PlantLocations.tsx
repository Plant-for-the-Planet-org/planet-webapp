import React, { ReactElement } from 'react';
import { Layer, Marker } from 'react-map-gl';
import { Source } from 'react-map-gl';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import { useRouter } from 'next/router';
import { zoomToPlantLocation } from '../../../../utils/maps/plantLocations';
import styles from '../../styles/PlantLocation.module.scss';

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
                      'fill-opacity': 0.3,
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
                        <div
                          className={styles.single}
                          role="button"
                          tabIndex={0}
                        />
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
                <div
                  onClick={() => openPl(pl)}
                  onMouseEnter={() => onHover(pl)}
                  onMouseLeave={() => onHoverEnd(pl)}
                  className={styles.single}
                  role="button"
                  tabIndex={0}
                />
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

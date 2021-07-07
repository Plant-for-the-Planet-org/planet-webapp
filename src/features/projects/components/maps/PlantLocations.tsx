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
  const { project, plantLocations, mapRef, hoveredPl } = React.useContext(
    ProjectPropsContext
  );

  return (
    <>
      {plantLocations &&
        plantLocations.map((pl: any) => {
          const newPl = pl.geometry;
          newPl.properties = {};
          newPl.properties.id = pl.id;
          if (pl.type === 'multi') {
            return (
              <Source key={pl.id} id={pl.id} type="geojson" data={newPl}>
                {/* <Layer
                id={`${pl.id}-layer`}
                type="line"
                source={pl.id}
                paint={{
                  'line-color': '#007A49',
                  'line-width': 4,
                }}
              /> */}
                <Layer
                  key={pl.id}
                  id={`${pl.id}-layer`}
                  type="fill"
                  source={pl.id}
                  paint={{
                    'fill-color': '#007A49',
                    'fill-opacity': hoveredPl ? 1 : 0.5,
                  }}
                />
              </Source>
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
                <div className={styles.single} role="button" tabIndex={0} />
              </Marker>
            );
          }
        })}
    </>
  );
}

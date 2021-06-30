import React, { ReactElement } from 'react';
import { Layer } from 'react-map-gl';
import { Source } from 'react-map-gl';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import { useRouter } from 'next/router';
import { zoomToPlantLocation } from '../../../../utils/maps/plantLocations';

interface Props {}

export default function PlantLocations({}: Props): ReactElement {
  const router = useRouter();
  const { project, plantLocations, mapRef } = React.useContext(
    ProjectPropsContext
  );
  React.useEffect(() => {
    console.log('in useeffect');
    for (const key in plantLocations) {
      if (Object.prototype.hasOwnProperty.call(plantLocations, key)) {
        const pl = plantLocations[key];
        console.log('adding event listeners', mapRef.current.getMap());
        mapRef.current
          .getMap()
          .on('click', `${pl.id}-layer-bg`, function (e: any) {
            console.log('clicked');
            router.replace(`/${project.slug}/${pl.id}`);
          });
        mapRef.current
          .getMap()
          .on('mouseenter', `${pl.id}-layer-bg`, function () {
            mapRef.current.getMap().getCanvas().style.cursor = 'pointer';
          });

        // Change it back to a pointer when it leaves.
        mapRef.current
          .getMap()
          .on('mouseleave', `${pl.id}-layer-bg`, function () {
            mapRef.current.getMap().getCanvas().style.cursor = '';
          });
      }
    }
  }, [mapRef, plantLocations]);

  React.useEffect(() => {
    const map = mapRef.current.getMap();
    map.on('load', function () {
      map.on('click', `loc_PIFl4Z4zeOvtvWrW5LsPDC3F-layer-bg`, function (
        e: any
      ) {
        console.log('clicked');
        // router.replace(`/${project.slug}/loc_PIFl4Z4zeOvtvWrW5LsPDC3F`);
      });
    });
  }, []);

  return (
    <>
      {plantLocations &&
        plantLocations.map((pl: any) => {
          let newPl = pl.geometry;
          newPl.properties = {};
          newPl.properties.id = pl.id;
          return (
            <div>
              <Source id={pl.id} type="geojson" data={newPl}>
                <Layer
                  id={`${pl.id}-layer`}
                  type="line"
                  source={pl.id}
                  paint={{
                    'line-color': '#007A49',
                    'line-width': 4,
                  }}
                />
                <Layer
                  id={`${pl.id}-layer-bg`}
                  type="fill"
                  source={pl.id}
                  paint={{
                    'fill-color': '#007A49',
                    'fill-opacity': 0.3,
                  }}
                />
              </Source>
            </div>
          );
        })}
    </>
  );
}

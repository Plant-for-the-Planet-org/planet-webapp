import React from 'react';
import { Marker } from 'react-map-gl';
import styles from '../../styles/ProjectsMap.module.scss';
import ProjectPolygon from './ProjectPolygon';

interface Props {
  siteExists: boolean;
  geoJson: Object | null;
  project: Object;
}

export default function Location({ siteExists, geoJson, project }: Props) {
  return (
    <>
      {!siteExists && project ? (
        <Marker
          latitude={project.coordinates.lat}
          longitude={project.coordinates.lon}
          offsetLeft={5}
          offsetTop={-16}
        >
          <div
            style={{ left: '28px' }}
            className={`${styles.marker} ${
              project.purpose === 'conservation'
                ? styles.conservationMarker
                : ''
            }`}
          />
        </Marker>
      ) : (
        <ProjectPolygon id="locationPolygon" geoJson={geoJson} />
      )}
    </>
  );
}

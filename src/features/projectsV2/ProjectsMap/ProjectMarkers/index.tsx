import { Marker } from 'react-map-gl-v7/maplibre';
import { MapProject } from '../../../common/types/projectv2';
import styles from './ProjectMarkers.module.scss';
import router from 'next/router';
import { useLocale } from 'next-intl';
import { useContext } from 'react';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import ProjectMarkerIcon from './ProjectMarkerIcon';

interface ProjectMarkersProps {
  projects: MapProject[];
}

const ProjectMarkers = ({ projects }: ProjectMarkersProps) => {
  const locale = useLocale();
  const { embed, callbackUrl } = useContext(ParamsContext);

  const visitProject = (projectSlug: string): void => {
    router.push(
      `/${locale}/${projectSlug}/${
        embed === 'true'
          ? `${
              callbackUrl != undefined
                ? `?embed=true&callback=${callbackUrl}`
                : '?embed=true'
            }`
          : ''
      }`
    );
  };

  return (
    <>
      {projects.map((project) => (
        <Marker
          key={project.properties.id}
          latitude={project.geometry.coordinates[1]}
          longitude={project.geometry.coordinates[0]}
          anchor="bottom"
          offset={[0, 0]}
        >
          <div className={styles.markerContainer}>
            <div
              className={styles.marker}
              onClick={() => visitProject(project.properties.slug)}
              onKeyDown={() => visitProject(project.properties.slug)}
              role="button"
              tabIndex={0}
              onFocus={() => {}} //Do we want to allow keyboard navigation for the map? In that case, perhaps we should make it obvious that the marker is focused
            >
              <ProjectMarkerIcon projectProperties={project.properties} />
            </div>
          </div>
        </Marker>
      ))}
    </>
  );
};
export default ProjectMarkers;

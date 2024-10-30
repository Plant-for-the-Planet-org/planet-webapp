import { Marker } from 'react-map-gl-v7';
import ProjectMarkerIcon from './ProjectMarkerIcon';
import { type MapProject } from '../../../common/types/projectv2';
import styles from './ProjectMarkers.module.scss';

type Props = {
  project: MapProject;
  onMouseOver: () => void;
  onMouseLeave: () => void;
  visitProject: (projectSlug: string) => void;
};

const SingleMarker = ({
  project,
  onMouseOver,
  onMouseLeave,
  visitProject,
}: Props) => {
  return (
    <>
      <Marker
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
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
          >
            <ProjectMarkerIcon projectProperties={project.properties} />
          </div>
        </div>
      </Marker>
    </>
  );
};

export default SingleMarker;

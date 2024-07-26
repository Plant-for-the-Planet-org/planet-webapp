import { Popup } from 'react-map-gl-v7/maplibre';
import { MapProject } from '../../../common/types/projectv2';
import styles from './ProjectPopup.module.scss';

type Props = {
  project: MapProject;
  handlePopupLeave: () => void;
  visitProject: (projectSlug: string) => void;
};

const ProjectPopup = ({ project, handlePopupLeave, visitProject }: Props) => {
  const { coordinates } = project.geometry;

  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      closeButton={false}
      className={styles.projectPopup}
    >
      <div
        onMouseLeave={handlePopupLeave}
        onClick={() => visitProject(project.properties.slug)}
        onKeyDown={() => visitProject(project.properties.slug)}
      >
        {/* Dummy content to be replaced with actual ProjectSnippet once ready */}
        <h3>{project.properties.name}</h3>
      </div>
    </Popup>
  );
};

export default ProjectPopup;

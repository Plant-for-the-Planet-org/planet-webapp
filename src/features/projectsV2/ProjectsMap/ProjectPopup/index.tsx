import { Popup } from 'react-map-gl-v7/maplibre';
import { MapProject } from '../../../common/types/projectv2';
import styles from './ProjectPopup.module.scss';
import ProjectSnippet from '../../ProjectSnippet';

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
        className={styles.popupContainer}
        onMouseLeave={handlePopupLeave}
        onClick={() => visitProject(project.properties.slug)}
        onKeyDown={() => visitProject(project.properties.slug)}
      >
        <ProjectSnippet
          project={project.properties}
          showTooltipPopups={false}
          showBackButton={false}
        />
      </div>
    </Popup>
  );
};

export default ProjectPopup;

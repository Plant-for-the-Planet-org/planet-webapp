import { Popup } from 'react-map-gl-v7/maplibre';
import { MapProject } from '../../../common/types/projectv2';

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
    >
      <div
        onMouseLeave={handlePopupLeave}
        onClick={() => visitProject(project.properties.slug)}
        onKeyDown={() => visitProject(project.properties.slug)}
      >
        <h3>{project.properties.name}</h3>
      </div>
    </Popup>
  );
};

export default ProjectPopup;

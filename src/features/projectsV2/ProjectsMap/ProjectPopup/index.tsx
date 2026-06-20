import type { MapProject } from '../../../common/types/projectv2';

import { Popup } from 'react-map-gl-v7/maplibre';
import styles from './ProjectPopup.module.scss';
import ProjectSnippet from '../../ProjectSnippet';

type Props = {
  project: MapProject;
  handlePopupLeave: () => void;
  handlePopupEnter?: () => void;
  visitProject: (projectSlug: string) => void;
  page: 'project-list' | 'project-details';
};

// Push the popup ~a pin-height away from the coordinate (in whichever direction
// it is anchored) so it never opens directly over the pin/cursor. Opening on top
// of the cursor made the map layer fire mouseleave -> the popup flickered
// open/closed; this keeps the cursor on the marker when the popup appears.
const POPUP_OFFSET = 42;

const ProjectPopup = ({
  project,
  handlePopupLeave,
  handlePopupEnter,
  visitProject,
  page,
}: Props) => {
  const { coordinates } = project.geometry;

  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      closeButton={false}
      offset={POPUP_OFFSET}
      className={styles.projectPopup}
    >
      <div
        className={styles.popupContainer}
        onMouseEnter={handlePopupEnter}
        onMouseLeave={handlePopupLeave}
        onClick={() => visitProject(project.properties.slug)}
        onKeyDown={() => visitProject(project.properties.slug)}
      >
        <ProjectSnippet
          project={project.properties}
          showTooltipPopups={false}
          page={page}
        />
      </div>
    </Popup>
  );
};

export default ProjectPopup;

import type { MapProject } from '../../../common/types/projectv2';

import { Popup } from 'react-map-gl-v7/maplibre';
import styles from './ProjectPopup.module.scss';
import ProjectSnippet from '../../ProjectSnippet';
import { MARKER_PIN_HEIGHT } from '../ProjectMarkers/markerImageRegistry';

// keeps popup clear of the pin; opening over the cursor fires mouseleave → flicker
const POPUP_OFFSET = MARKER_PIN_HEIGHT;

type Props = {
  project: MapProject;
  handlePopupLeave: () => void;
  handlePopupEnter: () => void;
  visitProject: (projectSlug: string) => void;
  page: 'project-list' | 'project-details';
};

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

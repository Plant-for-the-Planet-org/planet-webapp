import type { MapProject } from '../../../common/types/projectv2';

import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import ProjectPopup from '../ProjectPopup';
import SingleMarker from './SingleMarker';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

export type CategorizedProjects = {
  topApprovedProjects: MapProject[];
  nonDonatableProjects: MapProject[];
  regularDonatableProjects: MapProject[];
};
interface ProjectMarkersProps {
  categorizedProjects: CategorizedProjects | undefined;
  page: 'project-list' | 'project-details';
}

type ClosedPopupState = {
  show: false;
};

type OpenPopupState = {
  show: true;
  project: MapProject;
};

type PopupState = ClosedPopupState | OpenPopupState;

const ProjectMarkers = ({ categorizedProjects, page }: ProjectMarkersProps) => {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [popupState, setPopupState] = useState<PopupState>({ show: false });
  const { embed, callbackUrl } = useContext(ParamsContext);

  const visitProject = (projectSlug: string): void => {
    router.push(
      localizedPath(
        `/${projectSlug}${
          embed === 'true'
            ? `${
                callbackUrl != undefined
                  ? `?embed=true&callback=${callbackUrl}`
                  : '?embed=true'
              }`
            : ''
        }`
      )
    );
  };

  const initiatePopupOpen = (project: MapProject) => {
    if (
      popupState.show === false ||
      popupState.project.properties.id !== project.properties.id
    ) {
      timerRef.current = setTimeout(() => {
        setPopupState({
          show: true,
          project: project,
        });
      }, 300);
    }
  };

  const handleMarkerLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const initiatePopupClose = () => {
    setTimeout(() => {
      setPopupState({ show: false });
    }, 200);
  };
  if (!categorizedProjects) return null;
  const {
    topApprovedProjects,
    nonDonatableProjects,
    regularDonatableProjects,
  } = categorizedProjects;

  const renderMarkers = useCallback(
    (projects: MapProject[]) =>
      projects.map((project) => (
        <SingleMarker
          project={project}
          key={project.properties.id}
          onMouseOver={() => initiatePopupOpen(project)}
          onMouseLeave={handleMarkerLeave}
          visitProject={visitProject}
        />
      )),
    [initiatePopupOpen, handleMarkerLeave, visitProject]
  );

  const nonDonatableProjectMarkers = useMemo(
    () => renderMarkers(nonDonatableProjects),
    [renderMarkers, nonDonatableProjects]
  );
  const regularDonatableProjectMarkers = useMemo(
    () => renderMarkers(regularDonatableProjects),
    [renderMarkers, regularDonatableProjects]
  );
  const topApprovedProjectMarkers = useMemo(
    () => renderMarkers(topApprovedProjects),
    [renderMarkers, topApprovedProjects]
  );

  return (
    <>
      {nonDonatableProjectMarkers}
      {regularDonatableProjectMarkers}
      {topApprovedProjectMarkers}
      {popupState.show && (
        <ProjectPopup
          project={popupState.project}
          handlePopupLeave={initiatePopupClose}
          visitProject={visitProject}
          page={page}
        />
      )}
    </>
  );
};
export default ProjectMarkers;

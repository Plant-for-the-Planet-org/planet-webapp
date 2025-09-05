import type { ReactElement } from 'react';
import type { PopupData } from './Markers';
import type {
  MapProject,
  ViewPort,
} from '../../../common/types/ProjectPropsContextInterface';
import type { SetState } from '../../../common/types/common';

import { useEffect } from 'react';
import { FlyToInterpolator } from 'react-map-gl';
import Markers from './Markers';
import { easeCubic } from 'd3-ease';

interface Props {
  searchedProject: MapProject[];
  setPopupData: SetState<PopupData>;
  popupData: PopupData;
  isMobile: boolean;
  viewport: ViewPort;
  setViewPort: SetState<ViewPort>;
  defaultMapCenter: number[];
  defaultZoom: number;
}

export default function Home({
  searchedProject,
  setPopupData,
  popupData,
  isMobile,
  defaultMapCenter,
  viewport,
  setViewPort,
  defaultZoom,
}: Props): ReactElement {
  useEffect(() => {
    const newViewport = {
      ...viewport,
      latitude: defaultMapCenter[0],
      longitude: defaultMapCenter[1],
      zoom: defaultZoom,
      transitionDuration: 2400,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: easeCubic,
    };
    setViewPort(newViewport);
  }, []);

  const topApprovedProjects = searchedProject.filter(
    (project) =>
      project.properties.isTopProject && project.properties.isApproved
  );

  const topUnapprovedProjects = searchedProject.filter(
    (project) =>
      project.properties.allowDonations &&
      !(project.properties.isTopProject && project.properties.isApproved)
  );

  const notDonatableProjects = searchedProject.filter(
    (project) =>
      !project.properties.allowDonations &&
      !(project.properties.isTopProject && project.properties.isApproved)
  );

  const renderMarkers = (projects: MapProject[]) => (
    <Markers
      searchedProject={projects}
      setPopupData={setPopupData}
      popupData={popupData}
      isMobile={isMobile}
    />
  );

  return (
    <>
      {renderMarkers(notDonatableProjects)}
      {renderMarkers(topUnapprovedProjects)}
      {renderMarkers(topApprovedProjects)}
    </>
  );
}

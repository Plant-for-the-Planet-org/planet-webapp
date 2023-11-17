import React, { ReactElement } from 'react';
import { FlyToInterpolator } from 'react-map-gl';
import Markers, { PopupData } from './Markers';
import * as d3 from 'd3-ease';
import {
  MapProject,
  ViewPort,
} from '../../../common/types/ProjectPropsContextInterface';
import { SetState } from '../../../common/types/common';

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
  React.useEffect(() => {
    const newViewport = {
      ...viewport,
      latitude: defaultMapCenter[0],
      longitude: defaultMapCenter[1],
      zoom: defaultZoom,
      transitionDuration: 2400,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
    };
    setViewPort(newViewport);
  }, []);

  const topProjects = searchedProject.filter(
    (project) =>
      project.properties.isTopProject && project.properties.isApproved
  );

  const midProjects = searchedProject.filter(
    (project) =>
      project.properties.allowDonations &&
      !(project.properties.isTopProject && project.properties.isApproved)
  );

  const bottomProjects = searchedProject.filter(
    (project) =>
      !project.allowDonations &&
      !(project.properties.isTopProject && project.properties.isApproved)
  );

  return (
    <>
      <Markers
        searchedProject={bottomProjects}
        setPopupData={setPopupData}
        popupData={popupData}
        isMobile={isMobile}
      />
      <Markers
        searchedProject={midProjects}
        setPopupData={setPopupData}
        popupData={popupData}
        isMobile={isMobile}
      />
      <Markers
        searchedProject={topProjects}
        setPopupData={setPopupData}
        popupData={popupData}
        isMobile={isMobile}
      />
    </>
  );
}

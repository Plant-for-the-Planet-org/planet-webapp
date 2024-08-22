import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Marker, Popup } from 'react-map-gl';
import PopupProject from '../PopupProject';
import styles from '../../styles/ProjectsMap.module.scss';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import ProjectTypeIcon from '../../../common/ProjectTypeIcon';
import { SetState } from '../../../common/types/common';
import { MapProject } from '../../../common/types/ProjectPropsContextInterface';
import { useLocale } from 'next-intl';

type PopupClosedData = {
  show: false;
};
type PopupOpenData = {
  show: true;
  lat: number;
  long: number;
  project: MapProject;
};
export type PopupData = PopupClosedData | PopupOpenData;
interface Props {
  searchedProject: MapProject[];
  setPopupData: SetState<PopupData>;
  popupData: PopupData;
  isMobile: boolean;
}
export default function Markers({
  searchedProject,
  setPopupData,
  popupData,
  isMobile,
}: Props): ReactElement {
  let timer: NodeJS.Timeout;
  const router = useRouter();
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { embed, callbackUrl } = React.useContext(ParamsContext);
  const handleClose = () => {
    setOpen(false);
  };
  const markerBackgroundColor = (project) => {
    return project.isTopProject && project.isApproved
      ? 'topApproved'
      : project.allowDonations
      ? 'topUnapproved'
      : 'notDonatable';
  };
  const goToProject = (projectSlug: string): void => {
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
      {searchedProject.map((projectMarker, index) => (
        <Marker
          key={index}
          latitude={projectMarker.geometry.coordinates[1]}
          longitude={projectMarker.geometry.coordinates[0]}
          offsetLeft={5}
          offsetTop={-16}
        >
          <div className={styles.markerContainer}>
            <div
              className={`${styles.marker} ${
                styles[markerBackgroundColor(projectMarker.properties)]
              }`}
              onClick={() => goToProject(projectMarker.properties.slug)}
              onKeyDown={() => goToProject(projectMarker.properties.slug)}
              role="button"
              tabIndex={0}
              onMouseOver={() => {
                timer = setTimeout(() => {
                  setPopupData({
                    show: true,
                    lat: projectMarker.geometry.coordinates[1],
                    long: projectMarker.geometry.coordinates[0],
                    project: projectMarker,
                  });
                }, 300);
              }}
              onMouseLeave={() => {
                clearTimeout(timer);
              }}
              onFocus={() => {}}
            />
            <div className={styles.projectTypeIcon}>
              <ProjectTypeIcon
                projectType={
                  projectMarker.properties.purpose === 'conservation'
                    ? 'conservation'
                    : projectMarker.properties.classification
                }
              />
            </div>
          </div>
        </Marker>
      ))}
      {popupData.show && !isMobile && (
        <Popup
          latitude={popupData.lat}
          longitude={popupData.long}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setPopupData({ show: false })}
          anchor="bottom"
          dynamicPosition={false}
          offsetTop={-15}
          tipSize={0}
        >
          <div
            className={styles.popupProject}
            onClick={(event) => {
              if (event.target !== buttonRef.current) {
                goToProject(popupData.project.properties.slug);
              }
            }}
            onKeyDown={() => goToProject(popupData.project.properties.slug)}
            role="button"
            tabIndex={0}
            onMouseLeave={() => {
              if (!open) {
                setTimeout(() => {
                  setPopupData({ show: false });
                }, 300);
                handleClose();
              }
            }}
          >
            <PopupProject
              project={popupData.project.properties}
              buttonRef={buttonRef}
            />
          </div>
        </Popup>
      )}
    </>
  );
}

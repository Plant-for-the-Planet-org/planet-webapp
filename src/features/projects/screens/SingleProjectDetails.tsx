import type { ReactElement } from 'react';

import Modal from '@mui/material/Modal';
import MuiButton from '../../common/InputTypes/MuiButton';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState, useContext } from 'react';
import ReactPlayer from 'react-player/lazy';
import ReadMoreReact from 'read-more-react';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import ProjectContactDetails from '../components/projectDetails/ProjectContactDetails';
import { useTranslations } from 'next-intl';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import ExpandIcon from '../../../../public/assets/images/icons/ExpandIcon';
import ProjectInfo from '../components/projectDetails/ProjectInfo';
import ProjectSnippet from '../components/ProjectSnippet';
import SitesDropdown from '../components/maps/SitesDropdown';
import { useProjectProps } from '../../common/Layout/ProjectPropsContext';
import ProjectTabs from '../components/maps/ProjectTabs';
import InterventionDetails from '../components/Intervention/InterventionDetails';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import TopProjectReports from '../components/projectDetails/TopProjectReports';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import themeProperties from '../../../theme/themeProperties';

const TimeTravel = dynamic(() => import('../components/maps/TimeTravel'), {
  ssr: false,
});

const ImageSlider = dynamic(
  () => import('../components/projectDetails/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

function SingleProjectDetails(): ReactElement {
  const router = useRouter();

  const tDonate = useTranslations('Donate');
  const tMaps = useTranslations('Maps');
  const {
    project,
    geoJson,
    rasterData,
    hoveredPl,
    selectedPl,
    setHoveredPl,
    setSelectedPl,
    sampleIntervention,
  } = useProjectProps();
  const { localizedPath } = useLocalizedPath();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 768;
  const [scrollY, setScrollY] = useState(0);
  const { embed, showBackIcon, callbackUrl, showProjectDetails } =
    useContext(ParamsContext);
  const isEmbed = embed === 'true';
  const [hideProjectContainer, setHideProjectContainer] = useState(isEmbed);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [openModal, setModalOpen] = React.useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const toggleProjectContainer = () => {
    setHideProjectContainer(!hideProjectContainer);
  };

  const ProjectProps = {
    activeIntervention: hoveredPl
      ? hoveredPl
      : sampleIntervention
      ? sampleIntervention
      : selectedPl,
  };

  const goBack = () => {
    if (project && (selectedPl || hoveredPl)) {
      setHoveredPl(null);
      setSelectedPl(null);
      router.push(
        localizedPath(
          `/projects-archive/${project.slug}/${
            isEmbed
              ? `${
                  callbackUrl != undefined
                    ? `?embed=true&callback=${callbackUrl}`
                    : '?embed=true'
                }`
              : ''
          }`
        )
      );
    } else {
      if (document.referrer) {
        window.history.go(-2);
      } else {
        router.replace({
          pathname: localizedPath(`/projects-archive`),
          query: {
            ...(isEmbed ? { embed: 'true' } : {}),
            ...(isEmbed && callbackUrl !== undefined
              ? { callback: callbackUrl }
              : {}),
          },
        });
      }
    }
  };

  return project !== null ? (
    <>
      {/* <Explore /> */}
      {geoJson && <SitesDropdown />}
      {geoJson &&
        Object.keys(rasterData.imagery).length !== 0 &&
        rasterData.imagery.constructor === Object && (
          <>
            <ProjectTabs />
            <TimeTravel />
          </>
        )}
      {isEmbed && isMobile && showProjectDetails === undefined && (
        <MuiButton
          onClick={toggleProjectContainer}
          variant={hideProjectContainer ? 'outlined' : 'contained'}
          className="toggleButton"
        >
          {hideProjectContainer
            ? tMaps('showProjectDetails')
            : tMaps('hideProjectDetails')}
        </MuiButton>
      )}
      <div
        style={{ transform: `translate(0,${scrollY}px)` }}
        className={isEmbed ? 'embedContainer' : 'container'}
        onTouchMove={(event) => {
          if (isMobile) {
            if (event.targetTouches[0].clientY < (screenHeight * 2) / 8) {
              setScrollY(event.targetTouches[0].clientY);
            } else {
              setScrollY((screenHeight * 2) / 8);
            }
          }
        }}
      >
        <Modal
          className={'modalContainer'}
          open={openModal}
          onClose={handleModalClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          hideBackdrop
        >
          <div className={'modalWrapper'}>
            <button
              id={'singleProjCloseModal'}
              onClick={handleModalClose}
              className={'modalClose'}
            >
              <CancelIcon color="#fff" />
            </button>
            <ImageSlider
              images={project.images}
              height={600}
              imageSize="large"
              type="project"
            />
          </div>
        </Modal>

        {!(isEmbed && showProjectDetails === 'false') && (
          <div
            className={`projectContainer ${
              isMobile && hideProjectContainer && showProjectDetails !== 'true'
                ? 'mobile-hidden'
                : ''
            }`}
          >
            {isEmbed && showBackIcon === 'false' ? (
              <></>
            ) : (
              <button
                id={'backButtonSingleP'}
                style={{
                  cursor: 'pointer',
                  width: 'fit-content',
                  position: 'absolute',
                  zIndex: 3333,
                }}
                onClick={goBack}
              >
                <BackButton />
              </button>
            )}
            <div className={'projectSnippetContainer'}>
              <ProjectSnippet
                project={project}
                displayPopup={false}
                editMode={false}
              />
            </div>
            {hoveredPl || selectedPl ? (
              <InterventionDetails {...ProjectProps} />
            ) : (
              <div className={'singleProjectDetails'}>
                <div
                  className={'projectCompleteInfo'}
                  style={{ marginTop: 24 }}
                >
                  {project.purpose === 'trees' &&
                    project.isApproved &&
                    project.reviews !== undefined &&
                    project.reviews.length > 0 && (
                      <TopProjectReports projectReviews={project.reviews} />
                    )}
                  <div className={'projectDescription'}>
                    <div className={'infoTitle'}>{tDonate('aboutProject')}</div>
                    <ReadMoreReact
                      key={project.description || ''}
                      min={300}
                      ideal={350}
                      max={400}
                      readMoreText={tDonate('readMore')}
                      text={project.description || ''}
                    />
                  </div>

                  <div className={'projectInfoProperties'}>
                    {project.videoUrl !== null &&
                    ReactPlayer.canPlay(project.videoUrl) ? (
                      <ReactPlayer
                        className={'projectVideoContainer'}
                        width="100%"
                        height="220px"
                        loop={true}
                        light={true}
                        controls={true}
                        config={{
                          youtube: {
                            playerVars: { autoPlay: 1 },
                          },
                        }}
                        url={project.videoUrl}
                      />
                    ) : null}
                    <div className={'projectImageSliderContainer'}>
                      <button
                        id={'expandButton'}
                        onClick={handleModalOpen}
                        className={'modalOpen'}
                      >
                        <ExpandIcon
                          color={themeProperties.designSystem.colors.white}
                        />
                      </button>
                      {project?.images?.length > 0 && !openModal ? (
                        <ImageSlider
                          images={project.images}
                          height={233}
                          imageSize="medium"
                          type="project"
                        />
                      ) : null}
                    </div>
                    <ProjectInfo project={project} />
                    <ProjectContactDetails project={project} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}

export default SingleProjectDetails;

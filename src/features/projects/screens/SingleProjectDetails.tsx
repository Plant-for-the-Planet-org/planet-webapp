import Modal from '@mui/material/Modal';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import ReactPlayer from 'react-player/lazy';
import ReadMoreReact from 'read-more-react';
import BackButton from '../../../../public/assets/images/icons/BackButton';
import ProjectContactDetails from '../components/projectDetails/ProjectContactDetails';
import i18next from '../../../../i18n';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import ExpandIcon from '../../../../public/assets/images/icons/ExpandIcon';
import ProjectInfo from '../components/projectDetails/ProjectInfo';
import ProjectSnippet from '../components/ProjectSnippet';
import SitesDropdown from '../components/maps/SitesDropdown';
import Explore from '../components/maps/Explore';
import { ProjectPropsContext } from '../../common/Layout/ProjectPropsContext';
import ProjectTabs from '../components/maps/ProjectTabs';
import PlantLocationDetails from '../components/PlantLocation/PlantLocationDetails';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';

const TimeTravel = dynamic(() => import('../components/maps/TimeTravel'), {
  ssr: false,
});

const { useTranslation } = i18next;
interface Props {}

const ImageSlider = dynamic(
  () => import('../components/projectDetails/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

function SingleProjectDetails({}: Props): ReactElement {
  const router = useRouter();
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);
  const {
    project,
    geoJson,
    rasterData,
    selectedMode,
    hoveredPl,
    selectedPl,
    setHoveredPl,
    setSelectedPl,
  } = React.useContext(ProjectPropsContext);
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 768;
  const [scrollY, setScrollY] = React.useState(0);
  const [rating, setRating] = React.useState<number | null>(2);
  const { embed,singleProject } = React.useContext(ParamsContext);
  let progressPercentage = (project.countPlanted / project.countTarget) * 100;

  if (progressPercentage > 100) {
    progressPercentage = 100;
  }

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

  const ProjectProps = {
    plantLocation: hoveredPl ? hoveredPl : selectedPl,
  };
 
  const goBack = () => {
    if (selectedPl || hoveredPl) {
      setHoveredPl(null);
      setSelectedPl(null);
      router.push(`/${project.slug}/${embed === 'true' ? '?embed=true': ''}`);
       
    } else {
        router.replace(`/${embed === 'true' ? '?embed=true': ''}`);
    }
  };
  
  return ready ? (
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
      <div
        style={{ transform: `translate(0,${scrollY}px)` }}
        className={embed === 'true' ? 'embedContainer': 'container'}
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
        
        <div className={'projectContainer'}>
        {embed ==='true' && singleProject==='true'? <></>:(
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
          </button>)}
          <div className={'projectSnippetContainer'}>
            <ProjectSnippet
              keyString={project.id}
              project={project}
              editMode={false}
            />
          </div>
          {hoveredPl || selectedPl ? (
            <PlantLocationDetails {...ProjectProps} />
          ) : (
            <div className={'singleProjectDetails'}>
              <div className={'projectCompleteInfo'}>
                <div className={'projectDescription'}>
                  <div className={'infoTitle'}>{t('donate:aboutProject')}</div>
                  <ReadMoreReact
                    key={project.description || ''}
                    min={300}
                    ideal={350}
                    max={400}
                    readMoreText={t('donate:readMore')}
                    text={project.description || ''}
                  />
                </div>

                <div className={'projectInfoProperties'}>
                  {ReactPlayer.canPlay(project.videoUrl) ? (
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
                      <ExpandIcon color="#fff" />
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
                  {/*  {financialReports? <FinancialReports financialReports={financialReports} /> : null}
                    {species ? <PlantSpecies species={species} /> : null }
                    {co2 ? (<CarbonCaptured co2={co2} />) : null} */}

                  <ProjectContactDetails project={project} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}

export default SingleProjectDetails;

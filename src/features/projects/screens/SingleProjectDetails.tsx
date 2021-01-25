import Modal from '@material-ui/core/Modal';
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
import styles from '../styles/ProjectDetails.module.scss';

const { useTranslation } = i18next;
interface Props {
  project: any;
}

const ImageSlider = dynamic(
  () => import('../components/projectDetails/ImageSlider'),
  {
    ssr: false,
    loading: () => <p>Images</p>,
  }
);

function SingleProjectDetails({ project }: Props): ReactElement {
  const router = useRouter();
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 768;
  const [scrollY, setScrollY] = React.useState(0);
  const [rating, setRating] = React.useState<number | null>(2);
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
  return ready ? (
    <div
      style={{ transform: `translate(0,${scrollY}px)` }}
      className={'container'}
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
        className={'imageModal'}
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        hideBackdrop
      >
        <div className={'modalWrapper'}>
          <div onClick={handleModalClose} className={'modalClose'}>
            <CancelIcon color="#fff" />
          </div>
          <ImageSlider project={project} height={600} imageSize="large" />
        </div>
      </Modal>
      <div className={'projectContainer'}>
        <button id={'backButtonSingleP'}
          style={{
            cursor: 'pointer',
            width: 'fit-content',
            position: 'absolute',
            zIndex: 3333,
          }}
          onClick={() => {
            router.push('/', undefined, { shallow: true });
          }}
        >
          <BackButton />
        </button>
        <div className={'projectSnippetContainer'}>
          <ProjectSnippet key={project.id} project={project} editMode={false} />
        </div>

        <div className={'singleProject'}>
          <div className={'projectCompleteInfo'}>
            {/* <div className={'ratings}>
              <div className={'calculatedRating}>{rating}</div>
              <div className={'ratingButton}>
                <MaterialRatings
                  name="simple-controlled"
                  value={rating}
                  size="small"
                  readOnly
                />
              </div>
            </div> */}

            <div className={'projectDescription'}>
              <ReadMoreReact
                min={300}
                ideal={350}
                max={400}
                readMoreText={t('donate:readMore')}
                text={project.description}
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
                      playerVars: { autoplay: 1 },
                    },
                  }}
                  url={project.videoUrl}
                />
              ) : null}
              <div className={'projectImageSliderContainer'}>
                <button id={'expandButton'} onClick={handleModalOpen} className={'modalOpen'}>
                  <ExpandIcon color="#fff" />
                </button>
                {project.images.length > 0 && !openModal ? (
                  <ImageSlider
                    project={project}
                    height={233}
                    imageSize="medium"
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
      </div>
    </div>
  ) : <></>;
}

export default SingleProjectDetails;

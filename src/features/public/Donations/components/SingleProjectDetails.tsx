import Modal from '@material-ui/core/Modal';
import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import LazyLoad from 'react-lazyload';
import ReactPlayer from 'react-player/lazy';
import ReadMoreReact from 'read-more-react';
import Sugar from 'sugar';
import BackButton from '../../../../assets/images/icons/BackButton';
import BlackTree from '../../../../assets/images/icons/project/BlackTree';
import Email from '../../../../assets/images/icons/project/Email';
import Location from '../../../../assets/images/icons/project/Location';
import WorldWeb from '../../../../assets/images/icons/project/WorldWeb';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import { getImageUrl } from '../../../../utils/getImageURL';
import getStripe from '../../../../utils/getStripe';
import ProjectContactDetails from '../components/projectDetails/ProjectContactDetails';
import DonationsPopup from '../screens/DonationsPopup';
import styles from './../styles/ProjectDetails.module.scss';

interface Props {
  project: any;
  setShowSingleProject: Function;
  setLayoutId: Function;
  touchMap: any;
  setTouchMap: Function;
}

const ImageSlider = dynamic(() => import('./ImageSlider'), {
  ssr: false,
  loading: () => <p>Images</p>,
});

function SingleProjectDetails({
  project,
  setShowSingleProject,
  setLayoutId,
}: Props): ReactElement {
  const router = useRouter();

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 1024;
  // subtract screen height with bottom nav
  const containerHeight = screenHeight - 76;
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [clientY, setClientY] = React.useState(!isMobile ? 60 : 0);
  const [top, setTop] = React.useState(!isMobile ? 60 : 200);
  const [allowScroll, setAllowScroll] = React.useState(!isMobile);
  const [canChangeTopValue, setCanChangeTopValue] = React.useState(true);

  const [rating, setRating] = React.useState<number | null>(2);
  let progressPercentage = (project.countPlanted / project.countTarget) * 100;

  if (progressPercentage > 100) {
    progressPercentage = 100;
  }
  const ImageSource = project.image
    ? getImageUrl('project', 'large', project.image)
    : '';

  const contactDetails = [
    {
      id: 1,
      icon: <BlackTree />,
      text: 'View Profile',
      link: project.tpo.slug,
    },
    {
      id: 2,
      icon: <WorldWeb />,
      text: project.website ? project.website : 'unavailable',
      link: project.website,
    },
    {
      id: 3,
      icon: <Location />,
      text:
        project.tpo && project.tpo.address
          ? project.tpo.address
          : 'unavailable',

      link: project.coordinates
        ? `https://maps.google.com/?q=${project.tpo.address}`
        : null,
    },
    {
      id: 4,
      icon: <Email />,
      text:
        project.tpo && project.tpo.email ? project.tpo.email : 'unavailable',
      link:
        project.tpo && project.tpo.email ? `mailto:${project.tpo.email}` : null,
    },
  ];

  const loadImageSource = (image: any) => {
    const ImageSource = getImageUrl('project', 'medium', image);
    return ImageSource;
  };

  // when touched on the project list container enables scrolling of list and
  // sets the current y-axis touch position in clientY
  function onTouchStart(e: any) {
    if (isMobile) {
      setIsScrolling(true);
      setClientY(e.touches[0].clientY);
    }
  }

  // when finger is dragged new on the list it adjusts the margin of the container accordingly
  function onTouchMove(e: any) {
    if (isScrolling) {
      let newTop = top + (e.touches[0].clientY - clientY);
      // if change of top value is allowed and the current top value is below the
      // top of the screen then replaces the state top value with current top value
      if (canChangeTopValue && newTop >= 0 && newTop <= screenHeight - 130) {
        setTop(newTop);
        setClientY(e.touches[0].clientY);
      }
      // checks if top value is less than 20px then allows the list to scroll else not
      if (top <= 30) {
        setAllowScroll(true);
      } else {
        setAllowScroll(false);
      }
    }
  }

  // when finger is removed from the surface or interupted then stops the scrolling of list
  function onTouchEnd() {
    if (isMobile) {
      setIsScrolling(false);
    }
  }

  // handles the scroll of the project list
  function handleScroll(e: any) {
    // toggles the permission for changing the top value while the list is being scrolled
    // if list is scrolled to top then then allows the value of top to be changed
    // else disallows the top value to be changed
    if (e.target.scrollTop === 0) {
      setCanChangeTopValue(true);
    } else if (e.target.scrollTop > 0 && canChangeTopValue) {
      setCanChangeTopValue(false);
    }
  }

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const ProjectProps = {
    project: project,
  };
  return (
    <motion.div layoutId={project.id} className={styles.container}>
      <Modal
        className={styles.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Elements stripe={getStripe()}>
          <DonationsPopup project={project} onClose={handleClose} />
        </Elements>
      </Modal>
      <div
        style={{
          marginTop: top,
          height: isMobile ? containerHeight : containerHeight,
          overflowY: allowScroll ? 'scroll' : 'hidden',
        }}
        className={styles.projectContainer}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onTouchCancel={onTouchEnd}
        onScroll={handleScroll}
        // style={{
        //   height:
        //     window.innerWidth <= 768
        //       ? window.innerHeight - 126 - top
        //       : window.innerHeight - 126,

        // }}
      >
        <div className={styles.singleProject}>
          <div className={styles.projectImage}>
            {project.image ? (
              <LazyLoad>
                <div
                  className={styles.projectImageFile}
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.2), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`,
                  }}
                >
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setShowSingleProject(false),
                        setLayoutId(null),
                        router.push('/', undefined, { shallow: true });
                    }}
                  >
                    <BackButton />
                  </div>
                </div>
              </LazyLoad>
            ) : (
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setShowSingleProject(false),
                    router.push('/', undefined, { shallow: true });
                }}
              >
                <BackButton />
              </div>
            )}

            <div className={styles.projectImageBlock}>
              {/* <div className={styles.projectType}>
                {GetProjectClassification(project.classification)}
              </div> */}

              <div className={styles.projectName}>
                {Sugar.String.truncate(project.name, 60)}
              </div>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarHighlight}
              style={{ width: progressPercentage + '%' }}
            />
          </div>

          <div className={styles.projectCompleteInfo}>
            <div className={styles.projectInfo}>
              <div className={styles.projectData}>
                <div className={styles.targetLocation}>
                  <div className={styles.target}>
                    {Sugar.Number.abbr(Number(project.countPlanted), 1)} planted
                    •{' '}
                    <span style={{ fontWeight: 400 }}>
                      {
                        getCountryDataBy('countryCode', project.country)
                          .countryName
                      }
                    </span>
                  </div>
                  {/* <div className={styles.location}>
                    
                  </div> */}
                </div>
                <div className={styles.projectTPOName}>
                  By {project.tpo.name}
                </div>
              </div>

              {project.allowDonations && (
                <div className={styles.projectCost}>
                  <div onClick={handleOpen} className={styles.costButton}>
                    {project.currency === 'USD'
                      ? '$'
                      : project.currency === 'EUR'
                      ? '€'
                      : project.currency}
                    {project.treeCost % 1 !== 0
                      ? project.treeCost.toFixed(2)
                      : project.treeCost}
                  </div>
                  <div className={styles.perTree}>per tree</div>
                </div>
              )}
            </div>

            {/* <div className={styles.ratings}>
              <div className={styles.calculatedRating}>{rating}</div>
              <div className={styles.ratingButton}>
                <MaterialRatings
                  name="simple-controlled"
                  value={rating}
                  size="small"
                  readOnly
                />
              </div>
            </div> */}

            <div className={styles.projectDescription}>
              <ReadMoreReact
                min={300}
                ideal={350}
                max={400}
                readMoreText="Read more"
                text={project.description}
              />
            </div>

            <div className={styles.projectInfoProperties}>
              {ReactPlayer.canPlay(project.videoUrl) ? (
                <ReactPlayer
                  className={styles.projectVideoContainer}
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
              <div className={styles.projectImageSliderContainer}>
                {project.images.length > 0 ? (
                  <ImageSlider project={project} />
                ) : null}
              </div>
              {/* {infoProperties ? <ProjectInfo infoProperties={infoProperties} /> : null}
                            {financialReports? <FinancialReports financialReports={financialReports} /> : null}
                            {species ? <PlantSpecies species={species} /> : null }
                            {co2 ? (<CarbonCaptured co2={co2} />) : null} */}

              {contactDetails ? (
                <ProjectContactDetails contactDetails={contactDetails} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SingleProjectDetails;

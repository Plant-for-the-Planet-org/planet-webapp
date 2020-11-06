import Modal from '@material-ui/core/Modal';
import { Elements } from '@stripe/react-stripe-js';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import LazyLoad from 'react-lazyload';
import ReactPlayer from 'react-player/lazy';
import ReadMoreReact from 'read-more-react';
import Sugar from 'sugar';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import BlackTree from '../../../../../public/assets/images/icons/project/BlackTree';
import Email from '../../../../../public/assets/images/icons/project/Email';
import Location from '../../../../../public/assets/images/icons/project/Location';
import WorldWeb from '../../../../../public/assets/images/icons/project/WorldWeb';
import getImageUrl from '../../../../utils/getImageURL';
import getStripe from '../../../../utils/stripe/getStripe';
import { ThemeContext } from '../../../../theme/themeContext';
import ProjectContactDetails from '../components/projectDetails/ProjectContactDetails';
import DonationsPopup from '../screens/DonationsPopup';
import styles from './../styles/ProjectDetails.module.scss';
import i18next from '../../../../../i18n/'
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';

const { useTranslation } = i18next;
interface Props {
  project: any;
}

const ImageSlider = dynamic(() => import('./ImageSlider'), {
  ssr: false,
  loading: () => <p>Images</p>,
});

function SingleProjectDetails({ project }: Props): ReactElement {
  const router = useRouter();
  const { t, i18n } = useTranslation(['donate', 'common', 'country']);
  const [countryCode, setCountryCode] = React.useState<string>('DE');

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 768;
  const [scrollY, setScrollY] = React.useState(0);
  const [rating, setRating] = React.useState<number | null>(2);
  let progressPercentage = (project.countPlanted / project.countTarget) * 100;

  const { theme } = React.useContext(ThemeContext);

  if (progressPercentage > 100) {
    progressPercentage = 100;
  }
  const ImageSource = project.image
    ? getImageUrl('project', 'large', project.image)
    : '';

  const contactAddress = project.tpo && project.tpo.address 
    ? (project.tpo.address.address ? project.tpo.address.address + ', ' : '') 
      + (project.tpo.address.city ? project.tpo.address.city + ', ' : '')        
      + (project.tpo.address.zipCode ? project.tpo.address.zipCode + ' ' : '') 
      + (project.tpo.address.country ? t('country:' + project.tpo.address.country.toLowerCase()) : '')
    : t('donate:unavailable');
    
  const contactDetails = [
    {
      id: 1,
      icon: <BlackTree color={styles.highlightBackground} />,
      text: t('donate:viewProfile'),
      link: project.tpo.slug,
    },
    {
      id: 2,
      icon: <WorldWeb color={styles.highlightBackground} />,
      text: project.website ? project.website : t('donate:unavailable'),
      link: project.website,
    },
    {
      id: 3,
      icon: <Location color={styles.highlightBackground} />,
      text: contactAddress,
      link: project.coordinates
        ? `https://maps.google.com/?q=${contactAddress}`
        : null,
    },
    {
      id: 4,
      icon: <Email color={styles.highlightBackground} />,
      text:
        project.tpo && project.tpo.email
          ? project.tpo.email
          : t('donate:unavailable'),
      link:
        project.tpo && project.tpo.email ? `mailto:${project.tpo.email}` : null,
    },
  ];
  React.useEffect(() => {
    const code = window.localStorage.getItem('countryCode') || 'DE';
    setCountryCode(code);
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
;
  return (
    <div
      style={{ transform: `translate(0,${scrollY}px)` }}
      className={styles.container}
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
        className={styles.modal + ' ' + theme}
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
      <div className={styles.projectContainer}>
        <div className={styles.singleProject}>
          <div className={styles.projectImage}>
            {project.image ? (
              // <LazyLoad>
              <div
                className={styles.projectImageFile}
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.2), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`,
                }}
              >
                <div
                  style={{ cursor: 'pointer', width: 'fit-content' }}
                  onClick={() => {
                    router.push('/', undefined, { shallow: true });
                  }}
                >
                  <BackButton />
                </div>
              </div>
            ) : (
              // </LazyLoad>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
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
                    {Sugar.Number.abbr(Number(project.countPlanted), 1)}{' '}
                    {t('common:planted')}•{' '}
                    <span style={{ fontWeight: 400 }}>
                      {t('country:' + project.country.toLowerCase())}
                    </span>
                  </div>
                  {/* <div className={styles.location}>
                    
                  </div> */}
                </div>
                <div className={styles.projectTPOName} onClick={() => {
                  router.push(`/t/${project.tpo.slug}`);
                }}>
                  {t('common:by')} {project.tpo.name}
                </div>
              </div>

              {project.allowDonations && (
                <div className={styles.projectCost}>
                  <div onClick={handleOpen} className={styles.donateButton}>
                    {t('common:donate')}
                  </div>
                  <div className={styles.perTreeCost}>
                    {getFormatedCurrency(
                      i18n.language,
                      project.currency,
                      project.treeCost
                    )}{' '}
                    <span>{t('donate:perTree')}</span>
                  </div>
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
                readMoreText={t('donate:readMore')}
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
    </div>
  );
}

export default SingleProjectDetails;

import React from 'react';
import styles from '../styles/RegisterModal.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';
import { Controller, useForm } from 'react-hook-form';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useDropzone } from 'react-dropzone';
import MapGL, {
  FlyToInterpolator,
  Marker,
  NavigationControl,
  WebMercatorViewport,
} from 'react-map-gl';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import InfoIcon from '../../../../../public/assets/images/icons/manageProjects/Info';
import * as d3 from 'd3-ease';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import { useRouter } from 'next/router';
import { getAuthenticatedRequest, putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import BasicDetailsStep from './RegisterTrees/BasicDetails';
import UploadImagesStep from './RegisterTrees/UploadImages';
import MoreDetailsStep from './RegisterTrees/MoreDetails';
import { Step, StepContent, StepLabel, Stepper } from '@material-ui/core';

interface Props {
  slug: any;
  session: any;
}

const { useTranslation } = i18next;
export default function RegisterTrees({ slug, session
}: Props) {
  const router = useRouter();
  const { t } = useTranslation(['me', 'common']);
  const [isMultiple, setIsMultiple] = React.useState(false);
  function getSteps() {
    if (!isMultiple) {
      return ['Basic', 'Upload Images', 'Optional'];
    } else {
      return ['Basic', 'Upload Images'];
    }
  }
  const [contributionGUID, setContributionGUID] = React.useState('');
  const [contributionDetails, setContributionDetails] = React.useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const steps = getSteps();
  const [isUploadingData, setIsUploadingData] = React.useState(false);

  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 767;
  const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
  const defaultZoom = isMobile ? 1 : 1.4;
  const [plantLocation, setplantLocation] = React.useState([
    defaultMapCenter[0],
    defaultMapCenter[1],
  ]);

  const [viewport, setViewPort] = React.useState({
    width: '100%',
    height: '100%',
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const [userLang, setUserLang] = React.useState('en')
  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      let userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (message) => {
    setErrorMessage(message)
    setActiveStep(0);
  };

  const submitRegisterTrees = () => {
    setIsUploadingData(true)
    const submitData = {
      reviewRequested: true
    }
    putAuthenticatedRequest(`/app/projects/${contributionGUID}`, submitData, session).then((res) => {
      if (!res.code) {
        setContributionDetails(res)
        setErrorMessage('')
        setIsUploadingData(false)
      } else {
        if (res.code === 404) {
          setErrorMessage(t('manageProjects:projectNotFound'))
          setIsUploadingData(false)
        }
        else {
          setErrorMessage(res.message)
          setIsUploadingData(false)
        }

      }
    })
  }

  React.useEffect(() => {
    // Fetch details of the contribution 
    if (contributionGUID && session?.accessToken)
      getAuthenticatedRequest(`/app/profile/projects/${contributionGUID}`, session).then((result: any) => {
        setContributionDetails(result)
      })
  }, [contributionGUID]);

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <BasicDetailsStep handleNext={handleNext} lang={userLang} />;
      case 1:
        return <UploadImagesStep handleNext={handleNext} />;
      case 2:
        return <MoreDetailsStep />;
      default:
        return <BasicDetailsStep handleNext={handleNext} lang={userLang} />;
    }
  }

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  return (

    <div className={styles.modal}>

      <div className={styles.formContainer}>

        <h2 className={styles.title}>
          <div
            style={{ cursor: 'pointer', marginLeft: -10, paddingRight: 10 }}
            onClick={() => {
              router.push(`/t/${slug}`, undefined, { shallow: true });
            }}
          >
            <BackButton />
          </div>
          <b> {t('me:registerTrees')} </b>
        </h2>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel onClick={() => setActiveStep(index)}>{label}</StepLabel>
              <StepContent>
                {getStepContent(index)}
              </StepContent>
            </Step>
          ))}
        </Stepper>

      </div>
      <div className={`${styles.locationMap}`}>
        <MapGL
          {...viewport}
          mapboxApiAccessToken={process.env.MAPBOXGL_ACCESS_TOKEN}
          mapStyle='mapbox://styles/mapbox/streets-v11'
          onViewportChange={_onViewportChange}
          onClick={(event) => {
            setplantLocation(event.lngLat);
            setViewPort({
              ...viewport,
              latitude: event.lngLat[1],
              longitude: event.lngLat[0],
              transitionDuration: 400,
              transitionInterpolator: new FlyToInterpolator(),
              transitionEasing: d3.easeCubic,
            });
          }}
        >
          <Marker
            latitude={plantLocation[1]}
            longitude={plantLocation[0]}
            offsetLeft={5}
            offsetTop={-16}
            style={{ left: '28px' }}
          >
            <div className={styles.marker}></div>
          </Marker>
          <div className={styles.mapNavigation}>
            <NavigationControl showCompass={false} />
          </div>
        </MapGL>
      </div>


    </div>
  );
}

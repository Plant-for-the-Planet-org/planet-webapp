import React, { ReactElement } from 'react';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import PlantingLocation from './components/PlantingLocation';
import styles from './Import.module.scss';
import i18next from '../../../../../i18n';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';
import { Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import SampleTrees from './components/SampleTrees';
import ReviewSubmit from './components/ReviewSubmit';
import { getStoredConfig } from '../../../../utils/storeConfig';
import dynamic from 'next/dynamic';

const { useTranslation } = i18next;

interface Props {}

const Map = dynamic(() => import('./components/Map'), {
  loading: () => <p>loading</p>,
});

export default function ImportData({}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['treemapper']);
  const { token } = React.useContext(UserPropsContext);

  function getSteps() {
    return [
      ready ? t('treemapper:plantingLocation') : '',
      ready ? t('treemapper:sampleTrees') : '',
      ready ? t('treemapper:reviewAndSubmit') : '',
    ];
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const steps = getSteps();
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [plantLocation, setPlantLocation] = React.useState(null);
  const [userLang, setUserLang] = React.useState('en');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (message: any) => {
    setErrorMessage(message);
    setActiveStep(0);
  };

  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, []);

  const router = useRouter();

  const submitForReview = () => {
    setIsUploadingData(true);
    const submitData = {
      reviewRequested: true,
    };
    putAuthenticatedRequest(`/app/projects/`, submitData, token).then((res) => {
      if (!res.code) {
        setPlantLocation(res);
        setErrorMessage('');
        setIsUploadingData(false);
      } else {
        if (res.code === 404) {
          setErrorMessage(ready ? t('manageProjects:projectNotFound') : '');
          setIsUploadingData(false);
        } else {
          setErrorMessage(res.message);
          setIsUploadingData(false);
        }
      }
    });
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <PlantingLocation
            handleNext={handleNext}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            userLang={userLang}
          />
        );
      case 1:
        return (
          <SampleTrees
            handleNext={handleNext}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        );
      case 2:
        return (
          <ReviewSubmit
            handleNext={handleNext}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        );
      default:
        return (
          <PlantingLocation
            handleNext={handleNext}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        );
    }
  }
  return (
    <div className={styles.profilePage}>
      <div className={styles.pageContainer}>
        <div className={styles.listContainer}>
          <div className={styles.pageTitle}>Import Data</div>
          <p>
            You can import kml, csv and other files to TreeMapper.... (only
            available on web) type: `external` not off-site
          </p>
          <div className={styles.stepperContainer}>
            <Stepper
              activeStep={activeStep}
              orientation="horizontal"
              alternativeLabel
              className={styles.stepper}
            >
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel onClick={() => setActiveStep(index)}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className={styles.stepContent}>
              {getStepContent(activeStep)}
            </div>
          </div>
        </div>
        <div className={styles.mapContainer}>
              <Map
              />
          </div>
      </div>
    </div>
  );
}

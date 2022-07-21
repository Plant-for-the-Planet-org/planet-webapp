import React, { ReactElement } from 'react';
import {
  getAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import PlantingLocation from './components/PlantingLocation';
import styles from './Import.module.scss';
import i18next from '../../../../../i18n';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { useRouter } from 'next/router';
import {
  Step as MuiStep,
  StepLabel,
  Stepper as MuiStepper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SampleTrees from './components/SampleTrees';
import ReviewSubmit from './components/ReviewSubmit';
import dynamic from 'next/dynamic';
import theme from '../../../../theme/themeProperties';
import { TenantContext } from '../../../common/Layout/TenantContext';

const { useTranslation } = i18next;

const Stepper = styled(MuiStepper)({
  '&': {
    backgroundColor: 'transparent',
    padding: '20px 0 5px',
  },
});

const Step = styled(MuiStep)({
  '& > span > span > .Mui-active': {
    color: theme.primaryColor,
  },
  '& > span > span > .Mui-completed': {
    color: theme.primaryColor,
  },
});

interface Props {}

const Map = dynamic(() => import('./components/Map'), {
  loading: () => <p>loading</p>,
});

const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => <p></p>,
});

export default function ImportData({}: Props): ReactElement {
  const router = useRouter();
  const { t, i18n, ready } = useTranslation(['treemapper']);
  const { token } = React.useContext(UserPropsContext);
  const { tenantID } = React.useContext(TenantContext);
  // loc_ACxv7uldM1VdKd5cikv3qoF5
  const fetchPlantLocation = async (id: any): Promise<void> => {
    const result = await getAuthenticatedRequest(
      `/treemapper/plantLocations/${id}?_scope=extended`,
      token,
      tenantID
    );
    setPlantLocation(result);
  };

  React.useEffect(() => {
    if (router && router.query.loc) {
      fetchPlantLocation(router.query.loc);
    }
  }, [router]);

  function getSteps() {
    return [
      ready ? t('treemapper:plantingLocation') : '',
      ready ? t('treemapper:sampleTrees') : '',
      ready ? t('treemapper:submitted') : '',
    ];
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const steps = getSteps();
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [plantLocation, setPlantLocation] =
    React.useState<Treemapper.PlantLocation | null>(null);
  const [userLang, setUserLang] = React.useState('en');
  const [geoJson, setGeoJson] = React.useState(null);
  const [geoJsonError, setGeoJsonError] = React.useState(false);
  const [activeMethod, setActiveMethod] = React.useState('import');

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
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

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <PlantingLocation
            handleNext={handleNext}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            userLang={userLang}
            plantLocation={plantLocation}
            setPlantLocation={setPlantLocation}
            geoJson={geoJson}
            setGeoJson={setGeoJson}
            activeMethod={activeMethod}
            setActiveMethod={setActiveMethod}
          />
        );
      case 1:
        return (
          <SampleTrees
            handleNext={handleNext}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            plantLocation={plantLocation}
            setPlantLocation={setPlantLocation}
            userLang={userLang}
          />
        );
      case 2:
        return (
          <ReviewSubmit
            plantLocation={plantLocation}
            handleBack={handleBack}
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
            userLang={userLang}
            plantLocation={plantLocation}
            setPlantLocation={setPlantLocation}
            geoJson={geoJson}
            setGeoJson={setGeoJson}
            activeMethod={activeMethod}
            setActiveMethod={setActiveMethod}
          />
        );
    }
  }
  return (
    <div className={styles.profilePage}>
      <div className={styles.pageContainer}>
        <div className={styles.listContainer}>
          <div className={styles.pageTitle}>{t('treemapper:importData')}</div>
          <p>{t('treemapper:importExplanation')}</p>
          <div className={styles.stepperContainer}>
            <Stepper
              activeStep={activeStep}
              orientation="horizontal"
              alternativeLabel
            >
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className={styles.stepContent}>
              {getStepContent(activeStep)}
            </div>
          </div>
        </div>
        <div className={styles.mapContainer}>
          <MapComponent
            geoJson={geoJson}
            setGeoJson={setGeoJson}
            setActiveMethod={setActiveMethod}
          />
        </div>
      </div>
    </div>
  );
}

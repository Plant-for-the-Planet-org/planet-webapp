import React, { ReactElement } from 'react';
import { getAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import PlantingLocation from './components/PlantingLocation';
import styles from './Import.module.scss';
import { useTranslations } from 'next-intl';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
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
import { handleError, APIError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useTenant } from '../../../common/Layout/TenantContext';
import { PlantLocation } from '../Treemapper';

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

const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => <p></p>,
});

export default function ImportData(): ReactElement {
  const router = useRouter();
  const { tenantConfig } = useTenant();
  const tTreemapper = useTranslations('Treemapper');
  const tCommon = useTranslations('Common');
  const { token, logoutUser } = useUserProps();
  const { setErrors } = React.useContext(ErrorHandlingContext);

  function getSteps() {
    return [
      tTreemapper('plantingLocation'),
      tTreemapper('sampleTrees'),
      tTreemapper('submitted'),
    ];
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const steps = getSteps();
  const [plantLocation, setPlantLocation] =
    React.useState<PlantLocation | null>(null);
  const [userLang, setUserLang] = React.useState('en');
  const [geoJson, setGeoJson] = React.useState(null);

  const fetchPlantLocation = async (id: string) => {
    try {
      const result = await getAuthenticatedRequest<PlantLocation>(
        tenantConfig?.id,
        `/treemapper/plantLocations/${id}?_scope=extended`,
        token,
        logoutUser
      );
      setPlantLocation(result);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  React.useEffect(() => {
    if (router && router.query.loc && !Array.isArray(router.query.loc)) {
      fetchPlantLocation(router.query.loc);
    }
  }, [router]);

  const [activeMethod, setActiveMethod] = React.useState('import');

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
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
            userLang={userLang}
            setPlantLocation={setPlantLocation}
            geoJson={geoJson}
            setGeoJson={setGeoJson}
            activeMethod={activeMethod}
            setActiveMethod={setActiveMethod}
          />
        );
      case 1:
        return plantLocation ? (
          <SampleTrees
            handleNext={handleNext}
            plantLocation={plantLocation}
            setPlantLocation={setPlantLocation}
            userLang={userLang}
          />
        ) : (
          <p> {tCommon('some_error')}</p>
        );
      case 2:
        return plantLocation ? (
          <ReviewSubmit
            plantLocation={plantLocation}
            handleBack={handleBack}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        ) : (
          <p> {tCommon('some_error')}</p>
        );
      default:
        return (
          <PlantingLocation
            handleNext={handleNext}
            userLang={userLang}
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
          <div className={styles.pageTitle}>{tTreemapper('importData')}</div>
          <p className={styles.pageSubtitle}>
            {tTreemapper('importExplanation')}
          </p>
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
          <MapComponent geoJson={geoJson} />
        </div>
      </div>
    </div>
  );
}

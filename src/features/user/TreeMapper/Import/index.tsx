import type { ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import { type PlantLocation as PlantLocationType } from '../../../common/types/plantLocation';

import React from 'react';
import PlantingLocation from './components/PlantingLocation';
import styles from './Import.module.scss';
import { useTranslations } from 'next-intl';
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
import { handleError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useApi } from '../../../../hooks/useApi';
import themeProperties from '../../../../theme/themeProperties';

const Stepper = styled(MuiStepper)({
  '&': {
    backgroundColor: 'transparent',
    padding: '20px 0 5px',
  },
});

const Step = styled(MuiStep)({
  '& > span > span > .Mui-active': {
    color: themeProperties.designSystem.colors.primaryColor,
  },
  '& > span > span > .Mui-completed': {
    color: themeProperties.designSystem.colors.primaryColor,
  },
});

const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => <p></p>,
});

export default function ImportData(): ReactElement {
  const router = useRouter();
  const tTreemapper = useTranslations('Treemapper');
  const tCommon = useTranslations('Common');
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { getApiAuthenticated } = useApi();
  function getSteps() {
    return [
      tTreemapper('plantingLocation'),
      tTreemapper('sampleTrees'),
      tTreemapper('submitted'),
    ];
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [plantLocation, setPlantLocation] =
    React.useState<PlantLocationType | null>(null);
  const [userLang, setUserLang] = React.useState('en');
  const [geoJson, setGeoJson] = React.useState(null);

  const fetchPlantLocation = async (id: string) => {
    try {
      const result = await getApiAuthenticated<PlantLocationType>(
        `/treemapper/interventions/${id}`,
        {
          queryParams: { _scope: 'extended' },
        }
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
        return plantLocation &&
          plantLocation.type === 'multi-tree-registration' ? (
          <SampleTrees
            handleNext={handleNext}
            plantLocation={plantLocation}
            userLang={userLang}
          />
        ) : (
          <p> {tCommon('some_error')}</p>
        );
      case 2:
        return plantLocation &&
          plantLocation.type === 'multi-tree-registration' ? (
          <ReviewSubmit plantLocation={plantLocation} handleBack={handleBack} />
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

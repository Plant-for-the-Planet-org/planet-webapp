import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import BasicDetails from './components/BasicDetails';
import styles from './StepForm.module.scss';
import ProjectMedia from './components/ProjectMedia';
import ProjectSelection from './components/ProjectSelection';
import DetailedAnalysis from './components/DetailedAnalysis';
import ProjectSites from './components/ProjectSites';
import ProjectSpending from './components/ProjectSpending';
import {
  getAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../utils/apiRequests/api';
import SubmitForReview from './components/SubmitForReview';
import { useRouter } from 'next/router';
import i18next from '../../../../i18n';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const { useTranslation } = i18next;

export default function ManageProjects({ GUID, token, project }: any) {
  const { t, i18n, ready } = useTranslation(['manageProjects']);
  const { handleError } = React.useContext(ErrorHandlingContext);

  function getSteps() {
    return [
      ready ? t('manageProjects:basicDetails') : '',
      ready ? t('manageProjects:projectMedia') : '',
      ready ? t('manageProjects:detailedAnalysis') : '',
      ready ? t('manageProjects:projectSites') : '',
      ready ? t('manageProjects:projectSpending') : '',
      ready ? t('manageProjects:review') : '',
    ];
  }
  const [activeStep, setActiveStep] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [tabSelected, setTabSelected] = React.useState(0);
  const steps = getSteps();
  const [isUploadingData, setIsUploadingData] = React.useState(false);

  /**
   * * for moving next tab
   */
  const handleNext = () => {
    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setTabSelected((prevTabSelected) => prevTabSelected + 1);
  };

  /**
   * *for moving previous tab
   */
  const handleBack = () => {
    setTabSelected((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (message) => {
    setErrorMessage(message);
    setActiveStep(0);
  };

  const [projectGUID, setProjectGUID] = React.useState(GUID ? GUID : '');
  const [projectDetails, setProjectDetails] = React.useState(
    project ? project : {}
  );
  const router = useRouter();

  const submitForReview = () => {
    setIsUploadingData(true);
    const submitData = {
      reviewRequested: true,
    };
    putAuthenticatedRequest(
      `/app/projects/${projectGUID}`,
      submitData,
      token,
      handleError
    ).then((res) => {
      if (!res.code) {
        setProjectDetails(res);
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

  React.useEffect(() => {
    // Fetch details of the project
    if (projectGUID && token)
      getAuthenticatedRequest(
        `/app/profile/projects/${projectGUID}`,
        token,
        {},
        handleError,
        '/profile'
      ).then((result) => {
        setProjectDetails(result);
      });
  }, [GUID, projectGUID]);

  const [userLang, setUserLang] = React.useState('en');
  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, []);

  React.useEffect(() => {
    if (router.query.purpose) {
      handleNext();
    }
  }, [router]);

  const matches = useMediaQuery('(max-width:600px)');
  function getStepContent(step: number) {
    console.log(step);
    switch (step) {
      case 0:
        return <ProjectSelection />;
      case 1:
        return (
          <BasicDetails
            handleNext={handleNext}
            token={token}
            projectDetails={projectDetails}
            setProjectDetails={setProjectDetails}
            errorMessage={errorMessage}
            setProjectGUID={setProjectGUID}
            projectGUID={projectGUID}
            setErrorMessage={setErrorMessage}
            purpose={
              project?.purpose ? project?.purpose : router.query?.purpose
            }
          />
        );
      case 2:
        return (
          <ProjectMedia
            handleNext={handleNext}
            token={token}
            handleBack={handleBack}
            projectDetails={projectDetails}
            setProjectDetails={setProjectDetails}
            projectGUID={projectGUID}
            handleReset={handleReset}
          />
        );
      case 3:
        return (
          <DetailedAnalysis
            userLang={userLang}
            handleNext={handleNext}
            token={token}
            handleBack={handleBack}
            projectDetails={projectDetails}
            setProjectDetails={setProjectDetails}
            projectGUID={projectGUID}
            handleReset={handleReset}
            purpose={
              project?.purpose ? project?.purpose : router.query?.purpose
            }
          />
        );
      case 4:
        return (
          <ProjectSites
            handleNext={handleNext}
            token={token}
            handleBack={handleBack}
            projectGUID={projectGUID}
            handleReset={handleReset}
          />
        );
      case 5:
        return (
          <ProjectSpending
            userLang={userLang}
            handleNext={handleNext}
            token={token}
            handleBack={handleBack}
            projectGUID={projectGUID}
            handleReset={handleReset}
          />
        );
      case 6:
        return (
          <SubmitForReview
            handleBack={handleBack}
            projectDetails={projectDetails}
            submitForReview={submitForReview}
            isUploadingData={isUploadingData}
            projectGUID={projectGUID}
            handleReset={handleReset}
          />
        );
      default:
        return <ProjectSelection />;
    }
  }

  const handleChange = (e: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue < 1) {
      e.preventDefault();
      return;
    }
    setTabSelected(newValue);
  };

  return ready ? (
    <div
      className={styles.mainContainer}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className={'project-form-flow'}>
        <div style={{ display: 'flex' }}>
          <Tabs
            value={tabSelected}
            onChange={handleChange}
            orientation={matches ? 'horizontal' : 'vertical'}
            variant="scrollable"
            className={'custom-tab'}
          >
            <Tab
              label={t('manageProjects:projectType')}
              className={'tab-flow'}
            ></Tab>
            <Tab
              label={t('manageProjects:basicDetails')}
              className={'tab-flow'}
            ></Tab>
            <Tab
              label={t('manageProjects:projectMedia')}
              className={'tab-flow'}
            ></Tab>
            <Tab
              label={t('manageProjects:detailedAnalysis')}
              className={'tab-flow'}
            />
            <Tab
              label={t('manageProjects:projectSites')}
              className={'tab-flow'}
            />
            <Tab
              label={t('manageProjects:projectSpending')}
              className={'tab-flow'}
            />
            <Tab label={t('manageProjects:review')} className={'tab-flow'} />
          </Tabs>
        </div>
        <div
          style={{
            marginTop: '40px',
            width: '1000px',
            display: 'flex',
          }}
        >
          {getStepContent(tabSelected)}
        </div>
      </div>
    </div>
  ) : null;
}

import React from 'react';
import { Tabs, Tab } from '@mui/material';
import BasicDetails from './components/BasicDetails';
import styles from './StepForm.module.scss';
import ProjectMedia from './components/ProjectMedia';
import ProjectSelection from './components/ProjectSelection';
import DetailedAnalysis from './components/DetailedAnalysis';
import ProjectSites from './components/ProjectSites';
import ProjectSpending from './components/ProjectSpending';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import {
  getAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../utils/apiRequests/api';
import SubmitForReview from './components/SubmitForReview';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';

export default function ManageProjects({ GUID, token, project }: any) {
  const { t, ready } = useTranslation(['manageProjects']);
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();
  const router = useRouter();

  const [activeStep, setActiveStep] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [tabSelected, setTabSelected] = React.useState(0);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [projectGUID, setProjectGUID] = React.useState(GUID ? GUID : '');
  const [projectDetails, setProjectDetails] = React.useState(
    project ? project : {}
  );

  const formRouteHandler = (val) => {
    if (router.query.purpose) return;
    switch (val) {
      case 1:
        router.push(`/profile/projects/${projectGUID}?type=basic-details`);

        break;
      case 2:
        router.push(`/profile/projects/${projectGUID}?type=media`);

        break;
      case 3:
        router.push(`/profile/projects/${projectGUID}?type=detail-analysis`);

        break;
      case 4:
        router.push(`/profile/projects/${projectGUID}?type=project-sites`);

        break;
      case 5:
        router.push(`/profile/projects/${projectGUID}?type=project-spendings`);

        break;
      case 6:
        router.push(`/profile/projects/${projectGUID}?type=review`);

        break;
      default:
        break;
    }
  };

  // for moving next tab
  const handleNext = () => {
    formRouteHandler(tabSelected + 1);
    setTabSelected((prevTabSelected) => prevTabSelected + 1);
  };

  //for moving previous tab
  const handleBack = () => {
    formRouteHandler(tabSelected - 1);
    setTabSelected((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (message) => {
    setErrorMessage(message);
    setActiveStep(0);
  };

  const handleChange = (e: React.ChangeEvent<{}>, newValue: number) => {
    //restrict the access of Tab
    if (router.asPath === '/profile/projects/new-project') {
      e.preventDefault();
      return;
    }
    //show the same route as respective form

    formRouteHandler(newValue);

    //if project selected don't let it change
    if (newValue < 1) {
      e.preventDefault();
      return;
    }

    //if the Project is not created then lock it to basic details
    if (projectGUID === '') {
      e.preventDefault();
      return;
    }
    setTabSelected(newValue);
    //for getting access to other tab for edit of individual project
    if (router.query.id) {
      setTabSelected(newValue);
    }

    // A project type should be selected to move to the next step
    if (!router.query.purpose) {
      return;
    }

    if (router.query.id) {
      handleNext();
    }
  };
  const submitForReview = async () => {
    setIsUploadingData(true);
    const submitData = {
      reviewRequested: true,
    };

    try {
      const res = await putAuthenticatedRequest(
        `/app/projects/${projectGUID}`,
        submitData,
        token,
        logoutUser
      );
      setProjectDetails(res);
      setErrorMessage('');
      setIsUploadingData(false);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const handlePublishChange = async (val) => {
    setIsUploadingData(true);
    const submitData = {
      publish: val,
    };

    try {
      const res = await putAuthenticatedRequest(
        `/app/projects/${projectGUID}`,
        submitData,
        token,
        logoutUser
      );
      setProjectDetails(res);
      setErrorMessage('');
      setIsUploadingData(false);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  React.useEffect(() => {
    // Fetch details of the project

    const fetchProjectDetails = async () => {
      try {
        const res = await getAuthenticatedRequest(
          `/app/profile/projects/${projectGUID}`,
          token,
          logoutUser
        );
        setProjectDetails(res);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/profile');
      }
    };

    if (projectGUID && token) {
      fetchProjectDetails();
    }
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

  React.useEffect(() => {
    switch (router.query.type) {
      case 'basic-details':
        setTabSelected(1);
        break;
      case 'media':
        setTabSelected(2);
        break;
      case 'detail-analysis':
        setTabSelected(3);
        break;
      case 'project-sites':
        setTabSelected(4);
        break;
      case 'project-spendings':
        setTabSelected(5);
        break;
      case 'review':
        setTabSelected(6);
        break;
      default:
        null;
    }
  }, [router.query.screen]);

  function getStepContent(step: number) {
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
            setProjectGUID={setProjectGUID}
            projectGUID={projectGUID}
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
            projectDetails={projectDetails}
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
            handlePublishChange={handlePublishChange}
          />
        );
      default:
        return <ProjectSelection />;
    }
  }

  return ready ? (
    <div
      className={styles.mainContainer}
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      <div className={'project-form-flow'} style={{ display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            flexBasis: '10%',
            flexDirection: 'column',
          }}
        >
          <div className="tab-box">
            <Tabs
              value={tabSelected}
              onChange={handleChange}
              orientation={'vertical'}
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

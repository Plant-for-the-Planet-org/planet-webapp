import React from 'react';
import { Tabs, Tab } from '@mui/material';
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
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import Grid from '@mui/material/Grid';
import TabbedView from '../../common/Layout/TabbedView';
import DashboardView from '../../common/Layout/DashboardView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';

export enum ProjectCreationTabs {
  PROJECT_TYPE = 0,
  BASIC_DETAILS = 1,
  PROJECT_MEDIA = 2,
  DETAILED_ANALYSIS = 3,
  PROJECT_SITES = 4,
  PROJECT_SPENDING = 5,
  REVIEW = 6,
}
export default function ManageProjects({ GUID, token, project, step }: any) {
  const { t, ready } = useTranslation(['manageProjects']);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const router = useRouter();

  const [activeStep, setActiveStep] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [tabSelected, setTabSelected] = React.useState(0);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [projectGUID, setProjectGUID] = React.useState(GUID ? GUID : '');
  const [tablist, setTabList] = React.useState<TabItem[]>([]);
  const [projectDetails, setProjectDetails] = React.useState(
    project ? project : {}
  );

  // const formRouteHandler = (val) => {
  //   if (router.query.purpose) return;
  //   switch (val) {
  //     case 1:
  //       router.push(`/profile/projects/${projectGUID}?type=basic-details`);

  //       break;
  //     case 2:
  //       router.push(`/profile/projects/${projectGUID}?type=media`);

  //       break;
  //     case 3:
  //       router.push(`/profile/projects/${projectGUID}?type=detail-analysis`);

  //       break;
  //     case 4:
  //       router.push(`/profile/projects/${projectGUID}?type=project-sites`);

  //       break;
  //     case 5:
  //       router.push(`/profile/projects/${projectGUID}?type=project-spendings`);

  //       break;
  //     case 6:
  //       router.push(`/profile/projects/${projectGUID}?type=review`);

  //       break;
  //     default:
  //       break;
  //   }
  // };

  // for moving next tab
  // const handleNext = () => {
  //   formRouteHandler(tabSelected + 1);
  //   setTabSelected((prevTabSelected) => prevTabSelected + 1);
  // };

  //for moving previous tab
  // const handleBack = () => {
  //   formRouteHandler(tabSelected - 1);
  //   setTabSelected((prevActiveStep) => prevActiveStep - 1);
  // };

  const handleReset = (message) => {
    setErrorMessage(message);
    setActiveStep(0);
  };

  // const handleChange = (e: React.ChangeEvent<{}>, newValue: number) => {
  //   //restrict the access of Tab
  //   if (router.asPath === '/profile/projects/new-project') {
  //     e.preventDefault();
  //     return;
  //   }
  //   //show the same route as respective form

  //   formRouteHandler(newValue);

  //   //if project selected don't let it change
  //   if (newValue < 1) {
  //     e.preventDefault();
  //     return;
  //   }

  //   //if the Project is not created then lock it to basic details
  //   if (projectGUID === '') {
  //     e.preventDefault();
  //     return;
  //   }
  //   setTabSelected(newValue);
  //   //for getting access to other tab for edit of individual project
  //   if (router.query.id) {
  //     setTabSelected(newValue);
  //   }

  //   // A project type should be selected to move to the next step
  //   if (!router.query.purpose) {
  //     return;
  //   }

  //   if (router.query.id) {
  //     handleNext();
  //   }
  // };
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

  const handlePublishChange = (val) => {
    const submitData = {
      publish: val,
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

  // React.useEffect(() => {
  //   if (router.query.purpose) {
  //     handleNext();
  //   }
  // }, [router]);

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

  React.useEffect(() => {
    if (router.query.purpose) {
      setTabList([
        {
          label: t('manageProjects:basicDetails'),
          link: '/profile/projects/new-project?purpose=trees',
          step: ProjectCreationTabs.BASIC_DETAILS,
        },
        {
          label: t('manageProjects:projectMedia'),
          link: `/profile/projects/${projectGUID}?type=media`,
          step: ProjectCreationTabs.PROJECT_MEDIA,
        },
        {
          label: t('manageProjects:detailedAnalysis'),
          link: `/profile/projects/${projectGUID}?type=detail-analysis`,
          step: ProjectCreationTabs.DETAILED_ANALYSIS,
        },
        {
          label: t('manageProjects:projectSites'),
          link: `/profile/projects/${projectGUID}?type=project-sites`,
          step: ProjectCreationTabs.PROJECT_SITES,
        },
        {
          label: t('manageProjects:projectSpending'),
          link: `/profile/projects/${projectGUID}?type=review`,
          step: ProjectCreationTabs.PROJECT_SPENDING,
        },
      ]);
    } else if (router.query.type === '') {
      setTabList([
        {
          label: t('manageProjects:basicDetails'),
          link: '/profile/projects/new-project?purpose=trees',
          step: ProjectCreationTabs.BASIC_DETAILS,
        },
      ]);
    } else {
      setTabList([
        {
          label: t('manageProjects:projectType'),
          link: '/profile/projects/new-project',
          step: ProjectCreationTabs.PROJECT_TYPE,
        },
      ]);
    }
  }, [router.query.purpose]);

  function getStepContent() {
    switch (step) {
      case ProjectCreationTabs.PROJECT_TYPE:
        return <ProjectSelection />;
      case ProjectCreationTabs.BASIC_DETAILS:
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
      case ProjectCreationTabs.PROJECT_MEDIA:
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
      case ProjectCreationTabs.DETAILED_ANALYSIS:
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
      case ProjectCreationTabs.PROJECT_SITES:
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
      case ProjectCreationTabs.PROJECT_SPENDING:
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
      case ProjectCreationTabs.REVIEW:
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

  // return ready ? (
  //   <Grid container spacing={2}>
  //     <Grid item xs={12} sm={3} lg={2}>
  //       <Tabs
  //         value={tabSelected}
  //         onChange={handleChange}
  //         orientation={'vertical'}
  //         variant="scrollable"
  //         className={'custom-tab'}
  //       >
  //         <Tab
  //           label={t('manageProjects:projectType')}
  //           className={'tab-flow'}
  //         ></Tab>
  //         <Tab
  //           label={t('manageProjects:basicDetails')}
  //           className={'tab-flow'}
  //         ></Tab>
  //         <Tab
  //           label={t('manageProjects:projectMedia')}
  //           className={'tab-flow'}
  //         ></Tab>
  //         <Tab
  //           label={t('manageProjects:detailedAnalysis')}
  //           className={'tab-flow'}
  //         />
  //         <Tab
  //           label={t('manageProjects:projectSites')}
  //           className={'tab-flow'}
  //         />
  //         <Tab
  //           label={t('manageProjects:projectSpending')}
  //           className={'tab-flow'}
  //         />
  //         <Tab label={t('manageProjects:review')} className={'tab-flow'} />
  //       </Tabs>
  //     </Grid>
  //     <Grid item xs={12} sm={18} lg={6}>
  //       {getStepContent(tabSelected)}
  //     </Grid>
  //   </Grid>
  // ) : null;

  return (
    <DashboardView
      title={t('manageProjects:addNewProject')}
      subtitle={
        <div className={'add-project-title'}>
          {t('manageProjects:addProjetDescription')}
          <p>
            {t('manageProjects:addProjetContact')}{' '}
            <span>{t('manageProjects:supportLink')}</span>
          </p>
        </div>
      }
    >
      <TabbedView step={step} tabItems={tablist}>
        {getStepContent()}
      </TabbedView>
    </DashboardView>
  );
}

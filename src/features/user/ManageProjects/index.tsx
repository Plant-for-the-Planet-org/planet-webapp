import React from 'react';
import BasicDetails from './components/BasicDetails';
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
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';

export enum ProjectCreationTabs {
  PROJECT_TYPE = 0,
  BASIC_DETAILS = 1,
  PROJECT_MEDIA = 2,
  DETAILED_ANALYSIS = 3,
  PROJECT_SITES = 4,
  PROJECT_SPENDING = 5,
  REVIEW = 6,
}
export default function ManageProjects({ GUID, token, project }: any) {
  const { t, ready, i18n } = useTranslation(['manageProjects']);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const { impersonatedEmail } = React.useContext(UserPropsContext);
  const router = useRouter();

  const [activeStep, setActiveStep] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [tabSelected, setTabSelected] = React.useState<number | string>('');
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [projectGUID, setProjectGUID] = React.useState(GUID ? GUID : '');
  const [tablist, setTabList] = React.useState<TabItem[]>([]);
  const [projectDetails, setProjectDetails] = React.useState(
    project ? project : {}
  );

  const formRouteHandler = (val: number) => {
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
  const handleNext = (nextTab: number): void => {
    formRouteHandler(nextTab);
  };
  //for moving previous tab
  const handleBack = (previousTab: number): void => {
    formRouteHandler(previousTab);
  };

  const handleReset = (message: string) => {
    setErrorMessage(message);
    setActiveStep(0);
  };

  const submitForReview = () => {
    setIsUploadingData(true);
    const submitData = {
      reviewRequested: true,
    };
    putAuthenticatedRequest(
      `/app/projects/${projectGUID}`,
      submitData,
      token,
      impersonatedEmail,
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
      impersonatedEmail,
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
        impersonatedEmail,
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
      setTabSelected(1);
    }

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
  }, [tabSelected, router.query.type]);

  React.useEffect(() => {
    if (router.query.type && project) {
      setTabList([
        {
          label: t('manageProjects:basicDetails'),
          link: `/profile/projects/${projectGUID}?type=basic-details`,
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
          link: `/profile/projects/${projectGUID}?type=project-spendings`,
          step: ProjectCreationTabs.PROJECT_SPENDING,
        },
        {
          label: t('manageProjects:review'),
          link: `/profile/projects/${projectGUID}?type=review`,
          step: ProjectCreationTabs.REVIEW,
        },
      ]);
    } else if (router.query.purpose === 'trees' && !project) {
      setTabList([
        {
          label: t('manageProjects:basicDetails'),
          link: '/profile/projects/new-project?purpose=trees',
          step: ProjectCreationTabs.BASIC_DETAILS,
        },
      ]);
    } else if (router.query.purpose === 'conservation' && !project) {
      setTabList([
        {
          label: t('manageProjects:basicDetails'),
          link: '/profile/projects/new-project?purpose=conservation',
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
  }, [tabSelected, router.query.purpose, i18n?.language]);

  function getStepContent() {
    switch (tabSelected) {
      case ProjectCreationTabs.PROJECT_TYPE:
        return <ProjectSelection setTabSelected={setTabSelected} />;
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
        return <ProjectSelection setTabSelected={setTabSelected} />;
    }
  }

  return (
    <TabbedView step={tabSelected} tabItems={tablist}>
      {getStepContent()}
    </TabbedView>
  );
}

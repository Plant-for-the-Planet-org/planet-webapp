import React from 'react';
import BasicDetails from './components/BasicDetails';
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
import { useLocale, useTranslations } from 'next-intl';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import TabbedView from '../../common/Layout/TabbedView';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import { handleError, APIError } from '@planet-sdk/common';
import DashboardView from '../../common/Layout/DashboardView';
import {
  ManageProjectsProps,
  ProfileProjectTrees,
  ProfileProjectConservation,
} from '../../common/types/project';
import { useTenant } from '../../common/Layout/TenantContext';

export enum ProjectCreationTabs {
  PROJECT_TYPE = 0,
  BASIC_DETAILS = 1,
  PROJECT_MEDIA = 2,
  DETAILED_ANALYSIS = 3,
  PROJECT_SITES = 4,
  PROJECT_SPENDING = 5,
  REVIEW = 6,
}
export default function ManageProjects({
  GUID,
  token,
  project,
}: ManageProjectsProps) {
  const t = useTranslations('ManageProjects');
  const locale = useLocale();
  const { tenantConfig } = useTenant();
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();
  const router = useRouter();
  const [tabSelected, setTabSelected] = React.useState<number>(0);
  const [isUploadingData, setIsUploadingData] = React.useState<boolean>(false);
  const [projectGUID, setProjectGUID] = React.useState<string>(
    GUID ? GUID : ''
  );
  const [tablist, setTabList] = React.useState<TabItem[]>([]);
  const [projectDetails, setProjectDetails] = React.useState<
    ProfileProjectTrees | ProfileProjectConservation | null
  >(null);

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

  const submitForReview = async () => {
    setIsUploadingData(true);
    const submitData = {
      reviewRequested: true,
    };

    try {
      const res = await putAuthenticatedRequest<
        ProfileProjectTrees | ProfileProjectConservation
      >(
        tenantConfig?.id,
        `/app/projects/${projectGUID}`,
        submitData,
        token,
        logoutUser
      );
      setProjectDetails(res);
      setIsUploadingData(false);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const handlePublishChange = async (val: boolean) => {
    setIsUploadingData(true);
    const submitData = {
      publish: val,
    };

    try {
      const res = await putAuthenticatedRequest<
        ProfileProjectTrees | ProfileProjectConservation
      >(
        tenantConfig?.id,
        `/app/projects/${projectGUID}`,
        submitData,
        token,
        logoutUser
      );
      setProjectDetails(res);
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
        const res = await getAuthenticatedRequest<
          ProfileProjectTrees | ProfileProjectConservation
        >({
          tenant: tenantConfig?.id,
          url: `/app/profile/projects/${projectGUID}`,
          token,
          logoutUser,
        });
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
          label: t('basicDetails'),
          link: `/profile/projects/${projectGUID}?type=basic-details`,
          step: ProjectCreationTabs.BASIC_DETAILS,
        },
        {
          label: t('projectMedia'),
          link: `/profile/projects/${projectGUID}?type=media`,
          step: ProjectCreationTabs.PROJECT_MEDIA,
        },
        {
          label: t('detailedAnalysis'),
          link: `/profile/projects/${projectGUID}?type=detail-analysis`,
          step: ProjectCreationTabs.DETAILED_ANALYSIS,
        },
        {
          label: t('projectSites'),
          link: `/profile/projects/${projectGUID}?type=project-sites`,
          step: ProjectCreationTabs.PROJECT_SITES,
        },
        {
          label: t('projectSpending'),
          link: `/profile/projects/${projectGUID}?type=project-spendings`,
          step: ProjectCreationTabs.PROJECT_SPENDING,
        },
        {
          label: t('review'),
          link: `/profile/projects/${projectGUID}?type=review`,
          step: ProjectCreationTabs.REVIEW,
        },
      ]);
    } else if (router.query.purpose === 'trees' && !project) {
      setTabList([
        {
          label: t('basicDetails'),
          link: '/profile/projects/new-project?purpose=trees',
          step: ProjectCreationTabs.BASIC_DETAILS,
        },
      ]);
    } else if (router.query.purpose === 'conservation' && !project) {
      setTabList([
        {
          label: t('basicDetails'),
          link: '/profile/projects/new-project?purpose=conservation',
          step: ProjectCreationTabs.BASIC_DETAILS,
        },
      ]);
    } else {
      setTabList([
        {
          label: t('projectType'),
          link: '/profile/projects/new-project',
          step: ProjectCreationTabs.PROJECT_TYPE,
        },
      ]);
    }
  }, [tabSelected, router.query.purpose, locale]);

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
            setProjectGUID={setProjectGUID}
            projectGUID={projectGUID}
            purpose={
              project !== undefined
                ? project.purpose
                : router.query.purpose === 'conservation'
                ? 'conservation'
                : 'trees'
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
          />
        );
      case ProjectCreationTabs.REVIEW:
        if (projectDetails && projectGUID)
          return (
            <SubmitForReview
              handleBack={handleBack}
              projectDetails={projectDetails}
              submitForReview={submitForReview}
              isUploadingData={isUploadingData}
              handlePublishChange={handlePublishChange}
            />
          );
        break;
      default:
        return <ProjectSelection setTabSelected={setTabSelected} />;
    }
  }

  return (
    <DashboardView
      title={project && projectGUID ? project.name : t('addNewProject')}
      subtitle={
        projectGUID ? (
          t('onlyEnglish')
        ) : (
          <div>
            <div>{t('addProjetDescription')}</div>
            <div>
              {t.rich('createProjectsEnglishOnly', {
                noteLabel: (chunk) => <strong>{chunk}</strong>,
              })}
            </div>
            <div>
              {t.rich('contactSupportEmail', {
                supportLink: (chunk) => (
                  <a
                    className="planet-links"
                    href="mailto:support@plant-for-the-planet.org"
                  >
                    {chunk}
                  </a>
                ),
              })}
            </div>
          </div>
        )
      }
    >
      <TabbedView step={tabSelected} tabItems={tablist}>
        {getStepContent()}
      </TabbedView>
    </DashboardView>
  );
}

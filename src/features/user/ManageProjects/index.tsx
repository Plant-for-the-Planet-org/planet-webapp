import type { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import type { APIError } from '@planet-sdk/common';
import type {
  ManageProjectsProps,
  ExtendedProfileProjectProperties,
} from '../../common/types/project';

import { useEffect, useState } from 'react';
import BasicDetails from './components/BasicDetails';
import ProjectMedia from './components/ProjectMedia';
import ProjectSelection from './components/ProjectSelection';
import DetailedAnalysis from './components/DetailedAnalysis';
import ProjectSites from './components/ProjectSites';
import ProjectSpending from './components/ProjectSpending';
import ProjectQuestionnaire from './components/ProjectQuestionnaire';
import SubmitForReview from './components/SubmitForReview';
import { useRouter } from 'next/router';
import { useLocale, useTranslations } from 'next-intl';
import TabbedView from '../../common/Layout/TabbedView';
import { parseApiError } from '../../../utils/parseApiError';
import DashboardView from '../../common/Layout/DashboardView';
import { useApi } from '../../../hooks/useApi';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { useErrorHandlingStore } from '../../../stores/errorHandlingStore';

function isDetailedAnalysisComplete(
  details: ExtendedProfileProjectProperties | null
): boolean {
  if (!details || !details.metadata) return false;
  if (!details.metadata.mainChallenge) return false;
  if (!details.metadata.motivation) return false;
  if (!details.metadata.siteOwnerName) return false;
  if (details.purpose === 'trees') {
    const m = details.metadata;
    if (!m.mainInterventions?.length) return false;
    if (!m.employeesCount) return false;
    if (!m.longTermPlan) return false;
    if (!m.ecosystem) return false;
    if (!m.plantingDensity) return false;
    if (!m.degradationCause) return false;
    if (!m.siteOwnerType?.length) return false;
  } else {
    const m = details.metadata;
    if (!m.ecosystem) return false;
    if (!m.areaProtected) return false;
    if (!m.startingProtectionYear) return false;
    if (!m.ownershipType) return false;
    if (!m.landOwnershipType?.length) return false;
    if (!m.actions) return false;
  }
  return true;
}

export enum ProjectCreationTabs {
  PROJECT_TYPE = 0,
  BASIC_DETAILS = 1,
  PROJECT_MEDIA = 2,
  DETAILED_ANALYSIS = 3,
  PROJECT_SITES = 4,
  PROJECT_SPENDING = 5,
  QUESTIONNAIRE = 6,
  REVIEW = 7,
}


type PublishStatusApiPayload = {
  publish: boolean;
};

export default function ManageProjects({
  GUID,
  token,
  project,
}: ManageProjectsProps) {
  const t = useTranslations('ManageProjects');
  const locale = useLocale();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { putApiAuthenticated, postApiAuthenticated, getApiAuthenticated } = useApi();
  // local state
  const [tabSelected, setTabSelected] = useState<number>(0);
  const [isUploadingData, setIsUploadingData] = useState<boolean>(false);
  const [projectGUID, setProjectGUID] = useState<string>(GUID ? GUID : '');
  const [tablist, setTabList] = useState<TabItem[]>([]);
  const [projectDetails, setProjectDetails] =
    useState<ExtendedProfileProjectProperties | null>(null);
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const formRouteHandler = (val: number) => {
    if (router.query.purpose) return;

    let path = '';

    switch (val) {
      case 1:
        path = `/profile/projects/${projectGUID}?type=basic-details`;
        break;
      case 2:
        path = `/profile/projects/${projectGUID}?type=media`;
        break;
      case 3:
        path = `/profile/projects/${projectGUID}?type=detail-analysis`;
        break;
      case 4:
        path = `/profile/projects/${projectGUID}?type=project-sites`;
        break;
      case 5:
        path = `/profile/projects/${projectGUID}?type=project-spending`;
        break;
      case 6:
        path = `/profile/projects/${projectGUID}?type=questionnaire`;
        break;
      case 7:
        path = `/profile/projects/${projectGUID}?type=review`;
        break;
      default:
        return;
    }

    router.push(localizedPath(path));
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
    try {
      const res = await postApiAuthenticated<
        ExtendedProfileProjectProperties,
        Record<string, never>
      >(`/app/projects/${projectGUID}/submit`, { payload: {} });
      setProjectDetails(res);
      setIsUploadingData(false);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(parseApiError(err as APIError));
    }
  };

  const handlePublishChange = async (val: boolean) => {
    setIsUploadingData(true);
    const publishStatusPayload = {
      publish: val,
    };

    try {
      const res = await putApiAuthenticated<
        ExtendedProfileProjectProperties,
        PublishStatusApiPayload
      >(`/app/projects/${projectGUID}`, {
        payload: publishStatusPayload,
      });
      setProjectDetails(res);
      setIsUploadingData(false);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(parseApiError(err as APIError));
    }
  };

  useEffect(() => {
    // Fetch details of the project
    const fetchProjectDetails = async () => {
      try {
        const res = await getApiAuthenticated<ExtendedProfileProjectProperties>(
          `/app/profile/projects/${projectGUID}`
        );
        setProjectDetails(res);
      } catch (err) {
        setErrors(parseApiError(err as APIError));
        router.push(localizedPath('/profile'));
      }
    };

    if (projectGUID && token) {
      fetchProjectDetails();
    }
  }, [GUID, projectGUID]);
  const [userLang, setUserLang] = useState('en');
  useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, []);

  useEffect(() => {
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
      case 'project-spending':
        setTabSelected(5);
        break;
      case 'questionnaire':
        setTabSelected(6);
        break;
      case 'review':
        setTabSelected(7);
        break;
      default:
        null;
    }
  }, [tabSelected, router.query.type]);

  const showQuestionnaire = projectDetails?.acceptDonations === true;

  useEffect(() => {
    if (router.query.type && project) {
      const tabs: TabItem[] = [
        {
          label: t('basicDetails'),
          link: `/profile/projects/${projectGUID}?type=basic-details`,
          step: ProjectCreationTabs.BASIC_DETAILS,
          completionStatus: 'complete',
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
          completionStatus: projectDetails
            ? isDetailedAnalysisComplete(projectDetails)
              ? 'complete'
              : 'incomplete'
            : undefined,
        },
        {
          label: t('projectSites'),
          link: `/profile/projects/${projectGUID}?type=project-sites`,
          step: ProjectCreationTabs.PROJECT_SITES,
        },
        {
          label: t('projectSpending'),
          link: `/profile/projects/${projectGUID}?type=project-spending`,
          step: ProjectCreationTabs.PROJECT_SPENDING,
        },
      ];
      if (showQuestionnaire) {
        tabs.push({
          label: t('questionnaire'),
          link: `/profile/projects/${projectGUID}?type=questionnaire`,
          step: ProjectCreationTabs.QUESTIONNAIRE,
          completionStatus: projectDetails
            ? questionnaireComplete
              ? 'complete'
              : 'incomplete'
            : undefined,
        });
      }
      tabs.push({
        label: t('review'),
        link: `/profile/projects/${projectGUID}?type=review`,
        step: ProjectCreationTabs.REVIEW,
      });
      setTabList(tabs);
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
  }, [tabSelected, router.query.purpose, locale, projectDetails?.acceptDonations, projectDetails, questionnaireComplete]);

  const isLocked =
    projectDetails?.verificationStatus === 'submitted' ||
    projectDetails?.verificationStatus === 'in_review';

  function getStepContent() {
    switch (tabSelected) {
      case ProjectCreationTabs.PROJECT_TYPE:
        return <ProjectSelection setTabSelected={setTabSelected} />;
      case ProjectCreationTabs.BASIC_DETAILS:
        return (
          <BasicDetails
            handleNext={handleNext}
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
            isLocked={isLocked}
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
            isLocked={isLocked}
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
            isLocked={isLocked}
            onCompletenessChange={() => {}}
          />
        );
      case ProjectCreationTabs.PROJECT_SITES:
        return (
          <ProjectSites
            handleNext={handleNext}
            handleBack={handleBack}
            projectGUID={projectGUID}
            projectDetails={projectDetails}
            isLocked={isLocked}
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
            isLocked={isLocked}
            verificationStatus={projectDetails?.verificationStatus}
          />
        );
      case ProjectCreationTabs.QUESTIONNAIRE:
        return (
          <ProjectQuestionnaire
            handleBack={handleBack}
            handleNext={handleNext}
            projectGUID={projectGUID}
            projectDetails={projectDetails}
            setProjectDetails={setProjectDetails}
            isLocked={isLocked}
            onCompletenessChange={setQuestionnaireComplete}
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
              isLocked={isLocked}
              sectionCompleteness={{
                detailedAnalysis: isDetailedAnalysisComplete(projectDetails),
                questionnaire: showQuestionnaire ? questionnaireComplete : null,
              }}
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
            <div>{t('addProjectDescription')}</div>
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

import type { ReactElement, ReactNode } from 'react';
import type { SubmitForReviewProps } from '../../../common/types/project';

import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import styles from './../StepForm.module.scss';
import SubmitForReviewImage from '../../../../../public/assets/images/icons/manageProjects/SubmitForReviewImage';
import UnderReview from '../../../../../public/assets/images/icons/manageProjects/UnderReview';
import { useTranslations } from 'next-intl';
import NotReviewed from '../../../../../public/assets/images/icons/manageProjects/NotReviewed';
import { Alert, Button, FormControlLabel, Stack } from '@mui/material';
import { ProjectCreationTabs } from '..';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import NewToggleSwitch from '../../../common/InputTypes/NewToggleSwitch';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';
import ProjectLockedBanner from './microComponent/ProjectLockedBanner';
import MissingFieldsSummary from './microComponent/MissingFieldsSummary';
import { fieldAnchorId } from '../utils/completeness';

const richTags = {
  bold: (chunks: ReactNode) => <strong>{chunks}</strong>,
  italic: (chunks: ReactNode) => <em>{chunks}</em>,
};

const requiredDocumentKeys = [
  'reviewDocuments.legalAccreditation',
  'reviewDocuments.organizationBylaws',
  'reviewDocuments.annualReport',
  'reviewDocuments.financialReport',
  'reviewDocuments.landTenureAgreements',
  'reviewDocuments.projectPlan',
] as const;

function SubmitForReview({
  submitForReview,
  handleBack,
  isUploadingData,
  projectDetails,
  handlePublishChange,
  isLocked,
  sectionCompleteness,
  projectGUID,
}: SubmitForReviewProps): ReactElement {
  const t = useTranslations('ManageProjects');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  const showQuestionnaire = projectDetails?.acceptDonations === true;
  // Documents shares the Questionnaire's visibility gate, and sits directly
  // before Review, so it is always the immediate previous step when shown.
  const backTab = showQuestionnaire
    ? ProjectCreationTabs.DOCUMENTS
    : ProjectCreationTabs.PROJECT_SPENDING;

  function UnderReviewComponent() {
    return (
      <CenteredContainer>
        <FormControlLabel
          label={
            <span className={styles.toggleText}>{t('publishProject')}</span>
          }
          labelPlacement="end"
          control={
            <NewToggleSwitch
              name="canPublish"
              id="publish"
              checked={projectDetails?.publish ?? false}
              onChange={(e) => handlePublishChange(e.target.checked)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          }
        />
        <div className={styles.reviewImageContainer}>
          <UnderReview />
        </div>
        <p className={styles.reviewMessage}>{t('projectUnderReview')}</p>

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(backTab)}
            variant="outlined"
            startIcon={<BackArrow />}
          >
            <p>{t(showQuestionnaire ? 'backToDocuments' : 'backToSpending')}</p>
          </Button>

          <Button
            variant="contained"
            onClick={() => router.push(localizedPath('/profile/projects'))}
          >
            <p>{t('exit')}</p>
          </Button>
        </div>
      </CenteredContainer>
    );
  }

  const daMissing = sectionCompleteness.detailedAnalysis;
  const questionnaireMissing = sectionCompleteness.questionnaire ?? [];
  const mediaIncomplete = sectionCompleteness.media === false;
  const sitesIncomplete = sectionCompleteness.sites === false;
  const canSubmit =
    daMissing.length === 0 &&
    questionnaireMissing.length === 0 &&
    !mediaIncomplete &&
    !sitesIncomplete;

  /** Deep link straight to the field, not just to the tab holding it. */
  const linkToTab = (tab: string) => (key: string) =>
    localizedPath(
      `/profile/projects/${projectGUID}?type=${tab}#${fieldAnchorId(key)}`
    );

  function IncompleteSections() {
    return (
      <>
        {mediaIncomplete && (
          <Alert severity="warning">{t('incompleteMedia')}</Alert>
        )}
        {sitesIncomplete && (
          <Alert severity="warning">{t('incompleteSites')}</Alert>
        )}
        <MissingFieldsSummary
          fields={daMissing}
          title={t('incompleteDetailedAnalysisCount', {
            count: daMissing.length,
          })}
          hrefFor={linkToTab('detail-analysis')}
          sx={{}}
        />
        <MissingFieldsSummary
          fields={questionnaireMissing}
          title={t('incompleteQuestionnaireCount', {
            count: questionnaireMissing.length,
          })}
          hrefFor={linkToTab('questionnaire')}
          sx={{}}
        />
      </>
    );
  }

  function NotSubmittedReview() {
    return (
      <CenteredContainer>
        <div>
          <div>{t.rich('dataReviewNote', richTags)}</div>
          <ul className={styles.listOfReport}>
            {requiredDocumentKeys.map((key) => (
              <li key={key}>{t.rich(key, richTags)}</li>
            ))}
          </ul>
          <div className={styles.checkInboxNote}>
            {t.rich('checkYourInbox', richTags)}
          </div>
        </div>
        <FormControlLabel
          label={
            <span className={styles.toggleText}>{t('publishProject')}</span>
          }
          labelPlacement="end"
          control={
            <NewToggleSwitch
              name="canPublish"
              id="publish"
              checked={projectDetails?.publish ?? false}
              onChange={(e) => handlePublishChange(e.target.checked)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          }
        />

        <div className={styles.reviewImageContainer}>
          <NotReviewed />
        </div>
        <Stack spacing={1} sx={{ width: '100%', mb: 2 }}>
          {canSubmit && (
            <Alert severity="success">{t('projectForReview')}</Alert>
          )}
          <IncompleteSections />
        </Stack>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="outlined"
            onClick={() => handleBack(backTab)}
            startIcon={<BackArrow />}
          >
            <p>{t(showQuestionnaire ? 'backToDocuments' : 'backToSpending')}</p>
          </Button>

          <Button
            onClick={() => submitForReview()}
            variant="contained"
            disabled={!canSubmit}
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('submitForReview')
            )}
          </Button>

          <Button
            variant="contained"
            onClick={() => router.push(localizedPath('/profile/projects'))}
          >
            <p>{t('exit')}</p>
          </Button>
        </div>
      </CenteredContainer>
    );
  }

  function AcceptedReview() {
    return (
      <CenteredContainer>
        <div className={styles.formFieldLarge}>
          <div className={styles.reviewImageContainer}>
            <SubmitForReviewImage />
          </div>
          <p className={styles.reviewMessage}>{t('acceptedReview')}</p>
        </div>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(backTab)}
            variant="outlined"
            startIcon={<BackArrow />}
          >
            <p>{t(showQuestionnaire ? 'backToDocuments' : 'backToSpending')}</p>
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push(localizedPath('/profile/projects'))}
          >
            <p>{t('exit')}</p>
          </Button>
        </div>
      </CenteredContainer>
    );
  }

  function DeniedReview() {
    return (
      <CenteredContainer>
        <div className={styles.formFieldLarge}>
          <div className={styles.reviewImageContainer}>
            <UnderReview />
          </div>
          <p className={styles.reviewMessage}>{t('deniedReview')}</p>
        </div>

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(backTab)}
            variant="outlined"
            startIcon={<BackArrow />}
          >
            <p>{t(showQuestionnaire ? 'backToDocuments' : 'backToSpending')}</p>
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push(localizedPath('/profile/projects'))}
          >
            <p>{t('exit')}</p>
          </Button>
        </div>
      </CenteredContainer>
    );
  }

  function LockedReviewComponent() {
    const verificationStatus = projectDetails?.verificationStatus ?? '';
    return (
      <CenteredContainer>
        <ProjectLockedBanner verificationStatus={verificationStatus} />
        <FormControlLabel
          label={
            <span className={styles.toggleText}>{t('publishProject')}</span>
          }
          labelPlacement="end"
          control={
            <NewToggleSwitch
              name="canPublish"
              id="publish"
              checked={projectDetails?.publish ?? false}
              onChange={(e) => handlePublishChange(e.target.checked)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              disabled
            />
          }
        />
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(backTab)}
            variant="outlined"
            startIcon={<BackArrow />}
          >
            <p>{t(showQuestionnaire ? 'backToDocuments' : 'backToSpending')}</p>
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push(localizedPath('/profile/projects'))}
          >
            <p>{t('exit')}</p>
          </Button>
        </div>
      </CenteredContainer>
    );
  }

  function RevisionRequestedComponent() {
    const revisionRequest = projectDetails?.revisionRequest;
    const annotations = revisionRequest?.annotations ?? {};

    const sectionTabs: { key: string; label: string; tab: number }[] = [
      {
        key: 'basic',
        label: t('basicDetails'),
        tab: ProjectCreationTabs.BASIC_DETAILS,
      },
      {
        key: 'metadata',
        label: t('detailedAnalysis'),
        tab: ProjectCreationTabs.DETAILED_ANALYSIS,
      },
      {
        key: 'questionnaire',
        label: t('questionnaire'),
        tab: ProjectCreationTabs.QUESTIONNAIRE,
      },
    ];

    const affectedSections = sectionTabs.filter(({ key }) =>
      Object.keys(annotations).some((path) => path.startsWith(`${key}.`))
    );

    return (
      <CenteredContainer>
        <Stack spacing={2} sx={{ width: '100%', mb: 2 }}>
          <Alert severity="warning">{t('revisionRequestedMessage')}</Alert>
          {revisionRequest?.globalAnnotation && (
            <Alert severity="warning">
              <strong>{t('globalAnnotationLabel')}:</strong>{' '}
              {revisionRequest.globalAnnotation}
            </Alert>
          )}
          {affectedSections.length > 0 && (
            <Alert severity="info">
              <strong>{t('sectionsRequiringRevision')}:</strong>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {affectedSections.map(({ key, label, tab }) => {
                  const fieldAnnotations = Object.entries(annotations).filter(
                    ([path]) => path.startsWith(`${key}.`)
                  );
                  return (
                    <div key={key}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleBack(tab)}
                        sx={{ mr: 1, mb: 0.5 }}
                      >
                        {label}
                      </Button>
                      <Stack spacing={0.5} sx={{ mt: 0.5, pl: 1 }}>
                        {fieldAnnotations.map(([path, note]) => (
                          <div key={path}>
                            <strong>
                              {path.split('.').slice(1).join('.')}
                            </strong>
                            : {note}
                          </div>
                        ))}
                      </Stack>
                    </div>
                  );
                })}
              </Stack>
            </Alert>
          )}
          <IncompleteSections />
          {canSubmit && (
            <Alert severity="success">{t('projectForReview')}</Alert>
          )}
        </Stack>

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="outlined"
            onClick={() => handleBack(backTab)}
            startIcon={<BackArrow />}
          >
            <p>{t(showQuestionnaire ? 'backToDocuments' : 'backToSpending')}</p>
          </Button>
          <Button
            onClick={() => submitForReview()}
            variant="contained"
            disabled={!canSubmit}
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('resubmitForReview')
            )}
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push(localizedPath('/profile/projects'))}
          >
            <p>{t('exit')}</p>
          </Button>
        </div>
      </CenteredContainer>
    );
  }

  switch (projectDetails?.verificationStatus) {
    case 'draft':
    case 'incomplete':
      return <NotSubmittedReview />;
    case 'submitted':
    case 'in_review':
      return <LockedReviewComponent />;
    case 'pending':
      return <UnderReviewComponent />;
    case 'processing':
      return <UnderReviewComponent />;
    case 'revision_requested':
      return <RevisionRequestedComponent />;
    case 'accepted':
      return <AcceptedReview />;
    case 'rejected':
    case 'denied':
      return <DeniedReview />;
    default:
      return <UnderReviewComponent />;
  }
}

export default SubmitForReview;

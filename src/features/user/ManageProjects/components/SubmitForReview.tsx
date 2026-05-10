import type { ReactElement } from 'react';
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

function SubmitForReview({
  submitForReview,
  handleBack,
  isUploadingData,
  projectDetails,
  handlePublishChange,
  isLocked,
  sectionCompleteness,
}: SubmitForReviewProps): ReactElement {
  const t = useTranslations('ManageProjects');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  const showQuestionnaire = projectDetails?.acceptDonations === true;
  const backTab = showQuestionnaire
    ? ProjectCreationTabs.QUESTIONNAIRE
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
            <p>{t(showQuestionnaire ? 'backToQuestionnaire' : 'backToSpending')}</p>
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

  const daIncomplete = !sectionCompleteness.detailedAnalysis;
  const qIncomplete =
    sectionCompleteness.questionnaire !== null &&
    !sectionCompleteness.questionnaire;
  const canSubmit = !daIncomplete && !qIncomplete;

  function NotSubmittedReview() {
    return (
      <CenteredContainer>
        <div>
          <div>
            {t.rich('reviewNote', {
              bold: (chunks) => <strong>{chunks}</strong>,
            })}
          </div>
          <ul className={styles.listOfReport}>
            <li>{t('legalAccreditation')}</li>
            <li>{t('taxExemption')}</li>
            <li>{t('annualReport')}</li>
            <li>{t('financialReport')}</li>
            <li>{t('PlantingReport')}</li>
          </ul>
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
          {daIncomplete && (
            <Alert severity="warning">{t('incompleteDetailedAnalysis')}</Alert>
          )}
          {qIncomplete && (
            <Alert severity="warning">{t('incompleteQuestionnaire')}</Alert>
          )}
        </Stack>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="outlined"
            onClick={() => handleBack(backTab)}
            startIcon={<BackArrow />}
          >
            <p>{t(showQuestionnaire ? 'backToQuestionnaire' : 'backToSpending')}</p>
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
            <p>{t(showQuestionnaire ? 'backToQuestionnaire' : 'backToSpending')}</p>
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
            <p>{t(showQuestionnaire ? 'backToQuestionnaire' : 'backToSpending')}</p>
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
            <p>{t(showQuestionnaire ? 'backToQuestionnaire' : 'backToSpending')}</p>
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
      { key: 'basic', label: t('basicDetails'), tab: ProjectCreationTabs.BASIC_DETAILS },
      { key: 'metadata', label: t('detailedAnalysis'), tab: ProjectCreationTabs.DETAILED_ANALYSIS },
      { key: 'questionnaire', label: t('questionnaire'), tab: ProjectCreationTabs.QUESTIONNAIRE },
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
                            <strong>{path.split('.').slice(1).join('.')}</strong>: {note}
                          </div>
                        ))}
                      </Stack>
                    </div>
                  );
                })}
              </Stack>
            </Alert>
          )}
          {daIncomplete && (
            <Alert severity="warning">{t('incompleteDetailedAnalysis')}</Alert>
          )}
          {qIncomplete && (
            <Alert severity="warning">{t('incompleteQuestionnaire')}</Alert>
          )}
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
            <p>{t(showQuestionnaire ? 'backToQuestionnaire' : 'backToSpending')}</p>
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
    case 'denied':
      return <DeniedReview />;
    default:
      return <UnderReviewComponent />;
  }
}

export default SubmitForReview;

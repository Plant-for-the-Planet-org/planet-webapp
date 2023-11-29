import React, { ReactElement } from 'react';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import styles from './../StepForm.module.scss';
import SubmitForReviewImage from '../../../../../public/assets/images/icons/manageProjects/SubmitForReviewImage';
import UnderReview from '../../../../../public/assets/images/icons/manageProjects/UnderReview';
import { useTranslation, Trans } from 'next-i18next';
import NotReviewed from '../../../../../public/assets/images/icons/manageProjects/NotReviewed';
import router from 'next/router';
import { Button, FormControlLabel, Switch } from '@mui/material';
import { ProjectCreationTabs } from '..';
import { SubmitForReviewProps } from '../../../common/types/project';
import CenteredContainer from '../../../common/Layout/CenteredContainer';

function SubmitForReview({
  submitForReview,
  handleBack,
  isUploadingData,
  projectDetails,
  handlePublishChange,
}: SubmitForReviewProps): ReactElement {
  const { t, ready } = useTranslation(['manageProjects']);
  function UnderReviewComponent() {
    return (
      <CenteredContainer>
        <FormControlLabel
          label={t('manageProjects:publishProject')}
          labelPlacement="end"
          control={
            <Switch
              name="canPublish"
              id="publish"
              checked={projectDetails?.publish}
              onChange={(e) => handlePublishChange(e.target.checked)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          }
        />
        <div className={styles.reviewImageContainer}>
          <UnderReview />
        </div>
        <p className={styles.reviewMessage}>
          {t('manageProjects:projectUnderReview')}
        </p>

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            variant="outlined"
            startIcon={<BackArrow />}
          >
            <p>{t('manageProjects:backToSpending')}</p>
          </Button>

          <Button
            variant="contained"
            onClick={() => router.push('/profile/projects')}
          >
            <p>{t('manageProjects:exit')}</p>
          </Button>
        </div>
      </CenteredContainer>
    );
  }

  function NotSubmittedReview() {
    return (
      <CenteredContainer>
        <div>
          <div>
            <Trans
              i18nKey="manageProjects:reviewNote"
              components={{ bold: <strong /> }}
            />
          </div>
          <ul className={styles.listOfReport}>
            <li>{t('manageProjects:legalAccreditation')}</li>
            <li>{t('manageProjects:taxExemption')}</li>
            <li>{t('manageProjects:annualReport')}</li>
            <li>{t('manageProjects:financialReport')}</li>
            <li>{t('manageProjects:PlantingReport')}</li>
          </ul>
        </div>
        <FormControlLabel
          label={t('manageProjects:publishProject')}
          labelPlacement="end"
          control={
            <Switch
              name="canPublish"
              id="publish"
              checked={projectDetails?.publish}
              onChange={(e) => handlePublishChange(e.target.checked)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          }
        />

        <div>
          <div className={styles.reviewImageContainer}>
            <NotReviewed />
          </div>
          <p className={styles.reviewMessage}>
            {t('manageProjects:projectForReview')}
          </p>
        </div>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="outlined"
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            startIcon={<BackArrow />}
          >
            <p>{t('manageProjects:backToSpending')}</p>
          </Button>

          <Button onClick={() => submitForReview()} variant="contained">
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('manageProjects:submitForReview')
            )}
          </Button>

          <Button
            variant="contained"
            onClick={() => router.push('/profile/projects')}
          >
            <p>{t('manageProjects:exit')}</p>
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
          <p className={styles.reviewMessage}>
            {t('manageProjects:acceptedReview')}
          </p>
        </div>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            variant="outlined"
            startIcon={<BackArrow />}
          >
            <p>{t('manageProjects:backToSpending')}</p>
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push('/profile/projects')}
          >
            <p>{t('manageProjects:exit')}</p>
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
          <p className={styles.reviewMessage}>
            {t('manageProjects:deniedReview')}
          </p>
        </div>

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            variant="outlined"
            startIcon={<BackArrow />}
          >
            <p>{t('manageProjects:backToSpending')}</p>
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push('/profile/projects')}
          >
            <p>{t('manageProjects:exit')}</p>
          </Button>
        </div>
      </CenteredContainer>
    );
  }

  switch (projectDetails?.verificationStatus) {
    case 'incomplete':
      return ready ? <NotSubmittedReview /> : <></>;
    case 'pending':
      return ready ? <UnderReviewComponent /> : <></>;
    case 'processing':
      return ready ? <UnderReviewComponent /> : <></>;
    case 'accepted':
      return ready ? <AcceptedReview /> : <></>;
    case 'denied':
      return ready ? <DeniedReview /> : <></>;
    default:
      return ready ? <UnderReviewComponent /> : <></>;
  }
}

export default SubmitForReview;

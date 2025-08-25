import type { ReactElement } from 'react';
import type { SubmitForReviewProps } from '../../../common/types/project';

import React from 'react';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import styles from './../StepForm.module.scss';
import SubmitForReviewImage from '../../../../../public/assets/images/icons/manageProjects/SubmitForReviewImage';
import UnderReview from '../../../../../public/assets/images/icons/manageProjects/UnderReview';
import { useTranslations } from 'next-intl';
import NotReviewed from '../../../../../public/assets/images/icons/manageProjects/NotReviewed';
import { Button, FormControlLabel } from '@mui/material';
import { ProjectCreationTabs } from '..';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import NewToggleSwitch from '../../../common/InputTypes/NewToggleSwitch';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

function SubmitForReview({
  submitForReview,
  handleBack,
  isUploadingData,
  projectDetails,
  handlePublishChange,
}: SubmitForReviewProps): ReactElement {
  const t = useTranslations('ManageProjects');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

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
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            variant="outlined"
            startIcon={<BackArrow />}
          >
            <p>{t('backToSpending')}</p>
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

        <div>
          <div className={styles.reviewImageContainer}>
            <NotReviewed />
          </div>
          <p className={styles.reviewMessage}>{t('projectForReview')}</p>
        </div>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="outlined"
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            startIcon={<BackArrow />}
          >
            <p>{t('backToSpending')}</p>
          </Button>

          <Button onClick={() => submitForReview()} variant="contained">
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
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            variant="outlined"
            startIcon={<BackArrow />}
          >
            <p>{t('backToSpending')}</p>
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
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SPENDING)}
            variant="outlined"
            startIcon={<BackArrow />}
          >
            <p>{t('backToSpending')}</p>
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
    case 'incomplete':
      return <NotSubmittedReview />;
    case 'pending':
      return <UnderReviewComponent />;
    case 'processing':
      return <UnderReviewComponent />;
    case 'accepted':
      return <AcceptedReview />;
    case 'denied':
      return <DeniedReview />;
    default:
      return <UnderReviewComponent />;
  }
}

export default SubmitForReview;

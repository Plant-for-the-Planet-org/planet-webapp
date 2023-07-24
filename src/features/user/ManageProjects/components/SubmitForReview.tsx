import React, { ReactElement } from 'react';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import styles from './../StepForm.module.scss';
import SubmitForReviewImage from '../../../../../public/assets/images/icons/manageProjects/SubmitForReviewImage';
import UnderReview from '../../../../../public/assets/images/icons/manageProjects/UnderReview';
import { useTranslation } from 'next-i18next';
import NotReviewed from '../../../../../public/assets/images/icons/manageProjects/NotReviewed';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import router from 'next/router';

interface Props {
  handleBack: Function;
  submitForReview: Function;
  isUploadingData: Boolean;
  projectGUID: any;
  handleReset: Function;
  projectDetails: any;
  handlePublishChange: Function;
}

function SubmitForReview({
  submitForReview,
  handleBack,
  isUploadingData,
  projectGUID,
  handleReset,
  projectDetails,
  handlePublishChange,
}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['manageProjects']);

  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset(ready ? t('manageProjects:resetMessage') : '');
    }
  });

  function UnderReviewComponent() {
    const [publish, setPublish] = React.useState(projectDetails.publish);

    return (
      <div className={styles.stepContainer}>
        <div>
          <div
            className={styles.formFieldLarge}
            style={{ width: '320px', marginLeft: '138px' }}
          >
            <div className={`${styles.formFieldRadio} ${styles.publishLabel} `}>
              <label
                htmlFor={'publish'}
                style={{ cursor: 'pointer' }}
                data-test-id="publishProject"
              >
                {t('manageProjects:publishProject')}
              </label>

              <ToggleSwitch
                checked={publish}
                onChange={(e) => handlePublishChange(e.target.checked)}
                id="publish"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
          </div>
          <div className={styles.formFieldLarge}>
            <div style={{ height: '240px', width: '100%' }}>
              <UnderReview />
            </div>
            <p
              style={{ textAlign: 'center', width: '100%', marginTop: '24px' }}
            >
              {t('manageProjects:projectUnderReview')}
            </p>
          </div>
          <div className={styles.formField}>
            <button
              id={'backArrowSubmitR'}
              className={`${styles.formFieldHalf}`}
              style={{ width: '234px' }}
            >
              <button onClick={handleBack} className="secondaryButton">
                <BackArrow />
                <p>{t('manageProjects:backToSpending')}</p>
              </button>
            </button>
            <button
              className="primaryButton"
              style={{
                width: '150px',
                marginTop: '30px',
                marginRight: '245px',
                marginLeft: '30px',
              }}
              onClick={() => router.push('/profile/projects')}
            >
              <p>{t('manageProjects:exit')}</p>
            </button>
            <div style={{ width: '20px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  function NotSubmittedReview() {
    const [publish, setPublish] = React.useState(projectDetails.publish);

    return (
      <div className={(styles.stepContainer, styles.reviewContent)}>
        <div
          className={styles.formFieldLarge}
          style={{ width: '320px', marginRight: '70px' }}
        >
          <div
            className={`${styles.formFieldRadio}`}
            style={{ marginLeft: '100px', marginBottom: '38px' }}
          >
            <label
              htmlFor={'publish'}
              style={{ cursor: 'pointer' }}
              data-test-id="publishProject"
            >
              {t('manageProjects:publishProject')}
            </label>

            <ToggleSwitch
              checked={publish}
              onChange={(e) => handlePublishChange(e.target.checked)}
              id="publish"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>
        </div>

        <div>
          <div className={(styles.formFieldLarge, styles.reviewImage)}>
            <div style={{ height: '240px', width: '100%' }}>
              <NotReviewed />
            </div>
            <p
              style={{ textAlign: 'center', width: '100%', marginTop: '24px' }}
            >
              {t('manageProjects:projectForReview')}
            </p>
          </div>

          <div className={styles.formFields}>
            <div className={styles.reviewButtons}>
              <button id={'backArrowSubmitR'} style={{ width: '234px' }}>
                <button onClick={handleBack} className="secondaryButton">
                  <BackArrow />
                  <p>{t('manageProjects:backToSpending')}</p>
                </button>
              </button>
              <button
                onClick={() => submitForReview()}
                className="primaryButton notSubmitReview"
                data-test-id="submitReview"
              >
                {isUploadingData ? (
                  <div className={styles.spinner}></div>
                ) : (
                  t('manageProjects:submitForReview')
                )}
              </button>

              <button
                className="primaryButton notSubmitExit"
                onClick={() => router.push('/profile/projects')}
              >
                <p>{t('manageProjects:exit')}</p>
              </button>
            </div>
            <div style={{ width: '20px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  function AcceptedReview() {
    return (
      <div className={styles.stepContainer}>
        <div>
          <div className={styles.formFieldLarge}>
            <div style={{ height: '240px', width: '100%' }}>
              <SubmitForReviewImage />
            </div>
            <p
              style={{ textAlign: 'center', width: '100%', marginTop: '24px' }}
            >
              {t('manageProjects:acceptedReview')}
            </p>
          </div>
          <div className={styles.formField}>
            <button
              id={'backArrowSubmitR'}
              className={`${styles.formFieldHalf}`}
            >
              <button onClick={handleBack} className="secondaryButton">
                <BackArrow />
                <p>{t('manageProjects:backToSpending')}</p>
              </button>
            </button>
            <div style={{ width: '20px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  function DeniedReview() {
    return (
      <div className={styles.stepContainer}>
        <div>
          <div className={styles.formFieldLarge}>
            <div style={{ height: '240px', width: '100%' }}>
              <UnderReview />
            </div>
            <p
              style={{ textAlign: 'center', width: '100%', marginTop: '24px' }}
            >
              {t('manageProjects:deniedReview')}
            </p>
          </div>

          <div className={styles.formField}>
            <button
              id={'backArrowSubmitR'}
              className={`${styles.formFieldHalf}`}
            >
              <button
                onClick={handleBack}
                className="secondaryButton"
                style={{ width: '234px', height: '46px', marginLeft: '40px' }}
              >
                <BackArrow />
                <p>{t('manageProjects:backToSpending')}</p>
              </button>
            </button>
            <div style={{ width: '20px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  switch (projectDetails.verificationStatus) {
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

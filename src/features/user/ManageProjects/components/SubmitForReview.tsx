import React, { ReactElement } from 'react'
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import styles from './../styles/StepForm.module.scss'
import SubmitForReviewImage from '../../../../../public/assets/images/icons/manageProjects/SubmitForReviewImage';
import UnderReview from '../../../../../public/assets/images/icons/manageProjects/UnderReview';
import i18next from './../../../../../i18n'

const { useTranslation } = i18next;

interface Props {
    handleBack: Function;
    reviewRequested: Boolean;
    submitForReview: Function;
    isUploadingData: Boolean;
    projectGUID: any;
    handleReset: Function;
}

function SubmitForReview({ submitForReview, reviewRequested, handleBack, isUploadingData, projectGUID, handleReset }: Props): ReactElement {

    const { t, i18n, ready } = useTranslation(['manageProjects']);

    React.useEffect(() => {
        if (!projectGUID || projectGUID === '') {
            handleReset(ready ? t('manageProjects:resetMessage') : '')
        }
    })

    return ready ? (
        <div className={styles.stepContainer}>
            <div>
                <div className={styles.formFieldLarge}>
                    <div style={{ height: '240px', width: '100%' }}>
                        {reviewRequested ? <UnderReview /> : <SubmitForReviewImage />}
                    </div>
                    <p style={{ textAlign: 'center', width: '100%', marginTop: '24px' }}>
                        {reviewRequested ? t('manageProjects:projectUnderReview') : t('manageProjects:projectForReview')}
                    </p>
                </div>

                <div className={styles.formField}>
                    <button id={'backArrowSubmitR'} className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleBack}
                            className={styles.secondaryButton}
                        >
                            <BackArrow />
                            <p>
                                {t('manageProjects:backToSpending')}
                            </p>
                        </AnimatedButton>
                    </button>
                    <div style={{ width: '20px' }}></div>
                    {
                        reviewRequested ? (
                            <div className={`${styles.formFieldHalf}`}>
                                <AnimatedButton
                                    className={styles.secondaryButton}
                                >
                                    {t('manageProjects:pendingReview')}
                                </AnimatedButton>
                            </div>
                        ) : (
                                <div className={`${styles.formFieldHalf}`}>
                                    <AnimatedButton
                                        onClick={() => submitForReview()}
                                        className={styles.continueButton}
                                    >
                                        {isUploadingData ? <div className={styles.spinner}></div> : t('manageProjects:submitForReview')}
                                    </AnimatedButton>
                                </div>
                            )
                    }
                </div>
            </div>

        </div>
    ) : null;
}

export default SubmitForReview

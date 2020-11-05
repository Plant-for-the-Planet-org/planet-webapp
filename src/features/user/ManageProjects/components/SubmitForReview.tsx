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

    const { t, i18n } = useTranslation(['manageProjects']);

    React.useEffect(() => {
        if (!projectGUID || projectGUID === '') {
            handleReset(t('manageProjects:resetMessage'))
        }
    })

    return (
        <div className={styles.stepContainer}>
            <div>
                {reviewRequested ? (
                    <div className={styles.formFieldLarge}>
                        <div style={{height:'240px',width:'100%'}}>
                            <UnderReview/>
                        </div>
                        <p style={{ textAlign: 'center',width:'100%',marginTop:'24px' }}>
                        Your project is under review, kindly wait.</p>
                    </div>
                ) : (
                <div className={styles.formFieldLarge}>
                    <div style={{height:'240px',width:'100%'}}>
                        <SubmitForReviewImage/>
                    </div>
                    <p style={{ textAlign: 'center',width:'100%',marginTop:'24px' }}>Great! <br />
                    You can now submit the project for review.</p>
                </div>
                )}
                

            <div className={styles.formField}>
                <div className={`${styles.formFieldHalf}`}>
                    <AnimatedButton
                        onClick={handleBack}
                        className={styles.secondaryButton}
                    >
                        <BackArrow />
                        <p>Back to project spending</p>
                    </AnimatedButton>
                </div>
                <div style={{ width: '20px' }}></div>
                {
                    reviewRequested ? (
                        <div className={`${styles.formFieldHalf}`}>
                            <AnimatedButton
                                className={styles.secondaryButton}
                            >
                                Pending Review
                                </AnimatedButton>
                        </div>
                    ) : (
                            <div className={`${styles.formFieldHalf}`}>
                                <AnimatedButton
                                    onClick={() => submitForReview()}
                                    className={styles.continueButton}
                                >
                                    {isUploadingData ? <div className={styles.spinner}></div> : 'Submit for Review'}
                                </AnimatedButton>
                            </div>
                        )
                }
            </div>
            </div>
            
        </div>
    )
}

export default SubmitForReview

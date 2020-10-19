import React, { ReactElement } from 'react'
import styles from './../styles/StepForm.module.scss'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useForm } from 'react-hook-form';
import i18next from './../../../../../i18n'
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';

const { useTranslation } = i18next;

interface Props {
    handleNext: Function;
    handleBack:Function;
}

export default function ProjectSpending({handleBack,handleNext}: Props): ReactElement {

    const { t, i18n } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors } = useForm();

    const [spendingDetails,setSpendingDetails] = React.useState({});

    const changeSpendingDetails = (e: any) => {
        setSpendingDetails({ ...spendingDetails, [e.target.name]: e.target.value });
    };

    const onSubmit = (data: any) => {
        handleNext()
    };

    const uploadReport = ()=>{

    }
    return (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className={styles.formField}>
                <div className={`${styles.formFieldHalf}`}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:spendingYear')}
                        variant="outlined"
                        name="spendingYear"
                        onChange={changeSpendingDetails}
                        // defaultValue={}
                    />
                    </div>
                    <div style={{width:'20px'}}></div>
                    <div className={`${styles.formFieldHalf}`}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:spendingAmount')}
                        variant="outlined"
                        name="spendingAmount"
                        onChange={changeSpendingDetails}
                        // defaultValue={}
                    />
                     </div>
                </div>

                <div className={styles.formFieldLarge}>
                    <div className={styles.fileUploadContainer}>
                        <AnimatedButton
                            onClick={uploadReport}
                            className={styles.continueButton}
                        >
                           Upload Report
                        </AnimatedButton>
                        <p style={{marginTop:'18px'}}>
                            or drag in a pdf
                        </p>
                    </div>
                </div>

                <div className={styles.formFieldLarge}>
                    <p className={styles.inlineLinkButton}>Add another year</p>
                </div>


                <div className={styles.formField}>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleBack}
                            className={styles.secondaryButton}
                        >
                          <BackArrow/>
                            <p>Back to project sites</p>
                        </AnimatedButton>
                    </div> 
                    <div style={{width:'20px'}}></div>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={onSubmit}
                            className={styles.continueButton}
                        >
                            {'Save & continue'}
                        </AnimatedButton>
                    </div> 
                </div>
            </form>
        </div>
    )
}

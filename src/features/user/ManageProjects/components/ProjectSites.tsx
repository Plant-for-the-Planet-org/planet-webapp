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

export default function ProjectSites({handleBack,handleNext}: Props): ReactElement {

    const { t, i18n } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors } = useForm();

    const [siteDetails,setSiteDetails] = React.useState({});

    const changeSiteDetails = (e: any) => {
        setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
    };

    const onSubmit = (data: any) => {
        handleNext()
    };

    return (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className={styles.formFieldLarge}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:siteName')}
                        variant="outlined"
                        name="siteName"
                        onChange={changeSiteDetails}
                        // defaultValue={}
                    />
                </div>

                <div className={styles.formFieldLarge}>
                    <p className={styles.inlineLinkButton}>Add another site</p>
                </div>

                <div className={styles.formField}>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleBack}
                            className={styles.secondaryButton}
                        >
                          <BackArrow/>
                            <p>Back to detailed analysis</p>
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

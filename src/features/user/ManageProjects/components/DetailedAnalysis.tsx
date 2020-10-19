import React, { ReactElement } from 'react'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm } from 'react-hook-form';
import i18next from './../../../../../i18n'
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import styles from './../styles/StepForm.module.scss'
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
const { useTranslation } = i18next;
interface Props {
    handleNext: Function;
    handleBack: Function;
}

export default function DetailedAnalysis({ handleBack, handleNext }: Props): ReactElement {
    const { t, i18n } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = (data: any) => {
        handleNext()
    };

    const [isCertified, setisCertified] = React.useState(true)

    const defaultDetailedAnalysisData = {};
    const [detailedAnalysisData, setDetailedAnalysisData] = React.useState(defaultDetailedAnalysisData);

    const changeDetailedAnalysisData = (e: any) => {
        setDetailedAnalysisData({ ...detailedAnalysisData, [e.target.name]: e.target.value });
    };

    const uploadCertificate = () => {

    }
    return (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:yearOfAbandonment')}
                            variant="outlined"
                            name="yearOfAbandonment"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        />
                    </div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:firstTreePlanted')}
                            variant="outlined"
                            name="firstTreePlanted"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        />
                    </div>
                </div>
                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:plantingDensity')}
                            variant="outlined"
                            name="plantingDensity"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        />
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:employeeCount')}
                            variant="outlined"
                            name="employeeCount"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        /></div>
                </div>

                <div className={styles.formFieldLarge}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:mainChallenge')}
                        variant="outlined"
                        name="mainChallenge"
                        onChange={changeDetailedAnalysisData}
                    // defaultValue={}
                    />
                </div>

                <div className={styles.formFieldLarge}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:whyThisSite')}
                        variant="outlined"
                        name="whyThisSite"
                        onChange={changeDetailedAnalysisData}
                    // defaultValue={}
                    />
                </div>
                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:siteOwner')}
                            variant="outlined"
                            name="siteOwner"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        />
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:ownerName')}
                            variant="outlined"
                            name="ownerName"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        />
                    </div>
                </div>
                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:acquisitionDate')}
                            variant="outlined"
                            name="acquisitionDate"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        />
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:yearOfDegradation')}
                            variant="outlined"
                            name="yearOfDegradation"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        />
                    </div>
                </div>
                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:causeOfDegradation')}
                            variant="outlined"
                            name="causeOfDegradation"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        />
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:longTermPlan')}
                            variant="outlined"
                            name="longTermPlan"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        />
                    </div>
                </div>

                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                        <div className={`${styles.formFieldRadio}`}>
                            <label>
                                {t('manageProjects:isCertified')}
                            </label>
                            <ToggleSwitch
                                checked={isCertified}
                                onChange={() => setisCertified(!isCertified)}
                                name="isCertified"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        </div>
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ required: true })}
                            label={t('manageProjects:certifierName')}
                            variant="outlined"
                            name="certifierName"
                            onChange={changeDetailedAnalysisData}
                        // defaultValue={}
                        />
                    </div>
                </div>

                <div className={styles.formFieldLarge}>
                    <div className={styles.fileUploadContainer}>
                        <AnimatedButton
                            onClick={uploadCertificate}
                            className={styles.continueButton}
                        >
                            Upload Certificate
                        </AnimatedButton>
                        <p style={{ marginTop: '18px' }}>
                            or drag in a pdf
                        </p>
                    </div>
                </div>

                <div className={styles.formFieldLarge}>
                    <p className={styles.inlineLinkButton}>Add another cerification</p>
                </div>

                <div className={styles.formField}>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleBack}
                            className={styles.secondaryButton}
                        >
                          <BackArrow/>
                            <p>Back to project media</p>
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

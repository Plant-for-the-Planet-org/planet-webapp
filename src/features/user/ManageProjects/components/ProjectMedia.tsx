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
    handleBack: Function;
}

export default function ProjectMedia({ handleBack, handleNext }: Props): ReactElement {

    const { t, i18n } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors } = useForm({ mode: 'all' });

    const [mediaDetails, setMediaDetails] = React.useState({});

    const changeMediaDetails = (e: any) => {
        setMediaDetails({ ...mediaDetails, [e.target.name]: e.target.value });
    };

    const onSubmit = (data: any) => {
        handleNext()
    };

    const uploadPhotos = () => {

    }

    const [youtubeURL,setYoutubeURL] = React.useState('')

    return (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formFieldLarge}>
                    {youtubeURL && !errors.youtubeURL ? (
                        <iframe src="https://www.youtube.com/embed/tgbNymZ7vqY"></iframe>
                    ) : null}
                </div>
                <div className={styles.formFieldLarge}>
                    <MaterialTextField
                        inputRef={register({
                            required: {
                                value: true,
                                message: "Please enter Youtube URL"
                            }, pattern: {
                                value: /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/,
                                message: "Invalid Youtube Video Link"
                            }
                        })}
                        label={t('manageProjects:youtubeURL')}
                        variant="outlined"
                        name="youtubeURL"
                        onChange={()=> setYoutubeURL}
                        defaultValue={youtubeURL}
                    />

                </div>
                {errors.youtubeURL && (
                    <span className={styles.formErrors}>
                        {errors.youtubeURL.message}
                    </span>
                )}

                <div className={styles.formFieldLarge}>
                    <label htmlFor="upload" className={styles.fileUploadContainer}>
                        <AnimatedButton
                            onClick={uploadPhotos}
                            className={styles.continueButton}
                        >
                            Upload Photos
                        </AnimatedButton>
                        <p style={{ marginTop: '18px' }}>
                            or drag them in
                        </p>
                    </label>
                    <input type="file" multiple id="upload" style={{ display: "none" }} />
                </div>

                <div className={styles.formField}>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleBack}
                            className={styles.secondaryButton}
                        >
                            <BackArrow />
                            <p>Back to basic details</p>
                        </AnimatedButton>
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={`${styles.formFieldHalf}`}>
                        <input type='submit' className={styles.continueButton} value="Save & continue" ></input>
                    </div>
                </div>
            </form>
        </div>
    )
}

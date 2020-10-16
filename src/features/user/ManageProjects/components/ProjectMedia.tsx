import React, { ReactElement } from 'react'
import styles from './../styles/StepForm.module.scss'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useForm } from 'react-hook-form';
import i18next from './../../../../../i18n'

const { useTranslation } = i18next;

interface Props {
    
}

export default function ProjectMedia({}: Props): ReactElement {

    const { t, i18n } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors } = useForm();

    const [mediaDetails,setMediaDetails] = React.useState({});

    const changeMediaDetails = (e: any) => {
        setMediaDetails({ ...mediaDetails, [e.target.name]: e.target.value });
    };

    const onSubmit = (data: any) => {

    };

    const uploadPhotos = ()=>{

    }

    return (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className={styles.formField}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:youtubeURL')}
                        variant="outlined"
                        name="youtubeURL"
                        onChange={changeMediaDetails}
                        // defaultValue={}
                    />
                </div>

                <div className={styles.formField}>
                    <div className={styles.fileUploadContainer}>
                        <AnimatedButton
                            onClick={uploadPhotos}
                            className={styles.continueButton}
                        >
                           Upload Photos
                        </AnimatedButton>
                        <p style={{marginTop:'18px'}}>
                            or drag them in
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}

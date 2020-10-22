import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import imageToBase64 from 'image-to-base64/browser';
import styles from '../styles/StepForm.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import i18next from '../../../../../i18n';
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
    handleNext();
  };

  const uploadPhotos = () => {

  };

  const [files, setFiles] = React.useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map((file) => Object.assign(file, {
        preview: URL.createObjectURL(file),
      })));
    },
    onDropAccepted: () => {
      files.map((file) => {
        imageToBase64(file.path).then((response: any) => {
          console.log(response);
        }).catch((err: any) => {
          console.log(err);
        });
      });
    },
    // onFileDialogCancel: () => {
    //     alert('no file selected')
    // }
  }, []);

    const [youtubeURL,setYoutubeURL] = React.useState('')

  React.useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

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

                <div className={styles.formFieldLarge} {...getRootProps()}>
                    <label htmlFor="upload" className={styles.fileUploadContainer}>
                        <input {...getInputProps()} />
                            { isDragActive ? <p>Drop the files here ...</p>
                              :  <div>
                               <AnimatedButton
                              onClick={uploadPhotos}
                              className={styles.continueButton}
                            >
                            Upload Photos
                        </AnimatedButton>
                        <p style={{ marginTop: '18px' }}>
                            or drag them in
                        </p>
                        </div>
                              }
                    </label>
                    
                    {/* <input type="file" multiple id="upload" style={{ display: 'none' }} /> */}
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
                    <div style={{ width: '20px' }} />
                    <div className={`${styles.formFieldHalf}`}>
                        <input type="submit" className={styles.continueButton} value="Save & continue" />
                    </div>
                </div>
            </form>
        </div>
  );
}

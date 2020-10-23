import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import styles from '../styles/StepForm.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import i18next from '../../../../../i18n';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import { useSession } from 'next-auth/client';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import {getS3Image} from '../../../../utils/getImageURL';
import DeleteIcon from '../../../../../public/assets/images/icons/manageProjects/Delete';
import Star from '../../../../../public/assets/images/icons/manageProjects/Star';

const { useTranslation } = i18next;

interface Props {
  handleNext: Function;
  handleBack: Function;
  projectDetails: Object;
  setProjectDetails: Function;
  projectGUID: Object;
  handleReset: Function;
}

export default function ProjectMedia({ handleBack, handleNext, projectDetails, setProjectDetails, projectGUID, handleReset }: Props): ReactElement {
  const { t, i18n } = useTranslation(['manageProjects']);
  const [session, loading] = useSession();

  const { register, handleSubmit, errors } = useForm({ mode: 'all' });

  const [mediaDetails, setMediaDetails] = React.useState({});

  const changeMediaDetails = (e: any) => {
    setMediaDetails({ ...mediaDetails, [e.target.name]: e.target.value });
  };

  const onSubmit = (data: any) => {
    handleNext();
  };

  const [uploadedImages, setUploadedImages] = React.useState([])
  const uploadPhotos = (image: any) => {
    const submitData = {
      "imageFile": image,
      "description": null,
      "isDefault": false
    }
    postAuthenticatedRequest(`/app/projects/${projectGUID}/images`, submitData, session).then((res) => {
      let newUploadedImages = uploadedImages;
      newUploadedImages.push(res)
      setUploadedImages(newUploadedImages)
    })
  };

  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset('Please fill the Basic Details first')
    }
  })

  const [files, setFiles] = React.useState([]);

  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = (event) => {
        // Do whatever you want with the file contents
        // setFiles(acceptedFiles.map((file:any) => Object.assign(file, {
        //   preview: URL.createObjectURL(file),
        // })));
        // console.log('Base 64 version', event.target.result);
        uploadPhotos(event.target.result);
        // Upload the base 64 to API and use the response to show preview to the user

      }
    })

  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: onDrop,
    onDropAccepted: () => {
      console.log('uploaded');

    },

    // onFileDialogCancel: () => {
    //     alert('no file selected')
    // }
  });



  const [youtubeURL, setYoutubeURL] = React.useState('')

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
            onChange={() => setYoutubeURL}
            defaultValue={youtubeURL}
          />

        </div>
        {errors.youtubeURL && (
          <span className={styles.formErrors}>
            {errors.youtubeURL.message}
          </span>
        )}

 {/* Change to field array of react hook form  */}
        {uploadedImages && uploadedImages.length > 0 ?
          <div className={styles.formField}>
            {
              uploadedImages.map((image) => {
                return (
                  <div key={image.id} className={styles.formFieldHalf}>
                    <div className={styles.uploadedImageContainer}>
                    <img src={getS3Image('project','medium',image.image)} />
                    <div className={styles.uploadedImageOverlay}></div>
                    <input type="text" name="" placeholder="Caption" />
                      <div className={styles.uploadedImageButtonContainer}>
                        <div>
                          <DeleteIcon/>
                        </div>
                        <div>
                        <Star/>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                )
              })
            }
          </div>
          : null}

        <div className={styles.formFieldLarge} {...getRootProps()}>
          <label htmlFor="upload" className={styles.fileUploadContainer}>
            <AnimatedButton
              onClick={uploadPhotos}
              className={styles.continueButton}
            >
              <input {...getInputProps()} />
                            Upload Photos

                        </AnimatedButton>
            <p style={{ marginTop: '18px' }}>
              or drag them in
                        </p>
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

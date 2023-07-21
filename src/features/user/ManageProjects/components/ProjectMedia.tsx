import React, { ReactElement } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import styles from '../StepForm.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import {
  deleteAuthenticatedRequest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import getImageUrl from '../../../../utils/getImageURL';
import DeleteIcon from '../../../../../public/assets/images/icons/manageProjects/Delete';
import Star from '../../../../../public/assets/images/icons/manageProjects/Star';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { useTranslation } from 'next-i18next';
import { handleError, APIError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

interface Props {
  handleNext: Function;
  handleBack: Function;
  projectDetails: Object;
  setProjectDetails: Function;
  projectGUID: String;
  handleReset: Function;
  token: any;
}

export default function ProjectMedia({
  handleBack,
  token,
  handleNext,
  projectDetails,
  setProjectDetails,
  projectGUID,
  handleReset,
}: Props): ReactElement {
  const { t, ready } = useTranslation(['manageProjects']);
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { youtubeURL: projectDetails.videoUrl || '' },
  });

  const [uploadedImages, setUploadedImages] = React.useState<Array<any>>([]);

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const fetchImages = async () => {
    try {
      // Fetch images of the project
      if (projectGUID && token) {
        const result = await getAuthenticatedRequest(
          `/app/profile/projects/${projectGUID}?_scope=images`,
          token,
          logoutUser
        );
        setUploadedImages(result.images);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/profile');
    }
  };

  React.useEffect(() => {
    fetchImages();
  }, [projectGUID]);

  const uploadPhotos = async (image: any) => {
    setIsUploadingData(true);

    const submitData = {
      imageFile: image,
      description: null,
      isDefault: false,
    };

    try {
      const res = await postAuthenticatedRequest(
        `/app/projects/${projectGUID}/images`,
        submitData,
        token,
        logoutUser
      );
      let newUploadedImages = [...uploadedImages];

      if (!newUploadedImages) {
        newUploadedImages = [];
      }
      newUploadedImages.push(res);
      setUploadedImages(newUploadedImages);
      setIsUploadingData(false);
      setErrorMessage('');
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset(ready ? t('manageProjects:resetMessage') : '');
    }
  });

  const [files, setFiles] = React.useState([]);

  const onDrop = React.useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = (event) => {
          uploadPhotos(event.target.result);
        };
      });
    },
    [uploadedImages]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    maxSize: 10485760,
    onDropAccepted: onDrop,
    onDrop: () => {
      console.log('uploading');
    },
    onDropRejected: (err) => {
      if (err[0].errors[0].code === 'file-too-large') {
        setErrorMessage(t('manageProjects:fileSizeLimit'));
      } else if (err[0].errors[0].code === 'file-invalid-type') {
        setErrorMessage(t('manageProjects:fileImageOnly'));
      }
    },
  });

  React.useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const deleteProjectCertificate = async (id: any) => {
    try {
      await deleteAuthenticatedRequest(
        `/app/projects/${projectGUID}/images/${id}`,
        token,
        logoutUser
      );
      const uploadedFilesTemp = uploadedImages.filter((item) => item.id !== id);
      setUploadedImages(uploadedFilesTemp);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  // For uploading the Youtube field
  const onSubmit = async (data: any) => {
    // Add isDirty test here
    setIsUploadingData(true);
    const submitData = {
      videoUrl: data.youtubeURL,
    };

    try {
      const res = await putAuthenticatedRequest(
        `/app/projects/${projectGUID}`,
        submitData,
        token,
        logoutUser
      );
      setProjectDetails(res);
      setIsUploadingData(false);
      handleNext();
      setErrorMessage('');
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const setDefaultImage = async (id: any, index: any) => {
    setIsUploadingData(true);
    const submitData = {
      isDefault: true,
    };

    try {
      await putAuthenticatedRequest(
        `/app/projects/${projectGUID}/images/${id}`,
        submitData,
        token,
        logoutUser
      );
      const tempUploadedData = uploadedImages;
      tempUploadedData.forEach((image) => {
        image.isDefault = false;
      });
      tempUploadedData[index].isDefault = true;
      setUploadedImages(tempUploadedData);
      setIsUploadingData(false);
      setErrorMessage('');
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const uploadCaption = async (id: any, index: any, e: any) => {
    setIsUploadingData(true);
    const submitData = {
      description: e.target.value,
    };

    try {
      const res = await putAuthenticatedRequest(
        `/app/projects/${projectGUID}/images/${id}`,
        submitData,
        token,
        logoutUser
      );
      const tempUploadedData = uploadedImages;
      tempUploadedData[index].description = res.description;
      setUploadedImages(tempUploadedData);
      setIsUploadingData(false);
      setErrorMessage('');
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };
  return ready ? (
    <div className={styles.stepContainer}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
          {/* <div className={styles.formFieldLarge}>
            {youtubeURL && !errors.youtubeURL ? (
              <iframe src={youtubeURL}></iframe>
            ) : null}
          </div> */}
          <div className={styles.formFieldLarge}>
            <Controller
              name="youtubeURL"
              control={control}
              rules={{
                pattern: {
                  value:
                    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/,
                  message: t('manageProjects:youtubeURLValidation'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <MaterialTextField
                  label={t('manageProjects:youtubeURL')}
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
            />
          </div>
          {errors.youtubeURL && (
            <span className={styles.formErrors}>
              {errors.youtubeURL.message}
            </span>
          )}

          {/* Change to field array of react hook form  */}
          {uploadedImages && uploadedImages.length > 0 ? (
            <div className={styles.formField}>
              {uploadedImages.map((image, index: any) => {
                return (
                  <div
                    key={index}
                    className={styles.formFieldHalf}
                    style={{ marginLeft: '10px' }}
                  >
                    <div>
                      <div className={styles.uploadedImageContainer}>
                        <img
                          src={getImageUrl('project', 'medium', image.image)}
                        />
                        <div className={styles.uploadedImageOverlay}></div>

                        <input
                          onBlur={(e) => uploadCaption(image.id, index, e)}
                          type="text"
                          placeholder={t('manageProjects:addCaption')}
                          defaultValue={image.description}
                        />

                        <div className={styles.uploadedImageButtonContainer}>
                          <button
                            id={'DelProjCert'}
                            onClick={() => deleteProjectCertificate(image.id)}
                          >
                            <DeleteIcon />
                          </button>
                          <button
                            id={'setDefaultImg'}
                            onClick={() => setDefaultImage(image.id, index)}
                          >
                            <Star
                              color={image.isDefault ? '#ECB641' : '#aaa'}
                              className={image.isDefault ? 'selected' : ''}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className={styles.formFieldLarge} {...getRootProps()}>
            <label htmlFor="upload" className={styles.fileUploadContainer}>
              <div className="primaryButton" style={{ maxWidth: '240px' }}>
                <input {...getInputProps()} />
                {t('manageProjects:uploadPhotos')}
              </div>
              <p style={{ marginTop: '18px' }}>{t('manageProjects:dragIn')}</p>
            </label>

            {/* <input type="file" multiple id="upload" style={{ display: 'none' }} /> */}
          </div>
        </div>

        {errorMessage && errorMessage !== '' ? (
          <div className={styles.formFieldLarge}>
            <h4 className={styles.errorMessage}>{errorMessage}</h4>
          </div>
        ) : null}

        <div className={(styles.formField, styles.mediaButtons)}>
          <div className={`${styles.formFieldHalf}`}>
            <button
              onClick={handleBack}
              className="secondaryButton"
              style={{ width: '234px', height: '46px' }}
            >
              <BackArrow />
              <p>{t('manageProjects:backToBasic')}</p>
            </button>
          </div>
          <div style={{ width: '20px' }} />
          <div className={`${styles.formFieldHalf}`}>
            <button
              id={'SaveAndCont'}
              onClick={handleSubmit(onSubmit)}
              className="primaryButton"
              style={{ width: '169px', height: '46px', marginRight: '20px' }}
              data-test-id="projMediaCont"
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                t('manageProjects:saveAndContinue')
              )}
            </button>
          </div>

          <div className={`${styles.formFieldHalf}`}>
            <button
              className="primaryButton"
              style={{ width: '89px' }}
              onClick={handleNext}
            >
              {t('manageProjects:skip')}
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <></>
  );
}

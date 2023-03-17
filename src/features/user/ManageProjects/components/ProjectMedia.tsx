import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import styles from '../StepForm.module.scss';
import { TextField, Button } from '@mui/material';
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
import { ProjectCreationFormContainer } from '.';
import { ProjectCreationTabs } from '..';

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
  const { handleError } = React.useContext(ErrorHandlingContext);
  const { register, handleSubmit, errors } = useForm({ mode: 'all' });

  const [uploadedImages, setUploadedImages] = React.useState<Array<any>>([]);

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    // Fetch images of the project
    if (projectGUID && token)
      getAuthenticatedRequest(
        `/app/profile/projects/${projectGUID}?_scope=images`,
        token,
        {},
        handleError,
        '/profile'
      ).then((result) => {
        setUploadedImages(result.images);
      });
  }, [projectGUID]);

  const uploadPhotos = (image: any) => {
    setIsUploadingData(true);

    const submitData = {
      imageFile: image,
      description: null,
      isDefault: false,
    };
    postAuthenticatedRequest(
      `/app/projects/${projectGUID}/images`,
      submitData,
      token,
      handleError
    )
      .then((res) => {
        if (!res.code) {
          let newUploadedImages = [...uploadedImages];

          if (!newUploadedImages) {
            newUploadedImages = [];
          }
          newUploadedImages.push(res);
          setUploadedImages(newUploadedImages);
          setIsUploadingData(false);
          setErrorMessage('');
        } else {
          if (res.code === 404) {
            setIsUploadingData(false);
            setErrorMessage(ready ? t('manageProjects:projectNotFound') : '');
          } else {
            setIsUploadingData(false);
            setErrorMessage(res.message);
          }
        }
      })
      .catch((err) => {
        setIsUploadingData(false);
        setErrorMessage(err);
      });
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

  const [youtubeURL, setYoutubeURL] = React.useState('');

  React.useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const deleteProjectCertificate = (id: any) => {
    deleteAuthenticatedRequest(
      `/app/projects/${projectGUID}/images/${id}`,
      token,
      handleError
    ).then((res) => {
      if (res !== 404) {
        const uploadedFilesTemp = uploadedImages.filter(
          (item) => item.id !== id
        );
        setUploadedImages(uploadedFilesTemp);
      }
    });
  };

  // For uploading the Youtube field
  const onSubmit = (data: any) => {
    // Add isDirty test here
    setIsUploadingData(true);
    const submitData = {
      videoUrl: data.youtubeURL,
    };
    putAuthenticatedRequest(
      `/app/projects/${projectGUID}`,
      submitData,
      token,
      handleError
    )
      .then((res) => {
        if (!res.code) {
          setProjectDetails(res);
          setIsUploadingData(false);
          handleNext();
          setErrorMessage('');
        } else {
          if (res.code === 404) {
            setIsUploadingData(false);
            setErrorMessage(ready ? t('manageProjects:projectNotFound') : '');
          } else {
            setIsUploadingData(false);
            setErrorMessage(res.message);
          }
        }
      })
      .catch((err) => {
        setIsUploadingData(false);
        setErrorMessage(err);
      });
  };

  React.useEffect(() => {
    if (projectDetails) {
      setYoutubeURL(projectDetails.videoUrl);
    }
  }, [projectDetails]);

  const setDefaultImage = (id: any, index: any) => {
    setIsUploadingData(true);
    const submitData = {
      isDefault: true,
    };
    putAuthenticatedRequest(
      `/app/projects/${projectGUID}/images/${id}`,
      submitData,
      token,
      handleError
    ).then((res) => {
      if (!res.code) {
        const tempUploadedData = uploadedImages;
        tempUploadedData.forEach((image) => {
          image.isDefault = false;
        });
        tempUploadedData[index].isDefault = true;
        setUploadedImages(tempUploadedData);
        setIsUploadingData(false);
        setErrorMessage('');
      } else {
        if (res.code === 404) {
          setIsUploadingData(false);
          setErrorMessage(ready ? t('manageProjects:projectNotFound') : '');
        } else {
          setIsUploadingData(false);
          setErrorMessage(res.message);
        }
      }
    });
  };

  const uploadCaption = (id: any, index: any, e: any) => {
    setIsUploadingData(true);
    const submitData = {
      description: e.target.value,
    };
    putAuthenticatedRequest(
      `/app/projects/${projectGUID}/images/${id}`,
      submitData,
      token,
      handleError
    ).then((res) => {
      if (!res.code) {
        const tempUploadedData = uploadedImages;
        tempUploadedData[index].description = res.description;
        setUploadedImages(tempUploadedData);
        setIsUploadingData(false);
        setErrorMessage('');
      } else {
        if (res.code === 404) {
          setIsUploadingData(false);
          setErrorMessage(ready ? t('manageProjects:projectNotFound') : '');
        } else {
          setIsUploadingData(false);
          setErrorMessage(res.message);
        }
      }
    });
  };
  return ready ? (
    <ProjectCreationFormContainer>
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
            <TextField
              inputRef={register({
                pattern: {
                  value:
                    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/,
                  message: t('manageProjects:youtubeURLValidation'),
                },
              })}
              label={t('manageProjects:youtubeURL')}
              variant="outlined"
              name="youtubeURL"
              onChange={(e) => setYoutubeURL(e.target.value)}
              defaultValue={youtubeURL}
              value={youtubeURL}
              error={errors.youtubeURL}
              helperText={errors.youtubeURL && errors.youtubeURL.message}
            />
          </div>

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
              <Button variant="contained">
                <input {...getInputProps()} />
                {t('manageProjects:uploadPhotos')}
              </Button>
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
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="outlined"
            onClick={() => handleBack(ProjectCreationTabs.BASIC_DETAILS)}
            className={styles.backButton}
          >
            <BackArrow />
            <p>{t('manageProjects:backToBasic')}</p>
          </Button>

          <Button
            id={'SaveAndCont'}
            onClick={handleSubmit(onSubmit)}
            data-test-id="projMediaCont"
            variant="contained"
            className={styles.saveAndContinueButton}
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('manageProjects:saveAndContinue')
            )}
          </Button>
          <Button
            onClick={() => handleNext(ProjectCreationTabs.DETAILED_ANALYSIS)}
            variant="contained"
            className={styles.skipButton}
          >
            {t('manageProjects:skip')}
          </Button>
        </div>
      </form>
    </ProjectCreationFormContainer>
  ) : (
    <></>
  );
}

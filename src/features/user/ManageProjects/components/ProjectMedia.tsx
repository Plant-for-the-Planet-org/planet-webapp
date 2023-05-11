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
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError, APIError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ProjectCreationTabs } from '..';
import { ProjectMediaProps } from '../../../common/types/project';

export default function ProjectMedia({
  handleBack,
  token,
  handleNext,
  projectDetails,
  setProjectDetails,
  projectGUID,
  handleReset,
}: ProjectMediaProps): ReactElement {
  const { t, ready } = useTranslation(['manageProjects']);
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();

  const { register, handleSubmit, errors } = useForm({ mode: 'all' });

  const [uploadedImages, setUploadedImages] = React.useState<
    string[] | undefined
  >(undefined);

  const [isUploadingData, setIsUploadingData] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

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

  const [youtubeURL, setYoutubeURL] = React.useState('');

  React.useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file?.preview));
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
      handleNext(ProjectCreationTabs.DETAILED_ANALYSIS);
      setErrorMessage('');
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  React.useEffect(() => {
    if (projectDetails) {
      setYoutubeURL(projectDetails?.videoUrl);
    }
  }, [projectDetails]);

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
    <CenteredContainer>
      <StyledForm>
        <div
          className={`${isUploadingData ? styles.shallowOpacity : ''}`}
          style={{
            width: 'inherit',
          }}
        >
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

          {/* Change to field array of react hook form  */}
          {uploadedImages && uploadedImages.length > 0 ? (
            <InlineFormDisplayGroup>
              {uploadedImages.map((image, index: any) => {
                return (
                  <div className={styles.uploadedImageContainer} key={index}>
                    <img src={getImageUrl('project', 'medium', image.image)} />
                    <div className={styles.uploadedImageOverlay}></div>

                    <input
                      onBlur={(e) => uploadCaption(image.id, index, e)}
                      type="text"
                      placeholder={t('manageProjects:addCaption')}
                      defaultValue={image.description}
                    />

                    <div className={styles.uploadedImageButtonContainer}>
                      <Button
                        id={'DelProjCert'}
                        onClick={() => deleteProjectCertificate(image.id)}
                      >
                        <DeleteIcon />
                      </Button>
                      <Button
                        id={'setDefaultImg'}
                        onClick={() => setDefaultImage(image.id, index)}
                      >
                        <Star
                          color={image.isDefault ? '#ECB641' : '#aaa'}
                          className={image.isDefault ? 'selected' : ''}
                        />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </InlineFormDisplayGroup>
          ) : null}

          <div {...getRootProps()}>
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
      </StyledForm>
    </CenteredContainer>
  ) : (
    <></>
  );
}

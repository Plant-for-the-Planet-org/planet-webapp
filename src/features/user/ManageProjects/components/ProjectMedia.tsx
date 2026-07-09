import type { APIError } from '@planet-sdk/common';
import type {
  ProjectMediaProps,
  UploadImage,
  ImagesScopeProjects,
  ExtendedProfileProjectProperties,
} from '../../../common/types/project';
import type { ReactElement, FocusEvent } from 'react';

import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import styles from '../StepForm.module.scss';
import { TextField, Button, IconButton } from '@mui/material';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import getImageUrl from '../../../../utils/getImageURL';
import DeleteIcon from '../../../../../public/assets/images/icons/manageProjects/Delete';
import Star from '../../../../../public/assets/images/icons/manageProjects/Star';
import { useTranslations } from 'next-intl';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError } from '@planet-sdk/common';
import { ProjectCreationTabs } from '..';
import { useApi } from '../../../../hooks/useApi';
import themeProperties from '../../../../theme/themeProperties';
import { validateYouTubeUrl } from '../../../../utils/youTubeValidation';
import { clsx } from 'clsx';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';

type UploadImageApiPayload = {
  imageFile: string;
  description: string | null;
  isDefault: boolean;
};

type ProjectVideoApiPayload = {
  videoUrl: string;
};

type DefaultImageApiPayload = {
  isDefault: boolean;
};

type DefaultImage = {
  id: string;
  image: string;
  description: string | null;
  isDefault: boolean;
};

type UploadCaptionApiPayload = {
  description: string;
};

export default function ProjectMedia({
  handleBack,
  token,
  handleNext,
  projectDetails,
  setProjectDetails,
  projectGUID,
}: ProjectMediaProps): ReactElement {
  const t = useTranslations('ManageProjects');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const {
    getApiAuthenticated,
    deleteApiAuthenticated,
    postApiAuthenticated,
    putApiAuthenticated,
  } = useApi();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { youtubeURL: projectDetails?.videoUrl || '' },
  });
  const { colors } = themeProperties.designSystem;
  // local state
  const [uploadedImages, setUploadedImages] = useState<UploadImage[]>([]);
  const [isUploadingData, setIsUploadingData] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const fetchImages = async () => {
    try {
      // Fetch images of the project
      if (projectGUID && token) {
        const result = await getApiAuthenticated<ImagesScopeProjects>(
          `/app/profile/projects/${projectGUID}?_scope=images`
        );
        setUploadedImages(result.images);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
      router.push(localizedPath('/profile'));
    }
  };

  useEffect(() => {
    fetchImages();
  }, [projectGUID]);

  const uploadPhotos = async (image: string) => {
    setIsUploadingData(true);

    const imagePayload: UploadImageApiPayload = {
      imageFile: image,
      description: null,
      isDefault: false,
    };

    try {
      const res = await postApiAuthenticated<
        UploadImage,
        UploadImageApiPayload
      >(`/app/projects/${projectGUID}/images`, {
        payload: imagePayload,
      });
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
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = (event: ProgressEvent<FileReader>): void => {
          const result = event?.target?.result;
          if (typeof result !== 'string') return;
          uploadPhotos(result);
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
        setErrorMessage(t('fileSizeLimit'));
      } else if (err[0].errors[0].code === 'file-invalid-type') {
        setErrorMessage(t('fileImageOnly'));
      }
    },
  });

  const deleteProjectCertificate = async (id: string) => {
    try {
      await deleteApiAuthenticated(`/app/projects/${projectGUID}/images/${id}`);
      const uploadedFilesTemp = uploadedImages.filter((item) => item.id !== id);
      setUploadedImages(uploadedFilesTemp);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  // For uploading the Youtube field
  const onSubmit = async (data: { youtubeURL: string }) => {
    // Add isDirty test here
    setIsUploadingData(true);
    const videoPayload: ProjectVideoApiPayload = {
      videoUrl: data.youtubeURL,
    };

    try {
      const res = await putApiAuthenticated<
        ExtendedProfileProjectProperties,
        ProjectVideoApiPayload
      >(`/app/projects/${projectGUID}`, { payload: videoPayload });
      setProjectDetails(res);
      setIsUploadingData(false);
      handleNext(ProjectCreationTabs.DETAILED_ANALYSIS);
      setErrorMessage('');
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const setDefaultImage = async (id: string, index: number) => {
    setIsUploadingData(true);
    const defaultImagePayload: DefaultImageApiPayload = {
      isDefault: true,
    };

    try {
      await putApiAuthenticated<DefaultImage, DefaultImageApiPayload>(
        `/app/projects/${projectGUID}/images/${id}`,
        {
          payload: defaultImagePayload,
        }
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

  const uploadCaption = async (
    id: string,
    index: number,
    e: FocusEvent<HTMLInputElement, Element>
  ) => {
    setIsUploadingData(true);
    const uploadCaptionPayload: UploadCaptionApiPayload = {
      description: e.target.value,
    };

    try {
      const res = await putApiAuthenticated<
        UploadImage,
        UploadCaptionApiPayload
      >(`/app/projects/${projectGUID}/images/${id}`, {
        payload: uploadCaptionPayload,
      });
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

  return (
    <CenteredContainer>
      <StyledForm>
        <div
          className={clsx('inputContainer', {
            [styles.shallowOpacity]: isUploadingData,
          })}
          style={{
            width: 'inherit',
          }}
        >
          <Controller
            name="youtubeURL"
            control={control}
            rules={{
              validate: (value: string) => {
                return validateYouTubeUrl(value) || t('youtubeURLValidation');
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('youtubeURL')}
                variant="outlined"
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.youtubeURL !== undefined}
                helperText={
                  errors.youtubeURL !== undefined && errors.youtubeURL.message
                }
              />
            )}
          />

          {/* Change to field array of react hook form  */}
          {uploadedImages && uploadedImages.length > 0 ? (
            <InlineFormDisplayGroup>
              {uploadedImages.map((image, index) => {
                return (
                  <div className={styles.uploadedImageContainer} key={index}>
                    <img src={getImageUrl('project', 'medium', image.image)} />
                    <div className={styles.uploadedImageOverlay}></div>

                    <input
                      onBlur={(e) => uploadCaption(image.id, index, e)}
                      type="text"
                      placeholder={t('addCaption')}
                      defaultValue=""
                    />

                    <div className={styles.uploadedImageButtonContainer}>
                      <IconButton
                        id={'DelProjCert'}
                        onClick={() => deleteProjectCertificate(image.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        id={'setDefaultImg'}
                        onClick={() => setDefaultImage(image.id, index)}
                        size="small"
                      >
                        <Star
                          color={
                            image.isDefault
                              ? colors.goldenYellow
                              : colors.coreText
                          }
                          className={clsx({
                            selected: image.isDefault,
                          })}
                        />
                      </IconButton>
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
                {t('uploadPhotos')}
              </Button>
              <p style={{ marginTop: '18px' }}>{t('dragIn')}</p>
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
            className="formButton"
            startIcon={<BackArrow />}
          >
            <p>{t('backToBasic')}</p>
          </Button>

          <Button
            id={'SaveAndCont'}
            onClick={handleSubmit(onSubmit)}
            data-test-id="projMediaCont"
            variant="contained"
            className="formButton"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('saveAndContinue')
            )}
          </Button>
          <Button
            onClick={() => handleNext(ProjectCreationTabs.DETAILED_ANALYSIS)}
            variant="contained"
            className="formButton"
          >
            {t('skip')}
          </Button>
        </div>
      </StyledForm>
    </CenteredContainer>
  );
}

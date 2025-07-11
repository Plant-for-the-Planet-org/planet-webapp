import type { ReactElement } from 'react';
import type { APIError, Image } from '@planet-sdk/common';

import React from 'react';
import styles from '../RegisterModal.module.scss';
import { useDropzone } from 'react-dropzone';
import getImageUrl from '../../../../utils/getImageURL';
import DeleteIcon from '../../../../../public/assets/images/icons/manageProjects/Delete';
import { useTranslations } from 'next-intl';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { Button } from '@mui/material';
import { useApi } from '../../../../hooks/useApi';

interface Props {
  contributionGUID: string;
}

type UploadImageApiPayload = {
  imageFile: string;
  description: string;
};

export default function UploadImages({
  contributionGUID,
}: Props): ReactElement {
  const [uploadedImages, setUploadedImages] = React.useState<Image[]>([]);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const t = useTranslations('Me');
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { deleteApiAuthenticated, postApiAuthenticated } = useApi();

  const uploadPhotos = async (image: string) => {
    setIsUploadingData(true);
    const payload: UploadImageApiPayload = {
      imageFile: image,
      description: '',
    };

    try {
      const res = await postApiAuthenticated<Image, UploadImageApiPayload>(
        `/app/contributions/${contributionGUID}/images`,
        {
          payload,
        }
      );
      const newUploadedImages: Image[] = uploadedImages;
      newUploadedImages.push(res);
      setUploadedImages(newUploadedImages);
      setIsUploadingData(false);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          uploadPhotos(event.target?.result);
        }
      };
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: onDrop,
    onDropAccepted: () => {
      console.log('uploading');
    },
    onFileDialogCancel: () => setIsUploadingData(false),
  });

  const deleteContributionImage = async (id: string) => {
    try {
      await deleteApiAuthenticated(
        `/app/contributions/${contributionGUID}/images/${id}`
      );
      const uploadedImagesTemp = uploadedImages;
      const index = uploadedImagesTemp.findIndex((item) => {
        return item.id === id;
      });
      if (index !== -1) {
        uploadedImagesTemp.splice(index, 1);
        setUploadedImages(uploadedImagesTemp);
      } else {
        console.log('image not found');
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  return (
    <>
      {/* Change to field array of react hook form  */}
      {uploadedImages && uploadedImages.length > 0 ? (
        <InlineFormDisplayGroup>
          {uploadedImages.map((image) => {
            return (
              <div key={image.id}>
                <div className={styles.uploadedImageContainer}>
                  <img
                    src={getImageUrl('contribution', 'medium', image.image)}
                  />
                  <div className={styles.uploadedImageButtonContainer}>
                    <Button
                      id={'uploadImgDelIcon'}
                      onClick={() => deleteContributionImage(image.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </InlineFormDisplayGroup>
      ) : null}
      <div>
        <label
          htmlFor="upload"
          className={styles.fileUploadContainer}
          {...getRootProps()}
        >
          <Button
            onClick={() => uploadPhotos}
            variant="contained"
            color="primary"
            style={{ maxWidth: '200px' }}
          >
            <input {...getInputProps()} />
            {isUploadingData ? (
              <div className={'spinner'}></div>
            ) : (
              t('uploadPhotos')
            )}
          </Button>
          <p style={{ marginTop: '18px' }}>{t('dragHere')}</p>
        </label>
      </div>
    </>
  );
}

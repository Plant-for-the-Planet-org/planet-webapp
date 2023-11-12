import React, { ReactElement } from 'react';
import styles from '../RegisterModal.module.scss';
import { useDropzone } from 'react-dropzone';
import {
  deleteAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import getImageUrl from '../../../../utils/getImageURL';
import DeleteIcon from '../../../../../public/assets/images/icons/manageProjects/Delete';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { Button } from '@mui/material';
import { useTenant } from '../../../common/Layout/TenantContext';
interface Props {
  contribution: any;
  contributionGUID: any;
  token: any;
}

export default function UploadImages({
  contributionGUID,
  token,
  contribution,
}: Props): ReactElement {
  const [uploadedImages, setUploadedImages] = React.useState([]);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const { t, ready } = useTranslation(['me', 'common']);
  const { tenantConfig } = useTenant();
  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (event) => {
        uploadPhotos(event.target.result);
      };
    });
  }, []);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();

  const uploadPhotos = async (image: any) => {
    setIsUploadingData(true);
    const submitData = {
      imageFile: image,
      description: '',
    };

    try {
      const res = await postAuthenticatedRequest(
        tenantConfig?.tenantID,
        `/app/contributions/${contributionGUID}/images`,
        submitData,
        token,
        logoutUser
      );
      const newUploadedImages = uploadedImages;
      newUploadedImages.push(res);
      setUploadedImages(newUploadedImages);
      setIsUploadingData(false);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: onDrop,
    onDropAccepted: () => {
      console.log('uploading');
    },
    onFileDialogCancel: () => setIsUploadingData(false),
  });

  const deleteContributionImage = async (id: any) => {
    try {
      await deleteAuthenticatedRequest(
        tenantConfig?.tenantID,
        `/app/contributions/${contributionGUID}/images/${id}`,
        token,
        logoutUser
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

  return ready ? (
    <>
      {/* Change to field array of react hook form  */}
      {uploadedImages && uploadedImages.length > 0 ? (
        <InlineFormDisplayGroup>
          {uploadedImages.map((image, index) => {
            return (
              <div key={image.id}>
                <div className={styles.uploadedImageContainer}>
                  <img
                    src={getImageUrl('contribution', 'medium', image.image)}
                  />
                  {/* <div className={styles.uploadedImageOverlay}></div> */}
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
            onClick={uploadPhotos}
            variant="contained"
            color="primary"
            style={{ maxWidth: '200px' }}
          >
            <input {...getInputProps()} />
            {isUploadingData ? (
              <div className={'spinner'}></div>
            ) : (
              t('me:uploadPhotos')
            )}
          </Button>
          <p style={{ marginTop: '18px' }}>{t('me:dragHere')}</p>
        </label>
      </div>
    </>
  ) : (
    <></>
  );
}

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
  const [files, setFiles] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const { t, ready } = useTranslation(['me', 'common']);
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
  const { handleError } = React.useContext(ErrorHandlingContext);

  // React.useEffect(() => {
  //   // Fetch images of the project
  //   setUploadedImages(contribution.contributionImages);
  // }, [contribution]);

  const uploadPhotos = (image: any) => {
    setIsUploadingData(true);
    const submitData = {
      imageFile: image,
      description: '',
    };
    postAuthenticatedRequest(
      `/app/contributions/${contributionGUID}/images`,
      submitData,
      token,
      handleError
    )
      .then((res) => {
        if (!res.code) {
          const newUploadedImages = uploadedImages;
          newUploadedImages.push(res);
          setUploadedImages(newUploadedImages);
          setIsUploadingData(false);
          setErrorMessage(null);
        } else {
          if (res.code === 404) {
            setIsUploadingData(false);
            setErrorMessage(ready ? t('me:contribNotFound') : '');
          } else {
            setIsUploadingData(false);
            setErrorMessage(ready ? t('me:errorOccured') : '');
          }
        }
      })
      .catch((e) => console.log(e));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: onDrop,
    onDropAccepted: () => {
      console.log('uploading');
    },
    onFileDialogCancel: () => setIsUploadingData(false),
  });

  const deleteContributionImage = (id: any) => {
    deleteAuthenticatedRequest(
      `/app/contributions/${contributionGUID}/images/${id}`,
      token,
      handleError
    ).then((res) => {
      if (res !== 404) {
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
      }
    });
  };

  return ready ? (
    <>
      {/* Change to field array of react hook form  */}
      {uploadedImages && uploadedImages.length > 0 ? (
        <div className={styles.formField}>
          {uploadedImages.map((image, index) => {
            return (
              <div key={image.id} className={styles.formFieldHalf}>
                <div className={styles.uploadedImageContainer}>
                  <img
                    src={getImageUrl('contribution', 'medium', image.image)}
                  />
                  {/* <div className={styles.uploadedImageOverlay}></div> */}
                  <div className={styles.uploadedImageButtonContainer}>
                    <button
                      id={'uploadImgDelIcon'}
                      onClick={() => deleteContributionImage(image.id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <div className={styles.formFieldLarge}>
        <label
          htmlFor="upload"
          className={styles.fileUploadContainer}
          {...getRootProps()}
        >
          <button
            onClick={uploadPhotos}
            className="primaryButton"
            style={{ maxWidth: '200px' }}
          >
            <input {...getInputProps()} />
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('me:uploadPhotos')
            )}
          </button>
          <p style={{ marginTop: '18px' }}>{t('me:dragHere')}</p>
        </label>
      </div>
    </>
  ) : (
    <></>
  );
}

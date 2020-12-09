import React, { ReactElement } from 'react';
import styles from '../../styles/RegisterModal.module.scss';
import AnimatedButton from '../../../../common/InputTypes/AnimatedButton';
import { useDropzone } from 'react-dropzone';
import {
  deleteAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../../../utils/apiRequests/api';
import getImageUrl from '../../../../../utils/getImageURL';
import DeleteIcon from '../../../../../../public/assets/images/icons/manageProjects/Delete';
import i18next from '../../../../../../i18n';

interface Props {
  contribution: any;
  contributionGUID: any;
  token: any;
}

const { useTranslation } = i18next;

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
      token
    )
      .then((res) => {
        if (!res.code) {
          let newUploadedImages = uploadedImages;
          newUploadedImages.push(res);
          setUploadedImages(newUploadedImages);
          setIsUploadingData(false);
          setErrorMessage(null);
        } else {
          if (res.code === 404) {
            setIsUploadingData(false);
            setErrorMessage(t('me:contribNotFound'));
          } else {
            setIsUploadingData(false);
            setErrorMessage(t('me:errorOccured'));
            console.log(res.message);
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
    console.log(id);
    deleteAuthenticatedRequest(
      `/app/contributions/${contributionGUID}/images/${id}`,
      token
    ).then((res) => {
      if (res !== 404) {
        let uploadedImagesTemp = uploadedImages;
        let index = uploadedImagesTemp.findIndex((item) => {
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
                    <div onClick={() => deleteContributionImage(image.id)}>
                      <DeleteIcon />
                    </div>
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
          <AnimatedButton
            onClick={uploadPhotos}
            className={styles.continueButton}
          >
            <input {...getInputProps()} />
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('me:uploadPhotos')
            )}
          </AnimatedButton>
          <p style={{ marginTop: '18px' }}>{t('me:dragHere')}</p>
        </label>
      </div>
    </>
  ) : null;
}

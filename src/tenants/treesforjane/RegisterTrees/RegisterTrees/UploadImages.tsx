import React, { ReactElement } from 'react';
import styles from '../RegisterModal.module.scss';
import { useDropzone } from 'react-dropzone';
import getImageUrl from '../../../../utils/getImageURL';
import DeleteIcon from '../../../../../public/assets/images/icons/manageProjects/Delete';
import i18next from '../../../../../i18n';

interface Props {
  setImage: React.Dispatch<React.SetStateAction<string>>;
  image: String;
}

const { useTranslation } = i18next;

export default function UploadImages({ setImage, image }: Props): ReactElement {
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

  const uploadPhotos = (image: any) => {
    setIsUploadingData(true);
    setImage(image);
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
                      onClick={() => setImage(null)}
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
        {image ? (
          <div className={styles.uploadedImageContainer}>
            <img src={image} alt="tree" />
            <div className={styles.uploadedImageButtonContainer}>
              <button id={'uploadImgDelIcon'} onClick={() => setImage(null)}>
                <DeleteIcon />
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="upload"
            className={styles.fileUploadContainer}
            {...getRootProps()}
          >
            <button
              // onClick={uploadPhotos}
              className="primaryButton"
              style={{ maxWidth: '200px' }}
            >
              <input {...getInputProps()} />
              {t('me:uploadPhotos')}
            </button>
            <p style={{ marginTop: '18px' }}>{t('me:dragHere')}</p>
          </label>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}

import React, { ReactElement } from 'react';
import styles from '../../styles/RegisterModal.module.scss';
import AnimatedButton from '../../../../common/InputTypes/AnimatedButton';
import { useDropzone } from 'react-dropzone';
import { deleteAuthenticatedRequest, getAuthenticatedRequest, postAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import getImageUrl from '../../../../../utils/getImageURL';
import DeleteIcon from '../../../../../../public/assets/images/icons/manageProjects/Delete';

interface Props {
    contributionDetail: any;
    setContributionDetails: any;
    contributionGUID: any;
    setContributionGUID: any;
    session: any;
    handleNext: Function;
    errorMessage: any;
    setErrorMessage: Function;
}

export default function UploadImages({ contributionDetails, setContributionDetails, contributionGUID, setContributionGUID, handleNext, session, errorMessage, setErrorMessage, }: Props): ReactElement {

    const [uploadedImages, setUploadedImages] = React.useState([]);
    const [isUploadingData, setIsUploadingData] = React.useState(false);
    const [files, setFiles] = React.useState([]);

    const onDrop = React.useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: any) => {
            const reader = new FileReader()
            reader.readAsDataURL(file);
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = (event) => {
                uploadPhotos(event.target.result);
            }
        })

    }, [])

    React.useEffect(() => {
        // Fetch images of the project 
        if (contributionGUID && session?.accessToken)
            getAuthenticatedRequest(`/app/profile/contributions/${contributionGUID}?_scope=images`, session).then((result) => {
                setUploadedImages(result.images)
            })
    }, [contributionGUID]);

    const uploadPhotos = (image: any) => {
        setIsUploadingData(true)

        const submitData = {
            "imageFile": image,
            "description": '',
        }
        postAuthenticatedRequest(`/app/contributions/${contributionGUID}/images`, submitData, session).then((res) => {
            if (!res.code) {
                let newUploadedImages = uploadedImages;
                newUploadedImages.push(res)
                setUploadedImages(newUploadedImages)
                setIsUploadingData(false)
                setErrorMessage('')
            } else {
                if (res.code === 404) {
                    setIsUploadingData(false)
                    setErrorMessage('Contribution not found')
                }
                else {
                    setIsUploadingData(false)
                    setErrorMessage(res.message)
                }

            }


        })
    };

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

    const deleteContributionImage = (id: any) => {
        deleteAuthenticatedRequest(`/app/contributions/${contributionGUID}/images/${id}`, session).then(res => {
            if (res !== 404) {
                let uploadedFilesTemp = uploadedImages.filter(item => item.id !== id);
                setUploadedImages(uploadedFilesTemp)
            }
        })
    }
    return (
        <>
            {/* Change to field array of react hook form  */}
            {uploadedImages && uploadedImages.length > 0 ?
                <div className={styles.formField}>
                    {
                        uploadedImages.map((image, index) => {
                            return (
                                <div key={image.id} className={styles.formFieldHalf}>
                                    <div className={styles.uploadedImageContainer}>
                                        <img src={getImageUrl('contribution', 'medium', image.image)} />
                                        <div className={styles.uploadedImageOverlay}></div>
                                        <div className={styles.uploadedImageButtonContainer}>
                                            <div onClick={() => deleteContributionImage(image.id)}>
                                                <DeleteIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                : null}
            <div className={styles.formFieldLarge}>
                <label htmlFor="upload" className={styles.fileUploadContainer} {...getRootProps()}>
                    <AnimatedButton
                        onClick={uploadPhotos}
                        className={styles.continueButton}
                    >
                        <input {...getInputProps()} />
                Upload Photos

              </AnimatedButton>
                    <p style={{ marginTop: '18px' }}>
                        or drag here
                </p>
                </label>
                <div className={styles.formFieldLarge}>
                    <div onClick={handleNext} className={styles.continueButton}>Submit</div>
                </div>
            </div>
        </>
    )
}

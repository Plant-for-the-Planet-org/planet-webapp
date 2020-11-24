import React, { ReactElement } from 'react';
import styles from '../../styles/RegisterModal.module.scss';
import AnimatedButton from '../../../../common/InputTypes/AnimatedButton';
import { useDropzone } from 'react-dropzone';

interface Props {
    handleNext: Function;
}

export default function UploadImages({ handleNext }: Props): ReactElement {
    const uploadPhotos = (image: any) => {
        console.log('uploading');
    }

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
    return (
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
                <div onClick={handleNext} className={styles.continueButton}>Next</div>
            </div>
        </div>
    )
}

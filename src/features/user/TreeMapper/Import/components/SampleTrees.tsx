import React, { ReactElement } from 'react';
import styles from '../Import.module.scss';
import { useDropzone } from 'react-dropzone';
import {
  postAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../../utils/apiRequests/api';
import { UserPropsContext } from '../../../../common/Layout/UserPropsContext';
import i18next from '../../../../../../i18n';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import SampleTreeCard from './SampleTreeCard';

const { useTranslation } = i18next;

interface Props {
  handleNext: Function;
  errorMessage: String;
  setErrorMessage: Function;
  plantLocation: any;
  setPlantLocation: Function;
  userLang: string;
}

export default function SampleTrees({
  handleNext,
  errorMessage,
  setErrorMessage,
  plantLocation,
  setPlantLocation,
  userLang,
}: Props): ReactElement {
  const { t, ready } = useTranslation(['treemapper', 'common']);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [sampleTrees, setSampleTrees] = React.useState([]);
  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (event: any) => {
        setSampleTrees(event.target.result);
      };
    });
  }, []);

  const { user, token, contextLoaded } = React.useContext(UserPropsContext);

  const defaultValues = {
    sampleTrees: [
      {
        plantingDate: new Date(),
        treeTag: '',
        height: '',
        diameter: '',
        species: '',
        latitude: 0,
        longitude: 0,
      },
    ],
  };
  const {
    register,
    handleSubmit,
    errors,
    control,
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({ mode: 'onBlur', defaultValues: defaultValues });

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: 'sampleTrees',
  });

  const onSubmit = (data: any) => {
    setIsUploadingData(true);
    const submitData = {};

    // Check if GUID is set use update instead of create project
    if (plantLocation?.id) {
      putAuthenticatedRequest(
        `/app/projects/${plantLocation.id}`,
        submitData,
        token
      ).then((res: any) => {
        if (!res.code) {
          setErrorMessage('');
          setPlantLocation(res);
          setIsUploadingData(false);
          handleNext();
        } else {
          if (res.code === 404) {
            setIsUploadingData(false);
            setErrorMessage(res.message);
          } else if (res.code === 400) {
            setIsUploadingData(false);
            if (res.errors && res.errors.children) {
              //addServerErrors(res.errors.children, setError);
            }
          } else {
            setIsUploadingData(false);
            setErrorMessage(res.message);
          }
        }
      });
    } else {
      postAuthenticatedRequest(`/app/projects`, submitData, token).then(
        (res: any) => {
          if (!res.code) {
            setErrorMessage('');
            setPlantLocation(res);
            setIsUploadingData(false);
            handleNext();
          } else {
            if (res.code === 404) {
              setIsUploadingData(false);
              setErrorMessage(res.message);
            } else if (res.code === 400) {
              setIsUploadingData(false);
              if (res.errors && res.errors.children) {
                // addServerErrors(res.errors.children, setError);
              }
            } else {
              setIsUploadingData(false);
              setErrorMessage(res.message);
            }
          }
        }
      );
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // accept: 'text/*',
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {
      console.log('uploading');
    },
    onFileDialogCancel: () => setIsUploadingData(false),
  });
  return (
    <>
      <div className={styles.formFieldLarge}>
        Download the following CSV template to import sample tree data in the
        designated format.
        <div className={styles.downloadLink}>
          {t('treemapper:downloadCSVTemplate')}
        </div>
      </div>

      <div className={styles.formFieldLarge}>
        <label
          htmlFor="upload"
          className={styles.fileUploadContainer}
          {...getRootProps()}
        >
          <button
            // onClick={(image:any) => setImage(image)}
            className="primaryButton"
            style={{ maxWidth: '200px' }}
          >
            <input {...getInputProps()} />
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              'Import CSV'
            )}
          </button>
          <p style={{ marginTop: '18px' }}>{'File (csv)'}</p>
        </label>
      </div>
      <div className={styles.sampleTreeContainer}>
        {fields.map((item, index) => {
          return (
            <SampleTreeCard
              index={index}
              register={register}
              remove={remove}
              getValues={getValues}
              control={control}
              userLang={userLang}
              setValue={setValue}
            />
          );
        })}
      </div>

      <div
        onClick={() => {
          append({ name: '', count: 0 });
        }}
        className={styles.addSpeciesButton}
      >
        {t('treemapper:addAnotherSampleTree')}
      </div>
      <div className={`${styles.formField}`}>
        <div className={styles.formFieldHalf}>
          <button
            // onClick={handleSubmit(onSubmit)}
            onClick={() => handleNext()}
            className="primaryButton"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('treemapper:continue')
            )}
          </button>
        </div>
        <div className={styles.formFieldHalf}>
          <button
            // onClick={handleSubmit(onSubmit)}
            onClick={() => handleNext()}
            className="secondaryButton"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('treemapper:skip')
            )}
          </button>
        </div>
      </div>
    </>
  );
}

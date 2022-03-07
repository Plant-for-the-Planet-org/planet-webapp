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
import Papa from 'papaparse';

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
  const [uploadIndex, setUploadIndex] = React.useState(0);
  const [uploadStatus, setUploadStatus] = React.useState<string[]>([]);
  const [sampleTrees, setSampleTrees] = React.useState<Treemapper.SamplePlantLocation[]>([]);
  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (event: any) => {
        const csv = event.target.result;
        Papa.parse(csv, {
          header: true,
          complete: (results: any) => {
            const sampleTrees = results.data.map((sampleTree: any) => {
              return {
                ...sampleTree,
                otherSpecies: sampleTree.otherSpecies,
              };
            });
            addSampleTrees(sampleTrees);
          },
        });
      };
    });
  }, []);

  const defaultValues = {
    sampleTrees: [
      // {
      //   plantingDate: new Date(),
      //   treeTag: '',
      //   height: '',
      //   diameter: '',
      //   otherSpecies: '',
      //   latitude: 0,
      //   longitude: 0,
      // },
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

  // Add sample trees
  const test = [
    {
      plantingDate: new Date(),
      treeTag: 'test',
      height: '1',
      diameter: '10',
      otherSpecies: 'sspec_dReK4W4J0eg2Y51tJo',
      latitude: 10,
      longitude: 20,
    },
    {
      plantingDate: new Date(),
      treeTag: 'test',
      height: '1',
      diameter: '10',
      otherSpecies: 'sspec_dReK4W4J0eg2Y51tJo',
      latitude: 10,
      longitude: 20,
    },
    {
      plantingDate: new Date(),
      treeTag: 'test',
      height: '1',
      diameter: '10',
      otherSpecies: 'sspec_dReK4W4J0eg2Y51tJo',
      latitude: 10,
      longitude: 20,
    },
    {
      plantingDate: new Date(),
      treeTag: 'test',
      height: '1',
      diameter: '10',
      otherSpecies: 'sspec_dReK4W4J0eg2Y51tJo',
      latitude: 10,
      longitude: 20,
    },
    {
      plantingDate: new Date(),
      treeTag: 'test',
      height: '1',
      diameter: '10',
      otherSpecies: 'sspec_dReK4W4J0eg2Y51tJo',
      latitude: 10,
      longitude: 20,
    }
  ]

  const addSampleTrees = (sampleTrees: Treemapper.SamplePlantLocation[]) => {
    append(sampleTrees);
  };

  // React.useEffect(() => {

  // }, []);

  const { user, token, contextLoaded } = React.useContext(UserPropsContext);

  const uploadSampleTree = async (sampleTree: any, index: number) => {
    setUploadIndex(index);
    const newStatus = [...uploadStatus];
    newStatus[index] = 'uploading';
    setUploadStatus(newStatus);
    const res = await postAuthenticatedRequest(`/treemapper/plantLocations`, sampleTree, token);
    if (!res.code) {
      setErrorMessage('');
      const newSampleTrees = [...sampleTrees];
      newSampleTrees[index] = res;
      setSampleTrees(newSampleTrees);
      const newStatus = [...uploadStatus];
      newStatus[index] = 'success';
      setUploadStatus(newStatus);
    } else {
      const newStatus = [...uploadStatus];
      newStatus[index] = 'error';
      setUploadStatus(newStatus);
      if (res.code === 404) {
        setErrorMessage(res.message);
      } else if (res.code === 400) {
        if (res.errors && res.errors.children) {
          // addServerErrors(res.errors.children, setError);
        }
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  const onSubmit = async (data: any) => {
    console.log('data', data);
    setIsUploadingData(true);
    for (const [index, sampleTree] of data.sampleTrees.entries()) {
      const samplePl = {
        type: "sample",
        captureMode: "external",
        geometry: {
          coordinates: [
            Number(sampleTree.longitude),
            Number(sampleTree.latitude)
          ],
          type: "Point"
        },
        plantDate: new Date(sampleTree.plantingDate).toISOString(),
        registrationDate: new Date().toISOString(),
        measurements: {
          height: Number(sampleTree.height),
          width: Number(sampleTree.diameter),
        },
        tag: sampleTree.treeTag,
        otherSpecies: sampleTree.otherSpecies,
        parent: plantLocation.id,
      }
      await uploadSampleTree(samplePl, index);
    }
    setIsUploadingData(false);
    handleNext();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ['.csv'],
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {
      console.log('uploading');
    },
    onFileDialogCancel: () => setIsUploadingData(false),
  });

  const csvTemplate = [['plantingDate', 'treeTag', 'height', 'diameter', 'otherSpecies', 'latitude', 'longitude']];
  const csv = Papa.unparse(csvTemplate);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  return (
    <>
      <div className={styles.formFieldLarge}>
        {t('treemapper:downloadExplanation')}
        <a href={url} download="Sample CSV Template" className={styles.downloadLink}>
          {t('treemapper:downloadCSVTemplate')}
        </a>
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
              t('treemapper:importCSV')
            )}
          </button>
          <p style={{ marginTop: '18px' }}>{t('treemapper:fileFormatCSV')}</p>
        </label>
      </div>
      <div className={styles.sampleTreeContainer}>
        {fields.map((item, index) => {
          return (
            <SampleTreeCard
              key={index}
              index={index}
              register={register}
              remove={remove}
              getValues={getValues}
              control={control}
              userLang={userLang}
              setValue={setValue}
              item={item}
              plantLocation={plantLocation}
              errors={errors}
            />
          );
        })}
      </div>

      <div
        onClick={() => {
          append({
            plantingDate: new Date(),
            treeTag: '',
            height: '',
            diameter: '',
            otherSpecies: '',
            latitude: '',
            longitude: '',
          });
        }}
        className={styles.addSpeciesButton}
      >
        {fields.length === 0 ?
          t('treemapper:addSampleTree')
          :
          t('treemapper:addAnotherSampleTree')}
      </div>
      <div className={`${styles.formField}`}>
        <div className={styles.formFieldHalf}>
          <button
            onClick={handleSubmit(onSubmit)}
            // onClick={() => handleNext()}
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

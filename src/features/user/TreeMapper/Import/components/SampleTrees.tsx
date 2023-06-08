import React, { ReactElement } from 'react';
import styles from '../Import.module.scss';
import { useDropzone } from 'react-dropzone';
import { postAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useTranslation } from 'next-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import SampleTreeCard from './SampleTreeCard';
import Papa from 'papaparse';
import { handleError, APIError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';

interface Props {
  handleNext: Function;
  plantLocation: any;
  userLang: string;
}

type SampleTree = {
  plantingDate: Date;
  treeTag: string;
  height: string;
  diameter: string;
  otherSpecies: string;
  latitude: string;
  longitude: string;
};

type FormData = {
  sampleTrees: SampleTree[];
};

export default function SampleTrees({
  handleNext,
  plantLocation,
  userLang,
}: Props): ReactElement {
  const { t } = useTranslation(['treemapper', 'common']);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [uploadIndex, setUploadIndex] = React.useState(0);
  const [uploadStatus, setUploadStatus] = React.useState<string[]>([]);
  const [sampleTrees, setSampleTrees] = React.useState<SampleTree[]>([]);

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onBlur', defaultValues: { sampleTrees: [] } });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sampleTrees',
  });

  const addSampleTrees = (sampleTrees: SampleTree[]) => {
    append(sampleTrees);
  };

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
            const sampleTrees = results.data.map((sampleTree: SampleTree) => {
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

  const { token, logoutUser } = useUserProps();

  const uploadSampleTree = async (sampleTree: SampleTree, index: number) => {
    setUploadIndex(index);
    const newStatus = [...uploadStatus];
    newStatus[index] = 'uploading';
    setUploadStatus(newStatus);

    try {
      const res = await postAuthenticatedRequest(
        `/treemapper/plantLocations`,
        sampleTree,
        token,
        logoutUser
      );
      const newSampleTrees = [...sampleTrees];
      newSampleTrees[index] = res;
      setSampleTrees(newSampleTrees);
      const newStatus = [...uploadStatus];
      newStatus[index] = 'success';
      setUploadStatus(newStatus);
    } catch (err) {
      const newStatus = [...uploadStatus];
      newStatus[index] = 'error';
      setUploadStatus(newStatus);
      setErrors(handleError(err as APIError));
    }
  };

  const onSubmit = async (data: any) => {
    if (data.sampleTrees?.length > 0) {
      setIsUploadingData(true);
      for (const [index, sampleTree] of data.sampleTrees.entries()) {
        const samplePl = {
          type: 'sample',
          captureMode: 'external',
          geometry: {
            coordinates: [
              Number(sampleTree.longitude),
              Number(sampleTree.latitude),
            ],
            type: 'Point',
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
        };
        await uploadSampleTree(samplePl, index);
      }
      setIsUploadingData(false);
      handleNext();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ['.csv'],
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {},
    onFileDialogCancel: () => setIsUploadingData(false),
  });

  const csvTemplate = [
    [
      'plantingDate',
      'treeTag',
      'height',
      'diameter',
      'otherSpecies',
      'latitude',
      'longitude',
    ],
    [
      'Date format - DD/MM/YYYY',
      'text',
      'height in meters',
      'diameter in centimeters',
      'Scientific Species',
      'valid coordinate',
      'valid coordinate',
    ],
    [
      new Date().toLocaleDateString('en-US'),
      'test',
      '1',
      '10',
      'Sample Name',
      '26.78590',
      '92.04986',
    ],
  ];
  const csv = Papa.unparse(csvTemplate);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  return (
    <>
      <div className={styles.formFieldLarge}>
        {t('treemapper:downloadExplanation')}
        <a
          href={url}
          download="Sample CSV Template"
          className={styles.downloadLink}
        >
          {t('treemapper:downloadCSVTemplate')}
        </a>
      </div>

      <div className={styles.formFieldLarge}>
        <label
          htmlFor="upload"
          className={styles.fileUploadContainer}
          {...getRootProps()}
        >
          <button className="primaryButton" style={{ maxWidth: '200px' }}>
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
        {fields &&
          fields.map((item, index) => {
            return (
              <SampleTreeCard
                key={item.id}
                index={index}
                remove={remove}
                getValues={getValues}
                control={control}
                userLang={userLang}
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
        {fields.length === 0
          ? t('treemapper:addSampleTree')
          : t('treemapper:addAnotherSampleTree')}
      </div>
      <div className={styles.formField}>
        <div className={styles.formFieldHalf}>
          <button onClick={handleSubmit(onSubmit)} className="primaryButton">
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('treemapper:continue')
            )}
          </button>
        </div>
        <div className={styles.formFieldHalf}>
          <button onClick={() => handleNext()} className="secondaryButton">
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

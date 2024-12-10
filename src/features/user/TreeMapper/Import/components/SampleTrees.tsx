import type { ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type { Geometry } from '@turf/turf';
import type { FileImportError } from '../../../BulkCodes/BulkCodesTypes';
import type {
  Measurements,
  PlantLocationMulti,
  SampleTree,
} from '../../../../common/types/plantLocation';

import React, { useState } from 'react';
import styles from '../Import.module.scss';
import { useDropzone } from 'react-dropzone';
import { postAuthenticatedRequest } from '../../../../../utils/apiRequests/api';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { useTranslations } from 'next-intl';
import { useForm, useFieldArray } from 'react-hook-form';
import SampleTreeCard from './SampleTreeCard';
import Papa from 'papaparse';
import { handleError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { Button } from '@mui/material';
import { useTenant } from '../../../../common/Layout/TenantContext';

interface Props {
  handleNext: Function;
  plantLocation: PlantLocationMulti;
  userLang: string;
}

type FormData = {
  sampleTrees: SampleTree[];
};

export default function SampleTrees({
  handleNext,
  plantLocation,
  userLang,
}: Props): ReactElement {
  const tTreemapper = useTranslations('Treemapper');
  const tBulkCodes = useTranslations('BulkCodes');
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<string[]>([]);
  const [sampleTrees, setSampleTrees] = React.useState<SampleTree[]>([]);
  const { tenantConfig } = useTenant();
  const [parseError, setParseError] = useState<FileImportError | null>(null);
  const [hasIgnoredColumns, setHasIgnoredColumns] = useState(false);

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

  const acceptedHeaders = [
    'plantingDate',
    'treeTag',
    'height',
    'diameter',
    'otherSpecies',
    'latitude',
    'longitude',
  ];

  const checkHeaderValidity = (
    headers: string[]
  ): { isValid: boolean; missingColumns: string[] } => {
    let isValid = true;
    const missingColumns = [];
    for (const acceptedHeader of acceptedHeaders) {
      if (!headers.includes(acceptedHeader)) {
        isValid = false;
        missingColumns.push(acceptedHeader);
      }
    }
    return {
      isValid,
      missingColumns,
    };
  };

  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      setParseError(null);
      setHasIgnoredColumns(false);
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (event) => {
        const csv = event.target?.result;
        if (typeof csv !== 'string') return;
        Papa.parse<SampleTree>(csv, {
          header: true,
          complete: (results) => {
            const parsedHeaders = results.meta.fields || [];
            const headerValidity = checkHeaderValidity(parsedHeaders);
            const resultsData = results.data;
            if (headerValidity.isValid) {
              parsedHeaders.length > 7
                ? setHasIgnoredColumns(true)
                : setHasIgnoredColumns(false);
              const sampleTrees = resultsData.map((sampleTree) => {
                return {
                  ...sampleTree,
                  otherSpecies: sampleTree.otherSpecies,
                };
              });
              addSampleTrees(sampleTrees);
            } else {
              setParseError({
                type: 'missingColumns',
                message: `${tBulkCodes(
                  'errorUploadCSV.missingColumns'
                )} ${headerValidity.missingColumns.join(', ')}`,
              });
            }
          },
        });
      };
    });
  }, []);

  const { token, logoutUser } = useUserProps();

  const uploadSampleTree = async (
    sampleTree: SampleTreeRequestData,
    index: number
  ) => {
    const newStatus = [...uploadStatus];
    newStatus[index] = 'uploading';
    setUploadStatus(newStatus);

    try {
      const res: SampleTree = await postAuthenticatedRequest(
        tenantConfig?.id,
        `/treemapper/interventions`,
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

  const onSubmit = async (data: FormData) => {
    if (data.sampleTrees?.length > 0) {
      setIsUploadingData(true);
      for (const [index, sampleTree] of data.sampleTrees.entries()) {
        const samplePl = {
          type: 'sample-tree-registration',
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
          parent: plantLocation?.id,
          plantProject: plantLocation?.plantProject,
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
        {tTreemapper('downloadExplanation')}
        <a
          href={url}
          download="Sample CSV Template"
          className={styles.downloadLink}
        >
          {tTreemapper('downloadCSVTemplate')}
        </a>
      </div>

      <div className={styles.formFieldLarge}>
        <label
          htmlFor="upload"
          className={styles.fileUploadContainer}
          {...getRootProps()}
        >
          <Button variant="contained" color="primary">
            <input {...getInputProps()} />
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              tTreemapper('importCSV')
            )}
          </Button>
          <p style={{ marginTop: '18px' }}>{tTreemapper('fileFormatCSV')}</p>
        </label>
      </div>
      {parseError && <p style={{ color: '#e53935' }}>{parseError.message}</p>}
      {hasIgnoredColumns && (
        <p style={{ color: '#e53935' }}>
          {tTreemapper('ignoredColumnsWarning')}
        </p>
      )}
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
          ? tTreemapper('addSampleTree')
          : tTreemapper('addAnotherSampleTree')}
      </div>
      <div className={styles.formField}>
        <div className={styles.formFieldHalf}>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              tTreemapper('continue')
            )}
          </Button>
        </div>
        <div className={styles.formFieldHalf}>
          <Button
            onClick={() => handleNext()}
            variant="contained"
            color="inherit"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              tTreemapper('skip')
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

interface SampleTreeRequestData {
  type: string;
  captureMode: string;
  geometry: Geometry;
  plantDate: string;
  registrationDate: string;
  measurements: Measurements;
  tag: string;
  otherSpecies: string;
  parent: string | undefined;
  plantProject: string;
}

import React, { ReactElement } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import styles from '../Import.module.scss';
import { useTranslation } from 'next-i18next';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '../../../../../../public/assets/images/icons/manageProjects/Delete';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { MenuItem, SxProps } from '@mui/material';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import {
  getAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../../../utils/apiRequests/api';
import tj from '@mapbox/togeojson';
import gjv from 'geojson-validation';
import flatten from 'geojson-flatten';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import themeProperties from '../../../../../theme/themeProperties';
import { handleError, APIError, ProjectMapInfo } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';

const dialogSx: SxProps = {
  '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected': {
    backgroundColor: themeProperties.primaryColor,
    color: '#fff',
  },

  '& .MuiPickersDay-dayWithMargin': {
    '&:hover': {
      backgroundColor: themeProperties.primaryColor,
      color: '#fff',
    },
  },
  '.MuiDialogActions-root': {
    paddingBottom: '12px',
  },
};

interface Props {
  handleNext: () => void;
  userLang: string;
  plantLocation: any;
  setPlantLocation: Function;
  geoJson: any;
  setGeoJson: Function;
  activeMethod: string;
  setActiveMethod: Function;
}

export default function PlantingLocation({
  handleNext,
  userLang,
  plantLocation,
  setPlantLocation,
  geoJson,
  setGeoJson,
  activeMethod,
  setActiveMethod,
}: Props): ReactElement {
  const { user, token, contextLoaded, logoutUser } = useUserProps();

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [projects, setProjects] = React.useState<ProjectMapInfo[]>([]);
  const importMethods = ['import', 'editor'];
  const [geoJsonError, setGeoJsonError] = React.useState(false);
  const [mySpecies, setMySpecies] = React.useState(null);
  const { setErrors } = React.useContext(ErrorHandlingContext);

  const { t } = useTranslation(['treemapper', 'common', 'maps']);
  const defaultValues = {
    plantDate: new Date(),
    plantProject: '',
    geometry: {},
    plantedSpecies: [
      {
        otherSpecies: '',
        treeCount: 0,
      },
    ],
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: plantLocation ? plantLocation : defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'plantedSpecies',
  });

  const loadProjects = async () => {
    try {
      const projects = await getAuthenticatedRequest<ProjectMapInfo[]>(
        '/app/profile/projects',
        token,
        logoutUser
      );
      setProjects(projects);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  const loadMySpecies = async () => {
    try {
      const species = await getAuthenticatedRequest(
        '/treemapper/species',
        token,
        logoutUser
      );
      setMySpecies(species);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  React.useEffect(() => {
    if (contextLoaded) {
      loadProjects();
      loadMySpecies();
    }
  }, [contextLoaded]);

  const normalizeGeoJson = (geoJson: any) => {
    if (gjv.isGeoJSONObject(geoJson) && geoJson.features?.length > 0) {
      const flattened = flatten(geoJson);
      if (flattened.features[0]?.geometry?.type === 'Polygon') {
        setGeoJsonError(false);
        setGeoJson(flattened.features[0].geometry);
        setActiveMethod('editor');
      } else {
        setGeoJsonError(true);
      }
    } else if (geoJson?.type && geoJson.type === 'Polygon') {
      setGeoJsonError(false);
      setGeoJson(geoJson);
      setActiveMethod('editor');
    } else {
      setGeoJsonError(true);
    }
  };

  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (event: any) => {
        const fileType =
          file.name.substring(
            file.name.lastIndexOf('.') + 1,
            file.name.length
          ) || file.name;
        if (fileType === 'kml') {
          reader.readAsText(file);
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = (event: any) => {
            const dom = new DOMParser().parseFromString(
              event.target.result,
              'text/xml'
            );
            const geo = tj.kml(dom);
            if (gjv.isGeoJSONObject(geo) && geo.features.length !== 0) {
              const flattened = flatten(geo);
              if (flattened.features[0].geometry.type === 'Polygon') {
                setGeoJsonError(false);
                setGeoJson(flattened.features[0].geometry);
                setActiveMethod('editor');
              } else {
                setGeoJsonError(true);
              }
            } else {
              setGeoJsonError(true);
            }
          };
        } else if (fileType === 'geojson') {
          reader.readAsText(file);
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = (event) => {
            const geo = JSON.parse(event.target.result);
            normalizeGeoJson(geo);
          };
        }
      };
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ['.geojson', '.kml'],
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {},
    onFileDialogCancel: () => setIsUploadingData(false),
  });

  const onSubmit = async (data: any) => {
    if (geoJson) {
      setIsUploadingData(true);
      const submitData = {
        type: 'multi',
        captureMode: 'external',
        geometry: geoJson,
        plantedSpecies: data.plantedSpecies,
        plantDate: data.plantDate.toISOString(),
        registrationDate: new Date().toISOString(),
        plantProject: data.plantProject,
      };

      try {
        const res = await postAuthenticatedRequest(
          `/treemapper/plantLocations`,
          submitData,
          token,
          logoutUser
        );
        setPlantLocation(res);
        setIsUploadingData(false);
        handleNext();
      } catch (err) {
        setErrors(handleError(err as APIError));
        setIsUploadingData(false);
      }
    } else {
      setGeoJsonError(true);
    }
  };

  const getMethod = (method: string) => {
    switch (method) {
      case 'import':
        return (
          <>
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
                  t('treemapper:uploadFile')
                )}
              </button>
              <p style={{ marginTop: '18px' }}>
                {t('treemapper:fileFormatKML')}
              </p>
            </label>
          </>
        );
      case 'editor':
        return (
          <>
            <JSONInput
              id="json-editor"
              placeholder={geoJson}
              onChange={(json: any) => normalizeGeoJson(json.jsObject)}
              locale={locale}
              height="220px"
              width="100%"
            />
          </>
        );
      // case 'draw':
      //   return (
      //     <div className={styles.drawMapText}>draw on map on the right</div>
      //   );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.formField}>
        <div className={styles.formFieldLarge}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={
              localeMapForDate[userLang]
                ? localeMapForDate[userLang]
                : localeMapForDate['en']
            }
          >
            <Controller
              name="plantDate"
              control={control}
              rules={{ required: t('me:datePlantedRequired') }}
              render={({ field: { onChange, value } }) => (
                <MuiDatePicker
                  label={t('me:datePlanted')}
                  value={value}
                  onChange={onChange}
                  renderInput={(props) => <MaterialTextField {...props} />}
                  disableFuture
                  inputFormat="MMMM d, yyyy"
                  DialogProps={{
                    sx: dialogSx,
                  }}
                />
              )}
            />
          </LocalizationProvider>
          {errors.plantDate && (
            <span className={styles.errorMessage}>
              {errors.plantDate.message}
            </span>
          )}
        </div>
      </div>

      {user && user?.type === 'tpo' && (
        <div className={styles.formFieldLarge}>
          <Controller
            name="plantProject"
            control={control}
            rules={{
              required: t('treemapper:projectRequired'),
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <MaterialTextField
                label={t('me:project')}
                variant="outlined"
                select
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              >
                {projects.map((option) => (
                  <MenuItem
                    key={option.properties.id}
                    value={option.properties.id}
                  >
                    {option.properties.name}
                  </MenuItem>
                ))}
              </MaterialTextField>
            )}
          />
          {errors.plantProject && (
            <span className={styles.errorMessage}>
              {errors.plantProject.message}
            </span>
          )}
        </div>
      )}
      <div className={styles.formFieldLarge}>
        <div className={styles.importTabs}>
          {importMethods.map((method, index) => (
            <div
              key={index}
              onClick={() => setActiveMethod(method)}
              className={`${styles.importTab} ${
                activeMethod === method ? styles.active : ''
              }`}
            >
              {t(`treemapper:${method}`)}
            </div>
          ))}
        </div>
        {getMethod(activeMethod)}
        <div className={styles.errorMessage}>
          {geoJsonError && t('treemapper:geoJsonError')}
        </div>
      </div>
      <div className={styles.formSubTitle}>{t('maps:speciesPlanted')}</div>
      {mySpecies &&
        fields.map((item, index) => {
          return (
            <PlantedSpecies
              key={index}
              index={index}
              t={t}
              remove={remove}
              errors={errors}
              item={item}
              control={control}
            />
          );
        })}
      <div
        onClick={() => {
          append({
            otherSpecies: '',
            treeCount: 0,
          });
        }}
        className={styles.addSpeciesButton}
      >
        {t('treemapper:addAnotherSpecies')}
      </div>

      <div className={`${styles.formFieldLarge}`}>
        <button
          id={'basicDetailsCont'}
          onClick={handleSubmit(onSubmit)}
          className="primaryButton"
          style={{ minWidth: '240px' }}
        >
          {isUploadingData ? (
            <div className={styles.spinner}></div>
          ) : (
            t('treemapper:continue')
          )}
        </button>
      </div>
    </>
  );
}
interface SpeciesProps {
  index: number;
  t: Function;
  remove: Function;
  errors: any;
  item: any;
  control: any;
}

function PlantedSpecies({
  index,
  t,
  remove,
  errors,
  item,
  control,
}: SpeciesProps): ReactElement {
  return (
    <div key={item.id} className={styles.speciesFieldGroup}>
      <div className={styles.speciesNameField}>
        {/* <SpeciesSelect label={t('treemapper:species')} name={`plantedSpecies[${index}].species`} mySpecies={mySpecies} control={control} /> */}
        <Controller
          name={`plantedSpecies[${index}].otherSpecies`}
          control={control}
          rules={{
            required:
              index > 0 ? false : t('treemapper:atLeastOneSpeciesRequired'),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MaterialTextField
              label={t('treeSpecies')}
              variant="outlined"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.plantedSpecies &&
          errors.plantedSpecies[index]?.otherSpecies && (
            <span className={styles.errorMessage}>
              {errors.plantedSpecies[index]?.otherSpecies &&
                errors.plantedSpecies[index]?.otherSpecies.message}
            </span>
          )}
      </div>
      <div className={styles.speciesCountField}>
        <Controller
          name={`plantedSpecies[${index}].treeCount`}
          control={control}
          rules={{
            required: index > 0 ? false : t('treemapper:treesRequired'),
            validate: (value: any) => {
              return parseInt(value, 10) >= 1
                ? true
                : t('treemapper:treesRequired');
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MaterialTextField
              label={t('treemapper:count')}
              variant="outlined"
              onChange={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                onChange(e.target.value);
              }}
              value={value > 0 ? value : ''}
              onBlur={onBlur}
            />
          )}
        />

        {errors.plantedSpecies && errors.plantedSpecies[index]?.treeCount && (
          <span className={styles.errorMessage}>
            {errors.plantedSpecies[index]?.treeCount &&
              errors.plantedSpecies[index]?.treeCount.message}
          </span>
        )}
      </div>
      {index > 0 ? (
        <div
          onClick={() => remove(index)}
          className={`${styles.speciesDeleteField} ${styles.deleteActive}`}
        >
          <DeleteIcon />
        </div>
      ) : (
        <div className={styles.speciesDeleteField}></div>
      )}
    </div>
  );
}

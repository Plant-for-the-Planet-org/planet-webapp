import React, { ReactElement } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import styles from '../Import.module.scss';
import i18next from '../../../../../../i18n';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';
import materialTheme from '../../../../../theme/themeStyles';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '../../../../../../public/assets/images/icons/manageProjects/Delete';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { MenuItem } from '@material-ui/core';
import { UserPropsContext } from '../../../../common/Layout/UserPropsContext';
import {
  getAuthenticatedRequest,
  postAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../../utils/apiRequests/api';
import tj from '@mapbox/togeojson';
import gjv from 'geojson-validation';
import flatten from 'geojson-flatten';

const { useTranslation } = i18next;

interface Props {
  handleNext: Function;
  errorMessage: String;
  setErrorMessage: Function;
  userLang: String;
  plantLocation: any;
  setPlantLocation: Function;
  geoJson: any;
  setGeoJson: Function;
  activeMethod: String;
  setActiveMethod: Function;
}

export default function PlantingLocation({
  handleNext,
  errorMessage,
  setErrorMessage,
  userLang,
  plantLocation,
  setPlantLocation,
  geoJson,
  setGeoJson,
  activeMethod, 
  setActiveMethod
}: Props): ReactElement {
  const { user, token, contextLoaded } = React.useContext(UserPropsContext);

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  const importMethods = ['import', 'editor', 'draw'];
  const [geoJsonError, setGeoJsonError] = React.useState(false);

  const { t, ready } = useTranslation(['treemapper', 'common']);
  const defaultValues = {
    plantDate: new Date(),
    plantProject: '',
    geometry: {},
    plantedSpecies: [
      {
        scientificSpecies: '',
        treeCount: 0,
      },
    ],
  };
  const { register, handleSubmit, errors, control, reset, setValue, watch } =
    useForm({ mode: 'onBlur', defaultValues: defaultValues });

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: 'plantedSpecies',
  });

  async function loadProjects() {
    await getAuthenticatedRequest('/app/profile/projects', token).then(
      (projects: any) => {
        setProjects(projects);
      }
    );
  }

  React.useEffect(() => {
    if (contextLoaded) {
      loadProjects();
    }
  }, [contextLoaded]);

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
              console.log('invalid geojson');
            }
          };
        }
      };
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ['.geojson', '.kml'],
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {
      console.log('uploading');
    },
    onFileDialogCancel: () => setIsUploadingData(false),
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
              <button
                // onClick={(image:any) => setImage(image)}
                className="primaryButton"
                style={{ maxWidth: '200px' }}
              >
                <input {...getInputProps()} />
                {isUploadingData ? (
                  <div className={styles.spinner}></div>
                ) : (
                  'Upload File'
                )}
              </button>
              <p style={{ marginTop: '18px' }}>{'File (geojson/kml)'}</p>
            </label>
          </>
        );
      case 'editor':
        return (
          <>
            <JSONInput
              id="json-editor"
              placeholder={geoJson}
              onChange={(json: any) => setGeoJson(json.jsObject)}
              locale={locale}
              height="220px"
              width="100%"
            />
          </>
        );
      case 'draw':
        return (
          <div className={styles.drawMapText}>draw on map on the right</div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.formField}>
        <div className={styles.formFieldLarge}>
          <ThemeProvider theme={materialTheme}>
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}
              locale={
                localeMapForDate[userLang]
                  ? localeMapForDate[userLang]
                  : localeMapForDate['en']
              }
            >
              <Controller
                render={(properties) => (
                  <DatePicker
                    label={t('me:datePlanted')}
                    value={properties.value}
                    onChange={properties.onChange}
                    inputVariant="outlined"
                    TextFieldComponent={MaterialTextField}
                    autoOk
                    disableFuture
                    format="MMMM d, yyyy"
                  />
                )}
                name="plantDate"
                control={control}
                defaultValue=""
              />
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </div>
      </div>
      {user && user.type === 'tpo' && (
        <div className={styles.formFieldLarge}>
          <Controller
            as={
              <MaterialTextField
                label={t('me:project')}
                variant="outlined"
                select
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
            }
            name="plantProject"
            control={control}
          />
          {errors.plantProject && (
            <span className={styles.formErrors}>
              {errors.plantProject.message}
            </span>
          )}
        </div>
      )}
      <div className={styles.formFieldLarge}>
        <div className={styles.importTabs}>
          {importMethods.map((method, index) => (
            <div
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
      </div>
      <div className={styles.formSubTitle}>Species Planted</div>
      {fields.map((item, index) => {
        return (
          <div key={index} className={styles.speciesFieldGroup}>
            <div className={styles.speciesNameField}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: t('speciesIsRequired'),
                  },
                })}
                label={t('treeSpecies')}
                variant="outlined"
                name={`plantedSpecies[${index}].scientificSpecies`}
              />
            </div>
            <div className={styles.speciesCountField}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: t('treesRequired'),
                  },
                  validate: (value) => parseInt(value, 10) >= 1,
                })}
                onInput={(e: any) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                label={t('count')}
                variant="outlined"
                name={`plantedSpecies[${index}].treeCount`}
              />
            </div>
            {index > 0 ? (
              <div
                onClick={() => remove(index)}
                className={styles.speciesDeleteField}
              >
                <DeleteIcon />
              </div>
            ) : (
              <div className={styles.speciesDeleteField}></div>
            )}
          </div>
        );
      })}
      <div
        onClick={() => {
          append({ scientificSpecies: '', treeCount: 0 });
        }}
        className={styles.addSpeciesButton}
      >
        {t('treemapper:addAnotherSpecies')}
      </div>

      <div className={`${styles.formFieldLarge}`}>
        <button
          id={'basicDetailsCont'}
          // onClick={handleSubmit(onSubmit)}
          onClick={() => handleNext()}
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

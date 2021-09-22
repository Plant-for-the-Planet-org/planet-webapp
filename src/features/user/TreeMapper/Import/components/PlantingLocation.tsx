import React, { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { getAuthenticatedRequest } from '../../../../../utils/apiRequests/api';

const { useTranslation } = i18next;

interface Props {
  handleNext: Function;
  errorMessage: String;
  setErrorMessage: Function;
  userLang: String;
}

export default function PlantingLocation({
  handleNext,
  errorMessage,
  setErrorMessage,
  userLang,
}: Props): ReactElement {
  const { user, token, contextLoaded } = React.useContext(UserPropsContext);

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [geoJson, setGeoJson] = React.useState(null);

  const [projects, setProjects] = React.useState([]);

  const importMethods = ['fileUpload', 'jsonEditor', 'map'];
  const [activeMethod, setActiveMethod] = React.useState(importMethods[0]);

  const { t, ready } = useTranslation(['treemapper', 'common']);
  const defaultValues = {
    treeCount: '',
    species: '',
    plantingDate: new Date(),
    geometry: {},
  };
  const { register, handleSubmit, errors, control, reset, setValue, watch } =
    useForm({ mode: 'onBlur', defaultValues: defaultValues });

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
        setGeoJson(event.target.result);
      };
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // accept: 'text/*',
    multiple: false,
    onDrop: onDrop,
    onDropAccepted: () => {
      console.log('uploading');
    },
    onFileDialogCancel: () => setIsUploadingData(false),
  });

  const getMethod = (method: string) => {
    switch (method) {
      case 'fileUpload':
        return (
          <>
            {geoJson ? (
              <div className={styles.uploadedImageContainer}>
                {/* <img src={geoJson} alt="tree" /> */}
                <div className={styles.uploadedImageButtonContainer}>
                  <button
                    id={'uploadImgDelIcon'}
                    onClick={() => setGeoJson(null)}
                  >
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
            )}
          </>
        );
      case 'jsonEditor':
        return (
          <>
            <JSONInput
              id="json-editor"
              placeholder={geoJson}
              onChange={(json: any) => setGeoJson(json)}
              locale={locale}
              height="220px"
              width="100%"
            />
          </>
        );
      case 'map':
        return <div>draw on map on the right</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.formField}>
        <div className={styles.formFieldFull}>
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
                name="plantingDate"
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
      <div>Species Planted</div>
      <div className={styles.formField}>
        <div className={styles.formFieldFull}>
          <MaterialTextField
            inputRef={register({
              required: {
                value: true,
                message: t('me:speciesIsRequired'),
              },
            })}
            label={t('me:treeSpecies')}
            variant="outlined"
            name="species"
          />
          {errors.species && (
            <span className={styles.formErrors}>{errors.species.message}</span>
          )}
        </div>
        <div className={styles.formFieldHalf}>
          <MaterialTextField
            inputRef={register({
              required: {
                value: true,
                message: t('me:treesRequired'),
              },
              validate: (value) => parseInt(value, 10) >= 1,
            })}
            onInput={(e:any) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            label={t('me:noOfTrees')}
            variant="outlined"
            name="treeCount"
          />
          {errors.treeCount && (
            <span className={styles.formErrors}>
              {errors.treeCount.message
                ? errors.treeCount.message
                : t('me:moreThanOne')}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

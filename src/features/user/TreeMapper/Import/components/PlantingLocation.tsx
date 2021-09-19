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
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [geoJsonFile, setGeoJsonFile] = React.useState(null);

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

  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (event: any) => {
        setGeoJsonFile(event.target.result);
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
            {geoJsonFile ? (
              <div className={styles.uploadedImageContainer}>
                {/* <img src={geoJsonFile} alt="tree" /> */}
                <div className={styles.uploadedImageButtonContainer}>
                  <button
                    id={'uploadImgDelIcon'}
                    onClick={() => setGeoJsonFile(null)}
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
            <MaterialTextField
              label={t('manageProjects:aboutProject')}
              variant="outlined"
              name="description"
              multiline
              inputRef={register({
                required: {
                  value: true,
                  message: t('manageProjects:aboutProjectValidation'),
                },
              })}
            />
            {errors.description && (
              <span className={styles.formErrors}>
                {errors.description.message}
              </span>
            )}
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
        <div className={styles.formFieldHalf}>
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
      <div className={styles.formFieldLarge}>
        <MaterialTextField
          inputRef={register({
            required: {
              value: true,
              message: t('me:speciesIsRequired'),
            },
          })}
          label={t('me:plantProject')}
          variant="outlined"
          name="species"
        />
        {errors.species && (
          <span className={styles.formErrors}>{errors.species.message}</span>
        )}
      </div>
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
    </>
  );
}

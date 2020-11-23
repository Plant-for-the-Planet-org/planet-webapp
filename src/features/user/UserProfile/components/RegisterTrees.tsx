import React from 'react';
import styles from '../styles/RegisterModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';
import { Controller, useForm } from 'react-hook-form';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useDropzone } from 'react-dropzone';
import MapGL, {
  FlyToInterpolator,
  Marker,
  NavigationControl,
  WebMercatorViewport,
} from 'react-map-gl';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import InfoIcon from '../../../../../public/assets/images/icons/manageProjects/Info';
import * as d3 from 'd3-ease';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';

const { useTranslation } = i18next;
export default function RegisterTrees({
}: any) {
  const { t } = useTranslation(['me', 'common']);
  const [selectedTab, setSelectedTab] = React.useState('single');
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 767;
  const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
  const defaultZoom = isMobile ? 1 : 1.4;
  const [plantLocation, setplantLocation] = React.useState([
    defaultMapCenter[0],
    defaultMapCenter[1],
  ]);

  const [viewport, setViewPort] = React.useState({
    width: '100%',
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const [userLang, setUserLang] = React.useState('en')
  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      let userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }
  }, [])

  const {
    register,
    handleSubmit,
    errors,
    control,
    reset,
    setValue,
    watch,
  } = useForm({ mode: 'onBlur' });

  const onSubmit = (data: any) => {
    console.log('submitted');
  }

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

  const classification = watch('classification');
  const mesurements = watch('mesurements');

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  return (

    <div className={styles.modal}>
      <h4>
        <b> {t('me:registerTrees')} </b>
      </h4>
      <div className={styles.tabButtonContainer}>
        <div
          className={'tabButton'}
          onClick={() => setSelectedTab('single')}
        >
          <div
            className={
              selectedTab === 'single'
                ? 'tabButtonSelected'
                : 'tabButtonText'
            }
          >
            Single Tree
              </div>
          {selectedTab === 'single' ? (
            <div className={'tabButtonSelectedIndicator'} />
          ) : null}
        </div>

        <div
          className={'tabButton'}
          onClick={() => setSelectedTab('many')}
        >
          <div
            className={
              selectedTab === 'many'
                ? 'tabButtonSelected'
                : 'tabButtonText'
            }
          >
            Many Trees
              </div>
          {selectedTab === 'many' ? (
            <div className={'tabButtonSelectedIndicator'} />
          ) : null}
        </div>
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formField}>
            <div className={styles.formFieldHalf}>
              <MaterialTextField
                placeholder="Mangifera indica"
                label="Name of Tree"
                variant="outlined"
              />
            </div>
            {selectedTab === 'many' ?
              <div className={styles.formFieldHalf}>
                <MaterialTextField
                  placeholder="50"
                  label="Number of Trees"
                  variant="outlined"
                />
              </div>
              : null
            }
            <div className={styles.formFieldHalf}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMapForDate[userLang] ? localeMapForDate[userLang] : localeMapForDate['en']}>
                <Controller
                  render={props => (

                    <DatePicker
                      label="Date Planted"
                      value={props.value}
                      onChange={props.onChange}
                      inputVariant="outlined"
                      TextFieldComponent={MaterialTextField}
                      autoOk
                      disableFuture
                      minDate={new Date(new Date().setFullYear(1950))}
                      format="d MMMM yyyy"
                      maxDate={new Date()}
                    />)
                  }
                  name="data-planted"
                  control={control}
                  defaultValue=""
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>

          <div className={`${styles.formFieldLarge} ${styles.locationMap}`}>
            <MapGL
              {...viewport}
              mapboxApiAccessToken={process.env.MAPBOXGL_ACCESS_TOKEN}
              mapStyle='mapbox://styles/mapbox/streets-v11'
              onViewportChange={_onViewportChange}
              onClick={(event) => {
                setplantLocation(event.lngLat);
                setViewPort({
                  ...viewport,
                  latitude: event.lngLat[1],
                  longitude: event.lngLat[0],
                  transitionDuration: 400,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionEasing: d3.easeCubic,
                });
              }}
            >
              <Marker
                latitude={plantLocation[1]}
                longitude={plantLocation[0]}
                offsetLeft={5}
                offsetTop={-16}
                style={{ left: '28px' }}
              >
                <div className={styles.marker}></div>
              </Marker>
              <div className={styles.mapNavigation}>
                <NavigationControl showCompass={false} />
              </div>
            </MapGL>
          </div>
          <div className={styles.formFieldLarge} {...getRootProps()}>
            <label htmlFor="upload" className={styles.fileUploadContainer}>
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
          </div>
          {selectedTab === 'single' ?
            <>
              <div className={styles.formField}>
                <div className={`${styles.formFieldHalf}`}>
                  <div className={`${styles.formFieldRadio}`}>
                    <label
                      htmlFor="classification"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      Classification
                  <div
                        style={{ height: '13px', width: '13px', marginLeft: '6px' }}
                      >
                        {/* <div className={styles.popover}>
                      <InfoIcon />
                      <div
                        className={styles.popoverContent}
                        style={{ left: '-150px' }}
                      >
                        <p>
                          Classification
                        </p>
                      </div>
                    </div> */}
                      </div>
                    </label>

                    <Controller
                      name="classification"
                      control={control}
                      render={(props) => (
                        <ToggleSwitch
                          id="classification"
                          checked={props.value}
                          onChange={(e) => props.onChange(e.target.checked)}
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              {classification ? (
                <div className={styles.formField}>
                  <div className={styles.formFieldHalf}>
                    <MaterialTextField
                      placeholder="20 Nov 2020"
                      label="Tree Classification"
                      variant="outlined"
                    />
                  </div>
                  <div className={styles.formFieldHalf}>
                    <MaterialTextField
                      placeholder="20 Nov 2020"
                      label="Tree Scientific Name"
                      variant="outlined"
                    />
                  </div>
                </div>
              ) : null}

              <div className={styles.formField}>
                <div className={`${styles.formFieldHalf}`}>
                  <div className={`${styles.formFieldRadio}`}>
                    <label
                      htmlFor="mesurements"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      Mesurements
                  <div
                        style={{ height: '13px', width: '13px', marginLeft: '6px' }}
                      >
                      </div>
                    </label>

                    <Controller
                      name="mesurements"
                      control={control}
                      render={(props) => (
                        <ToggleSwitch
                          id="mesurements"
                          checked={props.value}
                          onChange={(e) => props.onChange(e.target.checked)}
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              {mesurements ? (
                <div className={styles.formField}>
                  <div className={styles.formFieldHalf}>
                    <MaterialTextField
                      placeholder="20 Nov 2020"
                      label="Diameter"
                      variant="outlined"
                    />
                  </div>
                  <div className={styles.formFieldHalf}>
                    <MaterialTextField
                      placeholder="20 Nov 2020"
                      label="Height"
                      variant="outlined"
                    />
                  </div>
                  <div className={styles.formFieldHalf}>
                    <MaterialTextField
                      placeholder="20 Nov 2020"
                      label="Mesurement Date"
                      variant="outlined"
                    />
                  </div>
                </div>
              ) : null}
            </>
            : null}

          <div className={styles.continueButton}>{t('common:continue')}</div>
        </form>
      </div>
    </div>
  );
}

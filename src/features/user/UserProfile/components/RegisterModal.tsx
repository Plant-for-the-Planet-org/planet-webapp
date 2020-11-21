import React from 'react';
import styles from '../styles/RegisterModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';
import { useForm } from 'react-hook-form';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useDropzone } from 'react-dropzone';
import MapGL, {
  FlyToInterpolator,
  Marker,
  NavigationControl,
  WebMercatorViewport,
} from 'react-map-gl';

const { useTranslation } = i18next;
export default function RegisterModal({
  registerModalOpen,
  handleRegisterModalClose,
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
  const _onViewportChange = (view: any) => setViewPort({ ...view });

  return (
    <Modal
      className={styles.modalContainer}
      open={registerModalOpen}
      onClose={handleRegisterModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={registerModalOpen}>
        <div className={styles.modal}>
          <h4>
            <b> {t('me:registerTrees')} </b>
          </h4>
          <div className={'tabButtonContainer'}>
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
              {selectedTab === 'single' ?

                <div className={styles.formField}>
                  <div className={styles.formFieldHalf}>
                    <MaterialTextField
                      placeholder="Mangifera indica"
                      label="Name of Tree"
                      variant="outlined"
                    />
                  </div>
                  <div className={styles.formFieldHalf}>
                    <MaterialTextField
                      placeholder="20 Nov 2020"
                      label="Date Planted"
                      variant="outlined"
                    />
                  </div>
                </div>
                :
                <>
                  <div className={styles.formFieldLarge}>
                    <MaterialTextField
                      placeholder="Mangifera indica"
                      label="Name of Tree"
                      variant="outlined"
                    />
                  </div>
                  <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                      <MaterialTextField
                        placeholder="50"
                        label="Number of Trees"
                        variant="outlined"
                      />
                    </div>
                    <div className={styles.formFieldHalf}>
                      <MaterialTextField
                        placeholder="20 Nov 2020"
                        label="Date Planted"
                        variant="outlined"
                      />
                    </div>
                  </div>
                </>
              }
              <div className={`${styles.formFieldLarge} ${styles.locationMap}`}>
                <MapGL
                  {...viewport}
                  mapboxApiAccessToken={process.env.MAPBOXGL_ACCESS_TOKEN}
                  mapStyle='mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7'
                  onViewportChange={_onViewportChange}
                  onClick={(event) => {
                    setplantLocation(event.lngLat);
                    setViewPort({
                      ...viewport,
                      latitude: event.lngLat[1],
                      longitude: event.lngLat[0],
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

              <div className={styles.continueButton}>{t('common:continue')}</div>
            </form>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

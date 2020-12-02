import React from 'react';
import styles from '../styles/RegisterModal.module.scss';
import i18next from '../../../../../i18n';
import MapGL, {
  FlyToInterpolator,
  Marker,
  NavigationControl,
  WebMercatorViewport,
} from 'react-map-gl';
import * as d3 from 'd3-ease';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import { useRouter } from 'next/router';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { Backdrop, Modal } from '@material-ui/core';
import dynamic from 'next/dynamic';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Controller, useForm } from 'react-hook-form';
import DateFnsUtils from '@date-io/date-fns';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { getStoredConfig } from '../../../../utils/storeConfig';
import SingleContribution from './RegisterTrees/SingleContribution';
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};
declare module '@material-ui/core/styles/overrides' {
  export interface ComponentNameToClassKey extends overridesNameToClassKey {}
}

const DrawMap = dynamic(() => import('./RegisterTrees/DrawMap'), {
  ssr: false,
  loading: () => <p></p>,
});

interface Props {
  slug: any;
  session: any;
  registerTreesModalOpen: any;
}

const { useTranslation } = i18next;
export default function RegisterTrees({
  slug,
  session,
  registerTreesModalOpen,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation(['me', 'common']);
  const [isMultiple, setIsMultiple] = React.useState(false);
  const [contributionGUID, setContributionGUID] = React.useState('');
  const [contributionDetails, setContributionDetails] = React.useState({});
  const [errorMessage, setErrorMessage] = React.useState('');
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 767;
  const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
  const defaultZoom = isMobile ? 1 : 1.4;
  const [plantLocation, setplantLocation] = React.useState();
  const [geometry, setGeometry] = React.useState();
  const [viewport, setViewPort] = React.useState({
    height: '100%',
    width: '100%',
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const [userLang, setUserLang] = React.useState('en');
  const [countryBbox, setCountryBbox] = React.useState();
  const [registered, setRegistered] = React.useState(false);

  const materialTheme = createMuiTheme({
    overrides: {
      MuiPickersToolbar: {
        toolbar: {
          backgroundColor: styles.primaryColor,
        },
      },
      MuiPickersCalendarHeader: {
        switchHeader: {
          // backgroundColor: lightBlue.A200,
          // color: "white",
        },
      },
      MuiPickersDay: {
        daySelected: {
          backgroundColor: styles.primaryColor,
        },
        current: {
          color: styles.primaryColor,
        },
      },
      MuiPickersYear: {
        yearSelected: {
          color: styles.primaryColor,
        },
      },
      MuiPickersModal: {
        dialogAction: {
          color: styles.primaryColor,
        },
      },
      MuiButton: {
        label: {
          color: styles.primaryColor,
        },
      },
    },
  });

  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      let userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }

    async function getUserCountryBbox() {
      var country = getStoredConfig('country');
      const result = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${country}.json?types=country&limit=1&access_token=${process.env.MAPBOXGL_ACCESS_TOKEN}`
      );
      const geoCodingAPI = result.status === 200 ? await result.json() : null;
      setCountryBbox(geoCodingAPI.features[0].bbox);
    }
    getUserCountryBbox();
  }, []);

  React.useEffect(() => {
    if (countryBbox) {
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        viewport
      ).fitBounds([
        [countryBbox[0], countryBbox[1]],
        [countryBbox[2], countryBbox[3]],
      ]);
      const newViewport = {
        ...viewport,
        longitude,
        latitude,
        zoom,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setViewPort(newViewport);
    }
  }, [countryBbox]);

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const defaultBasicDetails = {
    treeCount: '',
    species: '',
    plantDate: new Date(),
    geometry: {},
  };
  const {
    register,
    handleSubmit,
    errors,
    control,
    reset,
    setValue,
    watch,
  } = useForm({ mode: 'onBlur', defaultValues: defaultBasicDetails });

  const treeCount = watch('treeCount');

  const onTreeCountChange = (e) => {
    if (Number(e.target.value) < 25) {
      setIsMultiple(false);
    } else {
      setIsMultiple(true);
    }
  };

  const submitRegisterTrees = (data: any) => {
    if (data.treeCount < 10000000) {
      if (
        geometry &&
        (geometry.type === 'Point' || geometry.features?.length >= 1)
      ) {
        setIsUploadingData(true);
        const submitData = {
          treeCount: data.treeCount,
          treeSpecies: data.species,
          plantDate: new Date(data.plantDate),
          geometry: geometry,
        };
        postAuthenticatedRequest(
          `/app/contributions`,
          submitData,
          session
        ).then((res) => {
          if (!res.code) {
            console.log(res);
            setErrorMessage('');
            setContributionGUID(res.id);
            setContributionDetails(res);
            setIsUploadingData(false);
            setRegistered(true);
            // router.push('/c/[id]', `/c/${res.id}`);
          } else {
            if (res.code === 404) {
              setIsUploadingData(false);
              setErrorMessage(res.message);
              setRegistered(false);
            } else {
              setIsUploadingData(false);
              setErrorMessage(res.message);
              setRegistered(false);
            }
          }
        });

        // handleNext();
      } else {
        setErrorMessage(t('me:locationMissing'));
      }
    } else {
      setErrorMessage(t('me:wentWrong'));
      console.log(errorMessage);
    }
  };

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  const ContributionProps = {
    session,
    contribution: contributionDetails,
    contributionGUID,
    currentUserSlug: slug,
  };

  return (
    <>
      <Modal
        className={styles.modalContainer}
        open={registerTreesModalOpen}
        //onClose={handleEditProfileModalClose}
        closeAfterTransition
        hideBackdrop
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-bio"
      >
        <div className={styles.modal}>
          {!registered ? (
            <div className={styles.formContainer}>
              <h2 className={styles.title}>
                <div
                  style={{
                    cursor: 'pointer',
                    marginLeft: -10,
                    paddingRight: 10,
                  }}
                  onClick={() => {
                    router.push(`/t/${slug}`, undefined, { shallow: true });
                  }}
                >
                  <BackButton />
                </div>
                <b> {t('me:registerTrees')} </b>
              </h2>
              <form onSubmit={handleSubmit(submitRegisterTrees)}>
                <div className={styles.formField}>
                  <div className={styles.formFieldHalf}>
                    <MaterialTextField
                      inputRef={register({
                        required: {
                          value: true,
                          message: t('me:treesRequired'),
                        },
                        validate: (value) => parseInt(value, 10) >= 1,
                      })}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                      onChange={onTreeCountChange}
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
                          render={(props) => (
                            <DatePicker
                              label={t('me:datePlanted')}
                              value={props.value}
                              onChange={props.onChange}
                              inputVariant="outlined"
                              TextFieldComponent={MaterialTextField}
                              autoOk
                              disableFuture
                              minDate={new Date(new Date().setFullYear(1950))}
                              format="dd MMMM yyyy"
                              maxDate={new Date()}
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
                    label={t('me:treeSpecies')}
                    variant="outlined"
                    name="species"
                  />
                  {errors.species && (
                    <span className={styles.formErrors}>
                      {errors.species.message}
                    </span>
                  )}
                </div>
                <div className={styles.mapNote}>
                  {isMultiple ? (
                    <p>{t('me:drawPolygon')}</p>
                  ) : (
                    <p>{t('me:selectLocation')}</p>
                  )}
                </div>

                <div className={`${styles.locationMap}`}>
                  {isMultiple ? (
                    <DrawMap
                      setGeometry={setGeometry}
                      countryBbox={countryBbox}
                    />
                  ) : (
                    <MapGL
                      {...viewport}
                      mapboxApiAccessToken={process.env.MAPBOXGL_ACCESS_TOKEN}
                      mapStyle="mapbox://styles/mapbox/streets-v11"
                      onViewportChange={_onViewportChange}
                      onClick={(event) => {
                        setplantLocation(event.lngLat);
                        setGeometry({
                          type: 'Point',
                          coordinates: event.lngLat,
                        });
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
                      {plantLocation ? (
                        <Marker
                          latitude={plantLocation[1]}
                          longitude={plantLocation[0]}
                          offsetLeft={5}
                          offsetTop={-16}
                          style={{ left: '28px' }}
                        >
                          <div className={styles.marker}></div>
                        </Marker>
                      ) : null}
                      <div className={styles.mapNavigation}>
                        <NavigationControl showCompass={false} />
                      </div>
                    </MapGL>
                  )}
                </div>

                {/* {errorMessage !== '' ? */}
                <div className={`${styles.formFieldLarge} ${styles.center}`}>
                  <p className={styles.formErrors}>{`${errorMessage}`}</p>
                </div>
                {/* : null
              } */}
                <div className={styles.nextButton}>
                  <div
                    onClick={handleSubmit(submitRegisterTrees)}
                    className={styles.continueButton}
                  >
                    {' '}
                    {isUploadingData ? (
                      <div className={styles.spinner}></div>
                    ) : (
                      t('me:registerButton')
                    )}
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <SingleContribution {...ContributionProps} />
          )}
        </div>
      </Modal>
    </>
  );
}

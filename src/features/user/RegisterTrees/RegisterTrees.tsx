import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme, MenuItem } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';
import { ThemeProvider } from '@material-ui/styles';
import * as d3 from 'd3-ease';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import MapGL, {
  FlyToInterpolator,
  Marker,
  NavigationControl
} from 'react-map-gl';
import i18next from '../../../../i18n';
import { ThemeContext } from '../../../theme/themeContext';
import {
  getAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../utils/apiRequests/api';
import { localeMapForDate } from '../../../utils/language/getLanguageName';
import getMapStyle from '../../../utils/maps/getMapStyle';
import { getStoredConfig } from '../../../utils/storeConfig';
import MaterialTextField from '../../common/InputTypes/MaterialTextField';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import styles from './RegisterModal.module.scss';
import SingleContribution from './RegisterTrees/SingleContribution';
import materialTheme from '../../../theme/themeStyles';

type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};
declare module '@material-ui/core/styles/overrides' {
  export type ComponentNameToClassKey = overridesNameToClassKey;
}

const DrawMap = dynamic(() => import('./RegisterTrees/DrawMap'), {
  ssr: false,
  loading: () => <p></p>,
});

interface Props {}

const { useTranslation } = i18next;
export default function RegisterTrees({}: Props) {
  const router = useRouter();
  const { user, token, contextLoaded } = React.useContext(UserPropsContext);
  const { t, ready } = useTranslation(['me', 'common']);
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const [mapState, setMapState] = React.useState({
    mapStyle: EMPTY_STYLE,
  });
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
  const [userLocation, setUserLocation] = React.useState();
  const [registered, setRegistered] = React.useState(false);
  const [registerTreesModalOpen, setRegisterTreesModalOpen] = React.useState(
    true
  );
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    const promise = getMapStyle('openStreetMap');
    promise.then((style) => {
      if (style) {
        setMapState({ ...mapState, mapStyle: style });
      }
    });
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem('language')) {
      const userLang = localStorage.getItem('language');
      if (userLang) setUserLang(userLang);
    }

    async function getUserLocation() {
      const location = await getStoredConfig('loc');
      if (location) {
        setUserLocation([
          Number(location.longitude) || 0,
          Number(location.latitude) || 0,
        ]);
      }
    }
    getUserLocation();
  }, []);

  React.useEffect(() => {
    if (userLocation) {
      const newViewport = {
        ...viewport,
        longitude: userLocation[0],
        latitude: userLocation[1],
        zoom: 10,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setViewPort(newViewport);
    }
  }, [userLocation]);

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const defaultBasicDetails = {
    treeCount: '',
    species: '',
    plantProject: null,
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

  const onTreeCountChange = (e: any) => {
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
          plantProject: data.plantProject,
          plantDate: new Date(data.plantDate),
          geometry: geometry,
        };
        postAuthenticatedRequest(`/app/contributions`, submitData, token).then(
          (res) => {
            if (!res.code) {
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
          }
        );

        // handleNext();
      } else {
        setErrorMessage(ready ? t('me:locationMissing') : '');
      }
    } else {
      setErrorMessage(ready ? t('me:wentWrong') : '');
      console.log(errorMessage);
    }
  };

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

  const _onStateChange = (state: any) => setMapState({ ...state });

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  const ContributionProps = {
    token,
    contribution: contributionDetails,
    contributionGUID,
    slug: user.slug,
  };
  const { theme } = React.useContext(ThemeContext);

  return ready ? (
    <div className="profilePage">
      {!registered ? (
        <div className={styles.registerTreesPage}>
          <h2 className={'profilePageTitle'}>{t('me:registerTrees')}</h2>
          <form onSubmit={handleSubmit(submitRegisterTrees)}>
            <div className={styles.note}>
              <p>{t('me:registerTreesDescription')}</p>
            </div>
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
                      render={(properties) => (
                        <DatePicker
                          label={t('me:datePlanted')}
                          value={properties.value}
                          onChange={properties.onChange}
                          inputVariant="outlined"
                          TextFieldComponent={MaterialTextField}
                          autoOk
                          disableFuture
                          minDate={new Date(new Date().setFullYear(1950))}
                          format="MMMM d, yyyy"
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
                  userLocation={userLocation}
                />
              ) : (
                <MapGL
                  {...mapState}
                  {...viewport}
                  onViewportChange={_onViewportChange}
                  onStateChange={_onStateChange}
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
                  mapOptions={{
                    customAttribution:
                      '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>',
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
              <button
                id={'RegTressSubmit'}
                onClick={handleSubmit(submitRegisterTrees)}
                className="primaryButton"
              >
                {' '}
                {isUploadingData ? (
                  <div className={styles.spinner}></div>
                ) : (
                  t('me:registerButton')
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <SingleContribution {...ContributionProps} />
      )}
    </div>
  ) : null;
}

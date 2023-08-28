import { MenuItem, SxProps, TextField, Button } from '@mui/material';
import * as d3 from 'd3-ease';
import dynamic from 'next/dynamic';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import MapGL, {
  FlyToInterpolator,
  Marker,
  NavigationControl,
} from 'react-map-gl';
import { useTranslation } from 'next-i18next';
import {
  getAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../utils/apiRequests/api';
import { localeMapForDate } from '../../../utils/language/getLanguageName';
import getMapStyle from '../../../utils/maps/getMapStyle';
import { getStoredConfig } from '../../../utils/storeConfig';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import styles from './RegisterModal.module.scss';
import SingleContribution from './RegisterTrees/SingleContribution';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import themeProperties from '../../../theme/themeProperties';
import StyledForm from '../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../common/Layout/Forms/InlineFormDisplayGroup';

const DrawMap = dynamic(() => import('./RegisterTrees/DrawMap'), {
  ssr: false,
  loading: () => <p></p>,
});

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

interface RenderUnRegisteredTreesFormProps {
  setContributionGUID: React.Dispatch<React.SetStateAction<string>>;
  setContributionDetails: React.Dispatch<React.SetStateAction<{}>>;
  setRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}

function RenderUnRegisteredTreesForm({
  setContributionGUID,
  setContributionDetails,
  setRegistered,
}: RenderUnRegisteredTreesFormProps) {
  const { user, token, contextLoaded, logoutUser } = useUserProps();
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
  const [projects, setProjects] = React.useState([]);
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);

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
    plantProject: user?.type === 'tpo' ? '' : null,
    plantDate: new Date(),
    geometry: {},
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: defaultBasicDetails,
  });

  const onTreeCountChange = (e: any) => {
    if (Number(e.target.value) < 25) {
      setIsMultiple(false);
    } else {
      setIsMultiple(true);
    }
  };

  const submitRegisterTrees = async (data: any) => {
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
        try {
          const res = await postAuthenticatedRequest(
            `/app/contributions`,
            submitData,
            token,
            logoutUser
          );
          setErrorMessage('');
          setContributionGUID(res.id);
          setContributionDetails(res);
          setIsUploadingData(false);
          setRegistered(true);
        } catch (err) {
          setIsUploadingData(false);
          setErrors(handleError(err as APIError));
          setRegistered(false);
        }
      } else {
        setErrorMessage(ready ? t('me:locationMissing') : '');
      }
    } else {
      setErrorMessage(ready ? t('me:wentWrong') : '');
    }
  };

  async function loadProjects() {
    try {
      const projects = await getAuthenticatedRequest(
        '/app/profile/projects',
        token,
        logoutUser
      );
      setProjects(projects);
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/profile');
    }
  }

  React.useEffect(() => {
    if (contextLoaded) {
      loadProjects();
    }
  }, [contextLoaded]);

  const _onStateChange = (state: any) => setMapState({ ...state });

  const _onViewportChange = (view: any) => setViewPort({ ...view });
  return (
    <>
      <StyledForm>
        <div
          className="inputContainer"
          onSubmit={handleSubmit(submitRegisterTrees)}
        >
          <div className={styles.note}>
            <p>{t('me:registerTreesDescription')}</p>
          </div>
          <InlineFormDisplayGroup>
            <Controller
              name="treeCount"
              control={control}
              rules={{
                required: t('me:treesRequired'),
                validate: (value) => parseInt(value, 10) >= 1,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={t('me:noOfTrees')}
                  variant="outlined"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    onTreeCountChange(e);
                    onChange(e.target.value);
                  }}
                  value={value}
                  onBlur={onBlur}
                  error={errors && errors.treeCount !== undefined}
                  helperText={
                    errors && errors.treeCount && errors.treeCount.message
                      ? errors.treeCount.message
                      : t('me:moreThanOne')
                  }
                />
              )}
            />
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
                defaultValue={new Date()}
                render={({ field: { onChange, value } }) => (
                  <MuiDatePicker
                    label={t('me:datePlanted')}
                    value={value}
                    onChange={onChange}
                    renderInput={(props) => <TextField {...props} />}
                    disableFuture
                    minDate={new Date(new Date().setFullYear(1950))}
                    inputFormat="MMMM d, yyyy"
                    maxDate={new Date()}
                    DialogProps={{
                      sx: dialogSx,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </InlineFormDisplayGroup>
          <Controller
            name="species"
            control={control}
            rules={{ required: t('me:speciesIsRequired') }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('me:treeSpecies')}
                variant="outlined"
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors && errors.species !== undefined}
                helperText={errors && errors.species && errors.species.message}
              />
            )}
          />
          {user && user.type === 'tpo' && (
            <Controller
              name="plantProject"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={t('me:project')}
                  variant="outlined"
                  select
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors && errors.plantProject !== undefined}
                  helperText={
                    errors && errors.plantProject && errors.plantProject.message
                  }
                >
                  {projects.map((option) => (
                    <MenuItem
                      key={option.properties.id}
                      value={option.properties.id}
                    >
                      {option.properties.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
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
              <DrawMap setGeometry={setGeometry} userLocation={userLocation} />
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
          {/* {errorMessage !== '' ? ( */}
          <div className={styles.center}>
            <p className={styles.formErrors}>{`${errorMessage}`}</p>
          </div>
          {/* ) : null} */}
          <div>
            <Button
              id={'RegTressSubmit'}
              onClick={handleSubmit(submitRegisterTrees)}
              variant="contained"
              color="primary"
            >
              {' '}
              {isUploadingData ? (
                <div className={'spinner'}></div>
              ) : (
                t('me:registerButton')
              )}
            </Button>
          </div>
        </div>
      </StyledForm>
    </>
  );
}

type FormData = {
  treeCount: string;
  species: string;
  plantProject: string | null;
  plantDate: Date;
  geometry: any;
};

export default function RegisterTreesForm() {
  const { user, token } = useUserProps();
  const { t, ready } = useTranslation(['me', 'common']);
  const [contributionGUID, setContributionGUID] = React.useState('');
  const [contributionDetails, setContributionDetails] = React.useState({});
  const [registered, setRegistered] = React.useState(false);

  const ContributionProps = {
    token,
    contribution: contributionDetails,
    contributionGUID,
    slug: user.slug,
  };

  return ready ? (
    <>
      {!registered ? (
        <RenderUnRegisteredTreesForm
          setContributionGUID={setContributionGUID}
          setContributionDetails={setContributionDetails}
          setRegistered={setRegistered}
        />
      ) : (
        <SingleContribution {...ContributionProps} />
      )}
    </>
  ) : null;
}

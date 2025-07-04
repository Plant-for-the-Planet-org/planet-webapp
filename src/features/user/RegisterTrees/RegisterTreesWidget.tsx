import type { ContributionProperties } from './RegisterTrees/SingleContribution';
import type { APIError, ProfileProjectFeature } from '@planet-sdk/common';
import type { ViewportProps } from '../../common/types/map';
import type {
  RegisterTreesFormProps,
  RegisteredTreesGeometry,
} from '../../common/types/map';
import { handleError } from '@planet-sdk/common';

import { MenuItem, TextField, Button } from '@mui/material';
import * as d3 from 'd3-ease';
import dynamic from 'next/dynamic';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import MapGL, {
  FlyToInterpolator,
  Marker,
  NavigationControl,
} from 'react-map-gl';
import { useTranslations } from 'next-intl';
import { localeMapForDate } from '../../../utils/language/getLanguageName';
import getMapStyle from '../../../utils/maps/getMapStyle';
import { getStoredConfig } from '../../../utils/storeConfig';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import styles from './RegisterModal.module.scss';
import SingleContribution from './RegisterTrees/SingleContribution';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import StyledForm from '../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../common/Layout/Forms/InlineFormDisplayGroup';
import { useApi } from '../../../hooks/useApi';

const DrawMap = dynamic(() => import('./RegisterTrees/DrawMap'), {
  ssr: false,
  loading: () => <p></p>,
});

type RegisteredTreesApiPayload = {
  treeCount: string;
  treeSpecies: string;
  plantProject: string | null;
  plantDate: Date;
  geometry: RegisteredTreesGeometry; // Adjust this type based on the actual geometry structure (e.g., GeoJSON)
};

function RegisterTreesForm({
  setContributionGUID,
  setContributionDetails,
  setRegistered,
}: RegisterTreesFormProps) {
  const { user, contextLoaded, setRefetchUserData } = useUserProps();
  const t = useTranslations('Me');
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const [mapState, setMapState] = React.useState({
    mapStyle: EMPTY_STYLE,
  });
  const [isMultiple, setIsMultiple] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<null | string>(null);
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 767;
  const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
  const defaultZoom = isMobile ? 1 : 1.4;
  const [plantLocation, setPlantLocation] = React.useState<
    number[] | undefined
  >(undefined);
  const [geometry, setGeometry] = React.useState<
    RegisteredTreesGeometry | undefined
  >(undefined);
  const [viewport, setViewPort] = React.useState<ViewportProps>({
    height: '100%',
    width: '100%',
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const [userLang, setUserLang] = React.useState('en');
  const [userLocation, setUserLocation] = React.useState<number[] | null>(null);
  const [projects, setProjects] = React.useState<ProfileProjectFeature[]>([]);
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);
  const [isStyleReady, setIsStyleReady] = React.useState(false);
  const { postApiAuthenticated, getApiAuthenticated } = useApi();

  React.useEffect(() => {
    const promise = getMapStyle('openStreetMap');
    promise.then((style) => {
      if (style) {
        setMapState({ ...mapState, mapStyle: style });
        setIsStyleReady(true);
      }
    });
  }, [isStyleReady]);

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

  const onTreeCountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (Number(e.target.value) < 25) {
      setIsMultiple(false);
    } else {
      setIsMultiple(true);
    }
  };

  const submitRegisterTrees = async (data: FormData): Promise<void> => {
    const treeCount = parseInt(data.treeCount);
    if (treeCount < 10000000) {
      if (
        geometry &&
        (geometry.type === 'Point' ||
          (geometry.features?.length !== undefined &&
            geometry.features?.length >= 1))
      ) {
        setIsUploadingData(true);
        const registeredTreesPayload: RegisteredTreesApiPayload = {
          treeCount: data.treeCount,
          treeSpecies: data.species,
          plantProject: data.plantProject,
          plantDate: new Date(data.plantDate),
          geometry: geometry,
        };
        try {
          const res = await postApiAuthenticated<
            ContributionProperties,
            RegisteredTreesApiPayload
          >('/app/contributions', {
            payload: registeredTreesPayload,
          });
          setErrorMessage('');
          setContributionGUID(res.id);
          setContributionDetails(res);
          setIsUploadingData(false);
          setRegistered(true);
          setRefetchUserData(true);
        } catch (err) {
          setIsUploadingData(false);
          setErrors(handleError(err as APIError));
          setRegistered(false);
        }
      } else {
        setErrorMessage(t('locationMissing'));
      }
    } else {
      setErrorMessage(t('wentWrong'));
    }
  };
  async function loadProjects() {
    try {
      const projects = await getApiAuthenticated<ProfileProjectFeature[]>(
        '/app/profile/projects'
      );
      setProjects(projects);
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/profile');
    }
  }

  React.useEffect(() => {
    if (contextLoaded && user?.type === 'tpo') {
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
            <p>{t('registerTreesDescription')}</p>
          </div>
          <InlineFormDisplayGroup>
            <Controller
              name="treeCount"
              control={control}
              rules={{
                required: t('treesRequired'),
                validate: (value) => parseInt(value, 10) >= 1,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={t('noOfTrees')}
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
                      : t('moreThanOne')
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
                    label={t('datePlanted')}
                    value={value}
                    onChange={onChange}
                    renderInput={(props) => <TextField {...props} />}
                    disableFuture
                    minDate={new Date(new Date().setFullYear(1950))}
                    inputFormat="MMMM d, yyyy"
                    maxDate={new Date()}
                  />
                )}
              />
            </LocalizationProvider>
          </InlineFormDisplayGroup>
          <Controller
            name="species"
            control={control}
            rules={{ required: t('speciesIsRequired') }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={t('treeSpecies')}
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
                  label={t('project')}
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
              <p>{t('drawPolygon')}</p>
            ) : (
              <p>{t('selectLocation')}</p>
            )}
          </div>
          <div className={`${styles.locationMap}`}>
            {isMultiple && isStyleReady ? (
              <DrawMap setGeometry={setGeometry} userLocation={userLocation} />
            ) : (
              <MapGL
                {...mapState}
                {...viewport}
                onViewportChange={_onViewportChange}
                onViewStateChange={_onStateChange}
                onClick={(event) => {
                  setPlantLocation(event.lngLat);
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
          {errorMessage !== null && (
            <div className={styles.center}>
              <p className={styles.formErrors}>{`${errorMessage}`}</p>
            </div>
          )}

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
                t('registerButton')
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
  geometry: RegisteredTreesGeometry | undefined;
};

export default function RegisterTreesWidget() {
  const [contributionGUID, setContributionGUID] = React.useState('');
  const [contributionDetails, setContributionDetails] =
    React.useState<ContributionProperties | null>(null);
  const [registered, setRegistered] = React.useState(false);

  const ContributionProps = {
    contribution: contributionDetails !== null ? contributionDetails : null,
    contributionGUID,
  };

  return (
    <>
      {!registered ? (
        <RegisterTreesForm
          setContributionGUID={setContributionGUID}
          setContributionDetails={setContributionDetails}
          setRegistered={setRegistered}
        />
      ) : (
        <SingleContribution {...ContributionProps} />
      )}
    </>
  );
}

import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';
import { ThemeProvider } from '@material-ui/styles';
import * as d3 from 'd3-ease';
import dynamic from 'next/dynamic';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import MapGL, {
  FlyToInterpolator,
  Marker,
  NavigationControl,
} from 'react-map-gl';
import i18next from '../../../../i18n';
import { postRequest } from '../../../utils/apiRequests/api';
import { localeMapForDate } from '../../../utils/language/getLanguageName';
import getMapStyle from '../../../utils/maps/getMapStyle';
import { getStoredConfig } from '../../../utils/storeConfig';
import MaterialTextField from '../../../features/common/InputTypes/MaterialTextField';
import styles from './RegisterModal.module.scss';
import materialTheme from '../../../theme/themeStyles';
import { ThemeContext } from '../../../theme/themeContext';
import ContactDetails from './ContactDetails/ContactDetails';
import UploadImages from './RegisterTrees/UploadImages';
import CheckBox from '../../../features/common/InputTypes/Checkbox';
import SingleContribution from './RegisterTrees/SingleContribution';
import GeocoderArcGIS from 'geocoder-arcgis';

type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};
declare module '@material-ui/core/styles/overrides' {
  export type ComponentNameToClassKey = overridesNameToClassKey;
}

interface Props {}

const { useTranslation } = i18next;
export default function RegisterTrees({}: Props) {
  const { t, ready } = useTranslation(['me', 'common']);
  const { theme, setTheme } = React.useContext(ThemeContext);
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const [mapState, setMapState] = React.useState({
    mapStyle: EMPTY_STYLE,
  });
  // const [contributionGUID, setContributionGUID] = React.useState('');
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
  const [agreeToGuidelines, setAgreeToGuidelines] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [image, setImage] = React.useState('');
  const [contactDetails, setContactDetails] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US',
    companyName: '',
  });
  const [addressSugggestions, setaddressSugggestions] = React.useState([]);

  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
  );

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
        if (location.city) {
          setContactDetails({
            ...contactDetails,
            city: location.city ? location.city : '',
          });
        }
        if (location.postalCode) {
          setContactDetails({
            ...contactDetails,
            zipCode: location.postalCode ? location.postalCode : '',
          });
        }
        if (location.countryCode) {
          setContactDetails({
            ...contactDetails,
            country: location.countryCode ? location.countryCode : 'US',
          });
        }
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
    images: [
      {
        imageFile: image,
      },
    ],
    planter: {
      firstname: '',
      lastname: '',
      email: '',
      address: '',
      zipCode: '',
      city: '',
      country: '',
    },
  };
  const { register, handleSubmit, errors, control, reset, setValue, watch } =
    useForm({ mode: 'all', defaultValues: defaultBasicDetails });

  const submitRegisterTrees = (data: any) => {
    console.log(data, 'Data');

    if (data.treeCount < 10000000) {
      if (image) {
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
            images: [
              {
                imageFile: image,
              },
            ],
            planter: {
              firstname: data.firstName,
              lastname: data.lastName,
              email: data.email,
              address: data.address,
              zipCode: data.zipCode,
              city: data.city,
              country: contactDetails.country,
            },
          };
          postRequest(`/app/treeRegistrations`, submitData).then((res) => {
            if (!res.code) {
              setErrorMessage('');
              setContributionDetails(res);
              setIsUploadingData(false);
              setRegistered(true);
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
        } else {
          setErrorMessage(ready ? t('me:locationMissing') : '');
        }
      } else {
        setErrorMessage(ready ? t('me:imageMissing') : '');
      }
    } else {
      setErrorMessage(ready ? t('me:wentWrong') : '');
    }
  };

  const suggestAddress = (value: any) => {
    if (value.length > 3) {
      geocoder
        .suggest(value, {
          category: 'Address',
          countryCode: contactDetails.country,
        })
        .then((result: any) => {
          const filterdSuggestions = result.suggestions.filter(
            (suggestion: any) => {
              return !suggestion.isCollection;
            }
          );
          setaddressSugggestions(filterdSuggestions);
        })
        .catch(console.log);
    }
  };
  const getAddress = (value: any) => {
    geocoder
      .findAddressCandidates(value, { outfields: '*' })
      .then((result: any) => {
        setValue('addressSearch', result.candidates[0].attributes.ShortLabel, {
          shouldValidate: true,
        });
        setUserLocation([
          result.candidates[0].location.x,
          result.candidates[0].location.y,
        ]);
        setplantLocation([
          result.candidates[0].location.x,
          result.candidates[0].location.y,
        ]);
        setGeometry({
          type: 'Point',
          coordinates: [
            result.candidates[0].location.x,
            result.candidates[0].location.y,
          ],
        });
        setErrorMessage('');
        setaddressSugggestions([]);
        console.log(result.candidates[0].location);
      })
      .catch(console.log);
  };

  const _onStateChange = (state: any) => setMapState({ ...state });

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  let suggestion_counter = 0;

  return ready && !registered ? (
    <div className={styles.registerTreesPage}>
      <h2 className={'profilePageTitle'} style={{ textAlign: 'center' }}>
        {t('me:registerTrees')}
      </h2>
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
              // onChange={onTreeCountChange}
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
            <span className={styles.formErrors}>{errors.species.message}</span>
          )}
        </div>
        <div>
          <UploadImages setImage={setImage} image={image} />
        </div>
        <div className={styles.mapNote}>
          <p>{t('me:selectLocation')}</p>
        </div>

        <div className={`${styles.locationMap}`}>
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
          <div className="address-search">
            <MaterialTextField
              label={t('donate:address')}
              variant="outlined"
              name="addressSearch"
              onChange={(event) => {
                suggestAddress(event.target.value);
              }}
              onBlur={() => setaddressSugggestions([])}
            />
            {addressSugggestions
              ? addressSugggestions.length > 0 && (
                  <div className="suggestions-container">
                    {addressSugggestions.map((suggestion: any) => {
                      return (
                        <div
                          key={'suggestion' + suggestion_counter++}
                          onMouseDown={() => {
                            getAddress(suggestion.text);
                          }}
                          className="suggestion"
                        >
                          {suggestion.text}
                        </div>
                      );
                    })}
                  </div>
                )
              : null}
          </div>
        </div>

        {/* {errorMessage !== '' ? */}

        <ContactDetails
          contactDetails={contactDetails}
          setContactDetails={setContactDetails}
          register={register}
          errors={errors}
          setValue={setValue}
        />

        <div className={`${styles.formFieldLarge} ${styles.center}`}>
          <p className={styles.formErrors}>{`${errorMessage}`}</p>
        </div>

        {/* <div className={styles.formRow}>
          <MaterialTextField
            multiline
            rowsMax="4"
            label={t('donate:giftMessage')}
            variant="outlined"
            name={'giftMessage'}
            // onChange={changeGiftDetails}
          />
        </div> */}
        <div style={{ display: 'flex' }}>
          <div>
            <CheckBox
              id="guidelines"
              name="guidelines"
              checked={agreeToGuidelines}
              onChange={() => {
                setAgreeToGuidelines(!agreeToGuidelines);
              }}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color={'primary'}
            />
          </div>
          <label
            htmlFor="guidelines"
            style={{ paddingLeft: '9px' }}
            className={styles.conditionText}
          >
            {t('agreeToGuidelines')}
          </label>
        </div>
        <div style={{ display: 'flex', paddingTop: 10, marginBottom: 15 }}>
          <div>
            <CheckBox
              id="terms"
              name="terms"
              checked={agreeTerms}
              onChange={() => {
                setAgreeTerms(!agreeTerms);
              }}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color={'primary'}
            />
          </div>
          <label
            htmlFor="terms"
            className={styles.conditionText}
            style={{
              paddingLeft: '9px',
              alignSelf: 'center',
            }}
          >
            {t('agreeTerms')}
            <a
              href="https://pp.eco/legal/en/terms"
              target="_blank"
              rel="nofollow noreferrer"
            >
              {t('pftp')}
            </a>
          </label>
        </div>
        <div className={styles.registerButton}>
          <button
            id={'RegTressSubmit'}
            onClick={handleSubmit(submitRegisterTrees)}
            className={`primaryButton ${
              !(agreeTerms && agreeToGuidelines) ? styles.disabled : ''
            }`}
            disabled={!(agreeTerms && agreeToGuidelines)}
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
    <SingleContribution
      // treeCount={treeCount}
      // treeSpecies={treeSpecies}
      // plantDate={plantDate}
      contributionDetails={contributionDetails}
      geometry={geometry}
    />
  );
}

import React, { ReactElement, useState } from 'react';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import styles from './../StepForm.module.scss';
import MapGL, {
  Marker,
  NavigationControl,
  FlyToInterpolator,
} from 'react-map-gl';
import * as d3 from 'd3-ease';
import { makeStyles } from '@mui/styles';
import { MenuItem } from '@mui/material';
import InfoIcon from './../../../../../public/assets/images/icons/manageProjects/Info';
import {
  postAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import addServerErrors from '../../../../utils/apiRequests/addServerErrors';
import {
  getFormattedNumber,
  parseNumber,
} from '../../../../utils/getFormattedNumber';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import themeProperties from '../../../../theme/themeProperties';
import { ThemeContext } from '../../../../theme/themeContext';
import { useRouter } from 'next/router';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import GeocoderArcGIS from 'geocoder-arcgis';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

interface Props {
  handleNext: Function;
  projectDetails: Object;
  setProjectDetails: Function;
  errorMessage: String;
  setProjectGUID: Function;
  setErrorMessage: Function;
  projectGUID: any;
  token: any;
  purpose: String;
}

export default function BasicDetails({
  handleNext,
  token,
  projectDetails,
  setProjectDetails,
  errorMessage,
  setProjectGUID,
  setErrorMessage,
  projectGUID,
  purpose,
}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['manageProjects']);
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };

  const [skipButtonVisible, setSkipButtonVisible] = React.useState(false);

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  // Map setup
  const { theme } = React.useContext(ThemeContext);
  const { impersonatedEmail } = React.useContext(UserPropsContext);
  const defaultMapCenter = [0, 0];
  const defaultZoom = 1.4;
  const mapRef = React.useRef(null);
  const [style, setStyle] = React.useState(EMPTY_STYLE);
  const [wrongCoordinatesMessage, setWrongCoordinatesMessage] =
    React.useState(false);
  const [viewport, setViewPort] = React.useState({
    width: 760,
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const router = useRouter();

  const useStylesAutoComplete = makeStyles({
    root: {
      color:
        theme === 'theme-light'
          ? `${themeProperties.light.primaryFontColor} !important`
          : `${themeProperties.dark.primaryFontColor} !important`,
      backgroundColor:
        theme === 'theme-light'
          ? `${themeProperties.light.backgroundColor} !important`
          : `${themeProperties.dark.backgroundColor} !important`,
    },
    option: {
      // color: '#2F3336',
      '&:hover': {
        backgroundColor:
          theme === 'theme-light'
            ? `${themeProperties.light.backgroundColorDark} !important`
            : `${themeProperties.dark.backgroundColorDark} !important`,
      },
    },
  });
  const classes = useStylesAutoComplete();
  const { handleError } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    //loads the default mapstyle
    async function loadMapStyle() {
      const result = await getMapStyle('openStreetMap');
      if (result) {
        setStyle(result);
      }
    }
    loadMapStyle();
  }, []);

  const [projectCoords, setProjectCoords] = React.useState([0, 0]);

  const changeLat = (e: any) => {
    if (e.target.value && e.target.value > -90 && e.target.value < 90) {
      setProjectCoords([
        projectCoords ? projectCoords[0] : 0,
        parseFloat(e.target.value),
      ]);
    }
  };
  const changeLon = (e: any) => {
    if (e.target.value && e.target.value > -180 && e.target.value < 180) {
      setProjectCoords([
        parseFloat(e.target.value),
        projectCoords ? projectCoords[1] : 0,
      ]);
    }
  };
  const _onViewportChange = (view: any) => setViewPort({ ...view });

  const classifications = [
    {
      label: ready ? t('manageProjects:largeScalePlanting') : '',
      value: 'large-scale-planting',
    },
    {
      label: ready ? t('manageProjects:agroforestry') : '',
      value: 'agroforestry',
    },
    {
      label: ready ? t('manageProjects:naturalRegeneration') : '',
      value: 'natural-regeneration',
    },
    {
      label: ready ? t('manageProjects:managedRegeneration') : '',
      value: 'managed-regeneration',
    },
    {
      label: ready ? t('manageProjects:urbanPlanting') : '',
      value: 'urban-planting',
    },
    {
      label: ready ? t('manageProjects:otherPlanting') : '',
      value: 'other-planting',
    },
  ];

  const ecosystemsType = [
    {
      label: ready ? t('manageProjects:tropicalMoistForest') : '',
      value: 'tropical-moist-forests',
    },
    {
      label: ready ? t('manageProjects:tropicalDryForests') : '',
      value: 'tropical-dry-forests',
    },
    {
      label: ready ? t('manageProjects:tropicalConiferousForests') : '',
      value: 'tropical-coniferous-forests',
    },
    {
      label: ready ? t('manageProjects:tropicalGrasslandsForests') : '',
      value: 'tropical-grasslands-forests',
    },
    {
      label: ready ? t('manageProjects:temperateBroadleafForests') : '',
      value: 'temperate-broadleaf-forests',
    },
    {
      label: ready ? t('manageProjects:temperateGrasslandsForests') : '',
      value: 'temperate-grasslands-forests',
    },
    {
      label: ready ? t('manageProjects:mediterraneanForests') : '',
      value: 'mediterranean-forests',
    },
    {
      label: ready ? t('manageProjects:mangroves') : '',
      value: 'mangroves',
    },
    {
      label: ready ? t('manageProjects:deserts') : '',
      value: 'deserts',
    },
    {
      label: ready ? t('manageProjects:floodedGrasslands') : '',
      value: 'flooded-grasslands',
    },
    {
      label: ready ? t('manageProjects:montaneGrasslands') : '',
      value: 'montane-grasslands',
    },
    {
      label: ready ? t('manageProjects:borealForests') : '',
      value: 'boreal-forests',
    },
    {
      label: ready ? t('manageProjects:tundra') : '',
      value: 'tundra',
    },
    {
      label: ready ? t('manageProjects:temperateConiferousForests') : '',
      value: 'temperate-coniferous-forests',
    },
  ];

  // Default Form Fields
  const defaultBasicDetails =
    purpose === 'trees'
      ? {
          name: '',
          slug: '',
          classification: {
            label: ready ? t('manageProjects:projectType') : '',
            value: null,
          },
          countTarget: 0,
          website: '',
          description: '',
          acceptDonations: false,
          unitCost: 0,
          publish: false,
          metadata: {
            visitorAssistance: false,
            enablePlantLocations: false,
          },
          currency: 'EUR',
          latitude: 0,
          longitude: 0,
        }
      : {
          purpose: 'conservation',
          name: '',
          slug: '',
          description: '',
          acceptDonations: false,
          unitCost: 0,
          currency: 'EUR',
          latitude: 0,
          longitude: 0,
          ecosystems: '',
          metadata: {
            ecosystems: {
              label: ready ? t('manageProjects:ecosystems') : '',
              value: null,
            },
            impacts: {
              benefits: '',
              ecologicalBenefits: '',
              socialBenefits: '',
              coBenefits: '',
            },
          },
        };

  const {
    register,
    handleSubmit,
    errors,
    control,
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm({ mode: 'onBlur', defaultValues: defaultBasicDetails });

  const nextStep = () => {
    handleNext();
  };

  const [acceptDonations, setAcceptDonations] = useState(false);
  //if project is already had created then user can visit to  other forms using skip button
  React.useEffect(() => {
    if (projectDetails.id) {
      setSkipButtonVisible(true);
    }
  }, [router]);

  // const treeCost = watch('treeCost');

  React.useEffect(() => {
    if (projectDetails) {
      const basicDetails =
        purpose === 'trees'
          ? {
              name: projectDetails.name,
              slug: projectDetails.slug,
              classification: projectDetails.classification,
              countTarget: projectDetails.countTarget,
              website: projectDetails.website,
              description: projectDetails.description,
              acceptDonations: projectDetails.acceptDonations,
              unitCost: getFormattedNumber(
                i18n.language,
                projectDetails.unitCost || 0
              ),

              visitorAssistance: projectDetails.visitorAssistance,
              enablePlantLocations: projectDetails.enablePlantLocations,
              currency: projectDetails.currency,
              latitude: projectDetails.geoLatitude,
              longitude: projectDetails.geoLongitude,
            }
          : {
              purpose: projectDetails.purpose,
              name: projectDetails.name,
              slug: projectDetails.slug,

              website: projectDetails.website,
              description: projectDetails.description,
              acceptDonations: projectDetails.acceptDonations,
              unitCost: getFormattedNumber(
                i18n.language,
                projectDetails.unitCost || 0
              ),
              currency: projectDetails.currency,
              latitude: projectDetails.geoLatitude,
              longitude: projectDetails.geoLongitude,
              ecosystems: projectDetails?.metadata?.ecosystems,
              visitorAssistance: projectDetails?.metadata?.visitorAssistance,
            };
      if (projectDetails.geoLongitude && projectDetails.geoLatitude) {
        setProjectCoords([
          projectDetails.geoLongitude,
          projectDetails.geoLatitude,
        ]);
        setViewPort({
          ...viewport,
          latitude: projectDetails.geoLatitude,
          longitude: projectDetails.geoLongitude,
          zoom: 7,
        });
      }
      reset(basicDetails);
      if (projectDetails.acceptDonations) {
        setAcceptDonations(projectDetails.acceptDonations);
      }
    }
  }, [projectDetails]);

  const onSubmit = (data: any) => {
    setIsUploadingData(true);
    const submitData =
      purpose === 'trees'
        ? {
            name: data.name,
            slug: data.slug,
            classification: data.classification,
            metadata: {
              visitorAssistance: data.visitorAssistance,
              enablePlantLocations: data.enablePlantLocations,
            },
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(data.longitude),
                parseFloat(data.latitude),
              ],
            },
            countTarget: Number(data.countTarget),
            website: data.website,
            description: data.description,
            acceptDonations: data.acceptDonations,
            unitCost: data.unitCost
              ? parseNumber(i18n.language, data.unitCost)
              : undefined,
            currency: 'EUR',
          }
        : {
            purpose: 'conservation',
            name: data.name,
            slug: data.slug,
            website: data.website,
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(data.longitude),
                parseFloat(data.latitude),
              ],
            },
            description: data.description,
            acceptDonations: data.acceptDonations,
            unitCost: data.unitCost
              ? parseNumber(i18n.language, data.unitCost)
              : null,
            currency: 'EUR',
            metadata: {
              ecosystems: data.ecosystems,
              visitorAssistance: data.visitorAssistance,
            },
          };

    // Check if GUID is set use update instead of create project
    if (projectGUID) {
      putAuthenticatedRequest(
        `/app/projects/${projectGUID}`,
        submitData,
        token,
        impersonatedEmail,
        handleError
      )
        .then((res) => {
          if (!res.code) {
            setErrorMessage('');
            setProjectDetails(res);
            setIsUploadingData(false);
            handleNext();
          } else {
            if (res.code === 404) {
              setIsUploadingData(false);
              setErrorMessage(res.message);
            } else if (res.code === 400) {
              setIsUploadingData(false);
              if (res.errors && res.errors.children) {
                addServerErrors(res.errors.children, setError);
              }
            } else {
              setIsUploadingData(false);
              setErrorMessage(res.message);
            }
          }
        })
        .catch((err) => {
          setIsUploadingData(false);
          setErrorMessage(err);
        });
    } else {
      postAuthenticatedRequest(
        `/app/projects`,
        submitData,
        token,
        impersonatedEmail,
        handleError
      )
        .then((res) => {
          if (!res.code) {
            setErrorMessage('');
            setProjectGUID(res.id);
            setProjectDetails(res);
            router.push(`/profile/projects/${res.id}?type=media`);
            setIsUploadingData(false);
          } else {
            if (res.code === 404) {
              setIsUploadingData(false);
              setErrorMessage(res.message);
            } else if (res.code === 400) {
              setIsUploadingData(false);
              if (res.errors && res.errors.children) {
                addServerErrors(res.errors.children, setError);
              }
            } else {
              setIsUploadingData(false);
              setErrorMessage(res.message);
            }
          }
        })
        .catch((err) => {
          setIsUploadingData(false);
          setErrorMessage(err);
        });
    }
  };
  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
  );

  return ready ? (
    <div className={`${styles.stepContainer} `}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
          <div className={styles.formFieldLarge} data-test-id="projectName">
            <MaterialTextField
              inputRef={register({
                required: {
                  value: true,
                  message: t('manageProjects:nameValidation'),
                },
              })}
              label={t('manageProjects:name')}
              variant="outlined"
              name="name"
            />
            {errors.name && (
              <span className={styles.formErrors}>{errors.name.message}</span>
            )}
          </div>

          <div className={styles.formField}>
            <div className={styles.formFieldHalf} data-test-id="slug" id="slug">
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: t('manageProjects:slugValidation'),
                  },
                })}
                label={t('manageProjects:slug')}
                variant="outlined"
                name="slug"
                InputProps={{
                  startAdornment: (
                    <p className={styles.inputStartAdornment}>pp.eco/</p>
                  ),
                }}
              />
              {errors.slug && (
                <span className={styles.formErrors}>{errors.slug.message}</span>
              )}
            </div>
            <div style={{ width: '20px' }}></div>
            {purpose === 'trees' ? (
              <div
                className={styles.formFieldHalf}
                data-test-id="classification"
              >
                <Controller
                  as={
                    <MaterialTextField
                      label={t('manageProjects:classification')}
                      variant="outlined"
                      select
                    >
                      {classifications.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          classes={{
                            // option: classes.option,
                            root: classes.root,
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </MaterialTextField>
                  }
                  name="classification"
                  rules={{
                    required: t('manageProjects:classificationValidation'),
                  }}
                  control={control}
                />
                {errors.classification && (
                  <span className={styles.formErrors}>
                    {errors.classification.message}
                  </span>
                )}
              </div>
            ) : (
              <div className={styles.formFieldHalf}>
                <Controller
                  as={
                    <MaterialTextField
                      label={t('manageProjects:ecosystems')}
                      variant="outlined"
                      select
                    >
                      {ecosystemsType.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          classes={{
                            // option: classes.option,
                            root: classes.root,
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </MaterialTextField>
                  }
                  name="ecosystems"
                  rules={{
                    required: t('manageProjects:ecosystemType'),
                  }}
                  control={control}
                />
                {errors.ecosystems && (
                  <span className={styles.formErrors}>
                    {errors.ecosystems.message}
                  </span>
                )}
              </div>
            )}
          </div>

          {purpose === 'trees' ? (
            <div className={styles.formField}>
              <div className={styles.formFieldHalf} data-test-id="target">
                <MaterialTextField
                  inputRef={register({
                    required: {
                      value: true,
                      message: t('manageProjects:countTargetValidation'),
                    },
                    validate: (value) => parseInt(value, 10) > 1,
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                  label={t('manageProjects:countTarget')}
                  variant="outlined"
                  name="countTarget"
                  placeholder={'0'}
                />
                {errors.countTarget && (
                  <span className={styles.formErrors}>
                    {errors.countTarget.message
                      ? errors.countTarget.message
                      : t('manageProjects:countTargetValidation2')}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className={styles.formFieldHalf} data-test-id="website">
            <MaterialTextField
              label={t('manageProjects:website')}
              variant="outlined"
              name="website"
              inputRef={register({
                required: {
                  value: true,
                  message: t('manageProjects:websiteValidationRequired'),
                },
                pattern: {
                  //value: /^(?:http(s)?:\/\/)?[\w\.\-]+(?:\.[\w\.\-]+)+[\w\.\-_~:/?#[\]@!\$&'\(\)\*\+,;=#%]+$/,
                  value:
                    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=*]*)$/,
                  message: t('manageProjects:websiteValidationInvalid'),
                },
              })}
            />
            {errors.website && (
              <span className={styles.formErrors}>
                {errors.website.message}
              </span>
            )}
          </div>

          <div className={styles.formFieldLarge} data-test-id="aboutProject">
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
          </div>

          <div className={styles.formField} style={{ minHeight: '80px' }}>
            <div className={`${styles.formFieldHalf}`}>
              <div className={`${styles.formFieldRadio}`}>
                <label
                  htmlFor="acceptDonations"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  data-test-id="receiveDonations"
                >
                  {t('manageProjects:receiveDonations')}
                  <div
                    style={{
                      height: '13px',
                      width: '13px',
                      marginLeft: '6px',
                      marginBottom: '3px',
                    }}
                  >
                    <InfoIcon />
                    <div className={styles.popover}>
                      <div
                        className={styles.popoverContent}
                        style={{ left: '-150px' }}
                      >
                        <p>{t('manageProjects:receiveDonationsInfo')}</p>
                      </div>
                    </div>
                  </div>
                </label>

                <Controller
                  name="acceptDonations"
                  control={control}
                  render={(properties) => (
                    <ToggleSwitch
                      id="acceptDonations"
                      checked={properties.value}
                      onChange={(e: any) => {
                        properties.onChange(e.target.checked);
                        setAcceptDonations(e.target.checked);
                      }}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  )}
                />
              </div>
            </div>
            {acceptDonations ? (
              <div className={styles.formFieldHalf} data-test-id="treeCost">
                <MaterialTextField
                  inputRef={register({
                    required: {
                      value: acceptDonations,
                      message: t('manageProjects:treeCostValidaitonRequired'),
                    },
                    validate: (value) =>
                      parseNumber(i18n.language, value) > 0 &&
                      parseNumber(i18n.language, value) <= 100,
                  })}
                  label={
                    router.query.purpose === 'trees' ||
                    projectDetails.purpose === 'trees'
                      ? t('manageProjects:unitCost')
                      : t('manageProjects:unitCostConservation')
                  }
                  variant="outlined"
                  type="number"
                  name="unitCost"
                  placeholder={'0'}
                  InputProps={{
                    startAdornment: (
                      <p
                        className={styles.inputStartAdornment}
                        style={{ paddingRight: '4px' }}
                      >{`€`}</p>
                    ),
                  }}
                />
                {errors.unitCost && (
                  <span className={styles.formErrors}>
                    {errors.unitCost.message
                      ? errors.unitCost.message
                      : t(
                          router.query.purpose === 'trees' ||
                            projectDetails.purpose === 'trees'
                            ? 'manageProjects:treeCostValidation'
                            : 'manageProjects:conservationCostValidation'
                        )}
                  </span>
                )}
              </div>
            ) : null}
          </div>

          <div
            className={`${styles.formFieldLarge} ${styles.mapboxContainer}`}
            data-test-id="marker"
          >
            <p
              style={{
                backgroundColor:
                  theme === 'theme-light'
                    ? themeProperties.light.light
                    : themeProperties.dark.dark,
              }}
            >
              {t('manageProjects:projectLocation')}
            </p>
            <MapGL
              {...viewport}
              ref={mapRef}
              mapStyle={style}
              onViewportChange={_onViewportChange}
              onClick={(event) => {
                setProjectCoords(event.lngLat);
                const latLong = {
                  latitude: event.lngLat[1],
                  longitude: event.lngLat[0],
                };
                geocoder
                  .reverse(`${latLong.longitude}, ${latLong.latitude}`, {
                    // longitude,latitude
                    maxLocations: 10,
                    distance: 100,
                  })
                  .then((result) => {
                    if (result?.address?.Type === 'Ocean') {
                      setWrongCoordinatesMessage(true);
                      setError('latitude', {
                        message: '',
                      });
                    } else {
                      setWrongCoordinatesMessage(false);
                      clearErrors('latitude');
                    }
                  })
                  .catch((error) => {
                    console.log(`error`, error);
                  });
                setViewPort({
                  ...viewport,
                  latitude: event.lngLat[1],
                  longitude: event.lngLat[0],
                  transitionDuration: 400,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionEasing: d3.easeCubic,
                });
                setValue('latitude', latLong.latitude);
                setValue('longitude', latLong.longitude);
              }}
            >
              {projectCoords ? (
                <Marker
                  latitude={projectCoords[1]}
                  longitude={projectCoords[0]}
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
            <div
              className={styles.formField}
              style={{ margin: 'auto', marginTop: '-120px' }}
            >
              <div
                className={`${styles.formFieldHalf} ${styles.latlongField}`}
                data-test-id="latitude"
              >
                <MaterialTextField
                  inputRef={register({
                    required: true,
                    validate: (value) =>
                      parseFloat(value) > -90 && parseFloat(value) < 90,
                  })}
                  label={t('manageProjects:latitude')}
                  variant="outlined"
                  name={'latitude'}
                  onChange={changeLat}
                  className={styles.latitudeInput}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.-]/g, '');
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: '-6px',
                    },
                  }}
                />
                {errors.latitude && (
                  <span
                    className={styles.formErrorsAbsolute}
                    style={{ zIndex: 2, textAlign: 'center' }}
                  >
                    {wrongCoordinatesMessage
                      ? t('manageProjects:wrongCoordinates')
                      : t('manageProjects:latitudeRequired')}
                  </span>
                )}
              </div>
              <div
                className={`${styles.formFieldHalf} ${styles.latlongField}`}
                data-test-id="longitude"
              >
                <MaterialTextField
                  inputRef={register({
                    required: true,
                    validate: (value) =>
                      parseFloat(value) > -180 && parseFloat(value) < 180,
                  })}
                  label={t('manageProjects:longitude')}
                  variant="outlined"
                  onChange={changeLon}
                  name={'longitude'}
                  className={styles.longitudeInput}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.-]/g, '');
                  }}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: '-6px',
                    },
                  }}
                />
                {errors.longitude && (
                  <span
                    className={styles.formErrorsAbsolute}
                    style={{ zIndex: 2, textAlign: 'center' }}
                  >
                    {t('manageProjects:longitudeRequired')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formFieldLarge} style={{ width: '320px' }}>
            <div className={styles.formFieldRadio}>
              <label
                htmlFor="visitorAssistance"
                style={{ cursor: 'pointer' }}
                data-test-id="visitorAssistance"
              >
                {t('manageProjects:visitorAssistanceLabel')}
              </label>
              <Controller
                name="visitorAssistance"
                control={control}
                render={(properties) => (
                  <ToggleSwitch
                    id="visitorAssistance"
                    checked={properties.value}
                    onChange={(e) => properties.onChange(e.target.checked)}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                )}
              />
            </div>
          </div>

          {/* <div className={styles.formFieldLarge} style={{ width: '320px' }}>
            <div className={`${styles.formFieldRadio}`}>
              <label
                htmlFor={'publish'}
                style={{ cursor: 'pointer' }}
                data-test-id="publishProject"
              >
                {t('manageProjects:publishProject')}
              </label>

              <Controller
                name="publish"
                control={control}
                render={(properties) => (
                  <ToggleSwitch
                    checked={properties.value}
                    onChange={(e) => properties.onChange(e.target.checked)}
                    id="publish"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                )}
              />
            </div>
          </div> */}

          {/* <div className={styles.formFieldLarge} style={{ width: '320px' }}>
            <div className={`${styles.formFieldRadio}`}>
              <label htmlFor={'enablePlantLocations'}>
                Detailed Project Analysis if projectstatus=Approved
                Activate once all relevant data is submitted via Tree Mapper.
                    </label>
              <Controller
                name="enablePlantLocations"
                control={control}
                render={properties => (

                  <ToggleSwitch
                    checked={properties.value}
                    onChange={e => properties.onChange(e.target.checked)}
                    id="enablePlantLocations"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                )}
              />
            </div>
          </div> */}

          {errorMessage && errorMessage !== '' ? (
            <div className={styles.formFieldLarge}>
              <h4 className={styles.errorMessage}>{errorMessage}</h4>
            </div>
          ) : null}
        </div>
        <div className={styles.formField} style={{ marginTop: '48px' }}>
          {/* <div className={`${styles.formFieldHalf}`}>
            <input
              type="submit"
              className={styles.secondaryButton}
              value="Continue to Media"
            ></input>
          </div> */}

          <div className={(styles.formField, styles.basicDetailButton)}>
            <button
              id={'basicDetailsCont'}
              onClick={handleSubmit(onSubmit)}
              className="primaryButton custom"
              style={{ width: '169px', height: '46px' }}
              data-test-id="basicDetailsCont"
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                t('manageProjects:saveAndContinue')
              )}
            </button>
            {skipButtonVisible ? (
              <div className={(styles.formField, styles.skipBasicButton)}>
                <button
                  id={'skip'}
                  className="primaryButton"
                  onClick={nextStep}
                  style={{
                    width: '89px',
                  }}
                >
                  {t('manageProjects:skip')}
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </form>
    </div>
  ) : (
    <></>
  );
}

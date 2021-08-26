import React, { ReactElement, useState } from 'react';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm, Controller } from 'react-hook-form';
import i18next from './../../../../../i18n';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import styles from './../StepForm.module.scss';
import MapGL, {
  Marker,
  NavigationControl,
  FlyToInterpolator,
} from 'react-map-gl';
import * as d3 from 'd3-ease';
import { MenuItem } from '@material-ui/core';
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

const { useTranslation } = i18next;

interface Props {
  handleNext: Function;
  projectDetails: Object;
  setProjectDetails: Function;
  errorMessage: String;
  setProjectGUID: Function;
  setErrorMessage: Function;
  projectGUID: any;
  token: any;
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
}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['manageProjects']);
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  // Map setup
  const defaultMapCenter = [0, 0];
  const defaultZoom = 1.4;
  const mapRef = React.useRef(null);
  const [style, setStyle] = React.useState(EMPTY_STYLE);
  const [viewport, setViewPort] = React.useState({
    width: 760,
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

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

  // Default Form Fields
  const defaultBasicDetails = {
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
    treeCost: 0,
    publish: false,
    visitorAssistance: false,
    enablePlantLocations: false,
    currency: 'EUR',
    latitude: 0,
    longitude: 0,
  };

  const {
    register,
    handleSubmit,
    errors,
    control,
    reset,
    setValue,
    setError,
  } = useForm({ mode: 'onBlur', defaultValues: defaultBasicDetails });


  const [acceptDonations, setAcceptDonations] = useState(false);
  // const treeCost = watch('treeCost');

  React.useEffect(() => {
    if (projectDetails) {
      const basicDetails = {
        name: projectDetails.name,
        slug: projectDetails.slug,
        classification: projectDetails.classification,
        countTarget: projectDetails.countTarget,
        website: projectDetails.website,
        description: projectDetails.description,
        acceptDonations: projectDetails.acceptDonations,
        treeCost: getFormattedNumber(
          i18n.language,
          projectDetails.treeCost || 0
        ),
        publish: projectDetails.publish,
        visitorAssistance: projectDetails.visitorAssistance,
        enablePlantLocations: projectDetails.enablePlantLocations,
        currency: projectDetails.currency,
        latitude: projectDetails.geoLatitude,
        longitude: projectDetails.geoLongitude,
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
    const submitData = {
      name: data.name,
      slug: data.slug,
      classification: data.classification,
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
      treeCost: data.treeCost
        ? parseNumber(i18n.language, data.treeCost)
        : null,
      currency: 'EUR',
      visitorAssistance: data.visitorAssistance,
      publish: data.publish,
      enablePlantLocations: data.enablePlantLocations,
    };

    // Check if GUID is set use update instead of create project
    if (projectGUID) {
      putAuthenticatedRequest(
        `/app/projects/${projectGUID}`,
        submitData,
        token
      ).then((res) => {
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
      });
    } else {
      postAuthenticatedRequest(`/app/projects`, submitData, token).then(
        (res) => {
          if (!res.code) {
            setErrorMessage('');
            setProjectGUID(res.id);
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
        }
      );
    }
  };  

  return ready ? (
    <div className={`${styles.stepContainer} `}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
          <div className={styles.formFieldLarge}>
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
            <div className={styles.formFieldHalf}>
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
            <div className={styles.formFieldHalf}>
              <Controller
                as={
                  <MaterialTextField
                    label={t('manageProjects:classification')}
                    variant="outlined"
                    select
                  >
                    {classifications.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
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
          </div>

          <div className={styles.formField}>
            <div className={styles.formFieldHalf}>
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
            <div className={styles.formFieldHalf}>
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
                    value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=*]*)$/,
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
          </div>

          <div className={styles.formFieldLarge}>
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
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  {t('manageProjects:receiveDonations')}
                  <div
                    style={{ height: '13px', width: '13px', marginLeft: '6px' }}
                  >
                    <div className={styles.popover}>
                      <InfoIcon />
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
                      onChange={(e) => {
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
              <div className={styles.formFieldHalf}>
                <MaterialTextField
                  inputRef={register({
                    required: {
                      value: true,
                      message: t('manageProjects:treeCostValidaitonRequired'),
                    },
                    validate: (value) =>
                      parseNumber(i18n.language, value) > 0 &&
                      parseNumber(i18n.language, value) <= 100,
                  })}
                  label={t('manageProjects:treeCost')}
                  variant="outlined"
                  name="treeCost"
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
                {errors.treeCost && (
                  <span className={styles.formErrors}>
                    {errors.treeCost.message
                      ? errors.treeCost.message
                      : t('manageProjects:treeCostValidation')}
                  </span>
                )}
              </div>
            ) : null}
          </div>

          <div className={`${styles.formFieldLarge} ${styles.mapboxContainer}`}>
            <p>{t('manageProjects:projectLocation')}</p>
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
              <div className={`${styles.formFieldHalf} ${styles.latlongField}`}>
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
                  InputLabelProps={{ shrink: true,style:{position:'absolute',left:'50%',transform:'translateX(-50%)',top:'-6px'} }}
                />
                {errors.latitude && (
                  <span
                    className={styles.formErrorsAbsolute}
                    style={{ zIndex: 2, textAlign: 'center' }}
                  >
                    {t('manageProjects:latitudeRequired')}
                  </span>
                )}
              </div>
              <div className={`${styles.formFieldHalf} ${styles.latlongField}`}>
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
                  InputLabelProps={{ shrink: true,style:{position:'absolute',left:'50%',transform:'translateX(-50%)',top:'-6px'} }}
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
              <label htmlFor="visitorAssistance" style={{cursor: 'pointer'}}>
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

          <div className={styles.formFieldLarge} style={{ width: '320px' }}>
            <div className={`${styles.formFieldRadio}`}>
              <label htmlFor={'publish'} style={{cursor: 'pointer'}}>
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
          </div>
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

          <div className={`${styles.formFieldHalf}`}>
            <button
              id={'basicDetailsCont'}
              onClick={handleSubmit(onSubmit)}
              className="primaryButton"
              style={{minWidth: "240px"}}
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                t('manageProjects:saveAndContinue')
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <></>
  );
}

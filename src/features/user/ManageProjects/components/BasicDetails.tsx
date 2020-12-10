import React, { ReactElement } from 'react';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm, Controller } from 'react-hook-form';
import i18next from './../../../../../i18n';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import styles from './../styles/StepForm.module.scss';
import MapGL, { Marker, NavigationControl } from 'react-map-gl';
import { MenuItem } from '@material-ui/core';
import InfoIcon from './../../../../../public/assets/images/icons/manageProjects/Info';
import {
  postAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';

const { useTranslation } = i18next;
const classifications = [
  { label: 'Large scale planting', value: 'large-scale-planting' },
  { label: 'Agroforestry', value: 'agroforestry' },
  { label: 'Natural Regeneration', value: 'natural-regeneration' },
  { label: 'Managed Regeneration', value: 'managed-regeneration' },
  { label: 'Urban Planting', value: 'urban-planting' },
  { label: 'Other Planting', value: 'other-planting' },
];

interface Props {
  handleNext: Function;
  projectDetails: Object;
  setProjectDetails: Function;
  errorMessage: String;
  setProjectGUID: Function;
  setErrorMessage: Function;
  projectGUID: any;
  session: any;
}

export default function BasicDetails({
  handleNext,
  session,
  projectDetails,
  setProjectDetails,
  errorMessage,
  setProjectGUID,
  setErrorMessage,
  projectGUID,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['manageProjects']);

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  // Map setup
  const defaultMapCenter = [0, 0];
  const defaultZoom = 1.4;
  const mapRef = React.useRef(null);
  const [viewport, setViewPort] = React.useState({
    width: 760,
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

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

  // Default Form Fields
  const defaultBasicDetails = {
    name: '',
    slug: '',
    classification: { label: 'Project Type', value: null },
    countTarget: 0,
    website: '',
    description: '',
    acceptDonations: true,
    treeCost: 0,
    publish: true,
    visitorAssistance: false,
    enablePlantLocations: false,
    currency: 'EUR',
    projectCoords: {
      latitude: 0,
      longitude: 0,
    },
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

  const acceptDonations = watch('acceptDonations');

  // const treeCost = watch('treeCost');

  // console.log('watch treeCost',parseFloat(treeCost));
  

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
        treeCost: projectDetails.treeCost,
        publish: projectDetails.publish,
        visitorAssistance: projectDetails.visitorAssistance,
        enablePlantLocations: projectDetails.enablePlantLocations,
        currency: projectDetails.currency,
        projectCoords: {
          latitude: projectDetails.geoLatitude,
          longitude: projectDetails.geoLongitude,
        },
      };
      if (projectDetails.hasOwnProperty('geoLongitude') && projectDetails.hasOwnProperty('geoLatitude')) {
        if (projectDetails.geoLongitude && projectDetails.geoLatitude) {
          setProjectCoords([projectDetails.geoLongitude, projectDetails.geoLatitude]);
          setViewPort({
            ...viewport,
            latitude: projectDetails.geoLatitude,
            longitude: projectDetails.geoLongitude,
            zoom: 7,
          });
        }
      }
      reset(basicDetails);
    }
  }, [projectDetails]);

  const onSubmit = (data: any) => {
    // console.log('data.treeCost', data.treeCost.replace(/,/g, '.'));
    
    setIsUploadingData(true);
    let submitData = {
      name: data.name,
      slug: data.slug,
      classification: data.classification,
      geometry: {
        type: 'Point',
        coordinates: [
          parseFloat(data.projectCoords.longitude),
          parseFloat(data.projectCoords.latitude),
        ],
      },
      countTarget: Number(data.countTarget),
      website: data.website,
      description: data.description,
      acceptDonations: data.acceptDonations,
      treeCost: data.treeCost ? Number(data.treeCost.replace(/,/g, '.')) : 0,
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
        session
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
          } else {
            setIsUploadingData(false);
            setErrorMessage(res.message);
          }
        }
      });
    } else {
      postAuthenticatedRequest(`/app/projects`, submitData, session).then(
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
            } else {
              setIsUploadingData(false);
              setErrorMessage(res.message);
            }
          }
        }
      );
    }
  };

  return (
    <div className={`${styles.stepContainer} `}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                rules={{ required: t('manageProjects:classificationValidation') }}
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
                    value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=\*]*)$/,
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

          <div className={styles.formField}>
            <div className={`${styles.formFieldHalf}`}>
              <div className={`${styles.formFieldRadio}`}>
                <label
                  htmlFor="acceptDonations"
                  style={{ display: 'flex', alignItems: 'center' }}
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
                        <p>
                        {t('manageProjects:receiveDonationsInfo')}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                <Controller
                  name="acceptDonations"
                  control={control}
                  render={(props) => (
                    <ToggleSwitch
                      id="acceptDonations"
                      checked={props.value}
                      onChange={(e) => props.onChange(e.target.checked)}
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
                    validate: (value) => parseFloat(value) > 0 && parseFloat(value) <= 100,
                    pattern: {
                      value: /^[+]?[0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)$/,
                      message: t('manageProjects:treeCostValidationInvalid'),
                    }
                  })}
                  label={t('manageProjects:treeCost')}
                  variant="outlined"
                  name="treeCost"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9,.]/g, '');
                  }}
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
                      : t("manageProjects:treeCostValidation")}
                  </span>
                )}
              </div>
            ) : null}
          </div>

          <div className={`${styles.formFieldLarge} ${styles.mapboxContainer}`}>
            <p>
              {t("manageProjects:projectLocation")}
            </p>
            <MapGL
              {...viewport}
              ref={mapRef}
              mapStyle="mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7"
              mapboxApiAccessToken={process.env.MAPBOXGL_ACCESS_TOKEN}
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
                  zoom: 7,
                });
                setValue('projectCoords', latLong);
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
                  label="Latitude"
                  variant="outlined"
                  name={'projectCoords.latitude'}
                  onChange={changeLat}
                  className={styles.latitudeInput}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.-]/g, '');
                  }}
                />
              </div>
              <div className={`${styles.formFieldHalf} ${styles.latlongField}`}>
                <MaterialTextField
                  inputRef={register({
                    required: true,
                    validate: (value) =>
                      parseFloat(value) > -180 && parseFloat(value) < 180,
                  })}
                  label="Longitude"
                  variant="outlined"
                  onChange={changeLon}
                  name={'projectCoords.longitude'}
                  className={styles.longitudeInput}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.-]/g, '');
                  }}
                />
              </div>
            </div>
          </div>

          <div className={styles.formFieldLarge} style={{ width: '320px' }}>
            <div className={styles.formFieldRadio}>
              <label htmlFor="visitorAssistance">
                {t('manageProjects:visitorAssistanceLabel')}
              </label>
              <Controller
                name="visitorAssistance"
                control={control}
                render={(props) => (
                  <ToggleSwitch
                    id="visitorAssistance"
                    checked={props.value}
                    onChange={(e) => props.onChange(e.target.checked)}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                )}
              />
            </div>
          </div>

          <div className={styles.formFieldLarge} style={{ width: '320px' }}>
            <div className={`${styles.formFieldRadio}`}>
              <label htmlFor={'publish'}>
                {t('manageProjects:publishProject')}
              </label>

              <Controller
                name="publish"
                control={control}
                render={(props) => (
                  <ToggleSwitch
                    checked={props.value}
                    onChange={(e) => props.onChange(e.target.checked)}
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
                render={props => (

                  <ToggleSwitch
                    checked={props.value}
                    onChange={e => props.onChange(e.target.checked)}
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
            <div
              onClick={handleSubmit(onSubmit)}
              className={styles.continueButton}
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                  t('manageProjects:saveAndContinue')
                )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

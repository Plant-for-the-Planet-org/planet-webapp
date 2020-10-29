import React, { ReactElement } from 'react';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm, Controller } from 'react-hook-form';
import i18next from './../../../../../i18n';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import styles from './../styles/StepForm.module.scss';
import MapGL, { Marker,NavigationControl } from 'react-map-gl';
import { MenuItem } from '@material-ui/core';
import { useSession } from 'next-auth/client';
import PopHover from '../../../common/InputTypes/PopHover';
import InfoIcon from './../../../../../public/assets/images/icons/manageProjects/Info'
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';

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
}

export default function BasicDetails({ handleNext, projectDetails, setProjectDetails, errorMessage, setProjectGUID, setErrorMessage }: Props): ReactElement {
  const { t, i18n } = useTranslation(['manageProjects']);
  const [session, loading] = useSession();
  // Map setup
  const defaultMapCenter = [0, 0];
  const defaultZoom = 1.4;
  const mapRef = React.useRef(null);
  const [viewport, setViewPort] = React.useState({
    width: '100%',
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



  // Form Fields
  // In future if the details are present, we will feed default values here
  const defaultBasicDetails={
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
      longitude: 0
    }
  }

  const { register, handleSubmit, errors, control, reset, setValue, watch } = useForm({ mode: 'onBlur', defaultValues: defaultBasicDetails });

  const acceptDonations = watch("acceptDonations");

  React.useEffect(() => {
    if (projectDetails && projectDetails !== null) {
      const basicDetails = {
        name: projectDetails.name,
        slug: projectDetails.slug,
        classification: projectDetails.classification,
        countTarget: projectDetails.countTarget,
        website: projectDetails.website,
        description: projectDetails.description,
        acceptDonations: projectDetails.allowDonations,
        treeCost: projectDetails.treeCost,
        publish: projectDetails.publish,
        visitorAssistance: projectDetails.visitorAssistance,
        enablePlantLocations: projectDetails.enablePlantLocations,
        currency: projectDetails.currency,
        projectCoords: {
          latitude: 0,
          longitude: 0
        }
      };
      reset(basicDetails)
    }
  }, [projectDetails])

  const onSubmit = (data: any) => {

    let submitData = {
      name: data.name,
      slug: data.slug,
      classification: data.classification,
      geometry: {
        type: 'Point',
        coordinates: [
          parseFloat(data.projectCoords.longitude),
          parseFloat(data.projectCoords.latitude)
        ]
      },
      countTarget: Number(data.countTarget),
      webSite: data.website,
      description: data.description,
      acceptDonations: data.acceptDonations,
      treeCost: data.treeCost ? Number(data.treeCost) : 0,
      currency: 'EUR',
      visitorAssistance: data.visitorAssistance,
      publish: data.publish,
      enablePlantLocations: data.enablePlantLocations
    }

    postAuthenticatedRequest(`/app/projects`, submitData, session).then((res) => {
      setErrorMessage('')
      setProjectGUID(res.id)
      setProjectDetails(res)
    })

  };

  return (
    <div className={styles.stepContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formFieldLarge}>
          <MaterialTextField
            inputRef={register({
              required: {
                value: true,
                message: 'Please enter Project Name',
              },
            })}
            label={t('manageProjects:name')}
            variant="outlined"
            name="name"
          />
          {errors.name && (
            <span className={styles.formErrors}>
              {errors.name.message}
            </span>
          )}
        </div>

        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({
                required: {
                  value: true,
                  message: 'Please enter Project URL',
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
              <span className={styles.formErrors}>
                {errors.slug.message}
              </span>
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
              rules={{ required: "Please select Project type" }}
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
                  message: 'Please enter Tree target',
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
                  : 'Tree target should be more than 1'}
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
                  message: 'Please enter website URL',
                },
                pattern: {
                  value: /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
                  message: 'Invalid website URL',
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
                message: 'Please enter About project',
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
              <label htmlFor="acceptDonations" style={{ display: 'flex', alignItems: 'center' }}>Receive Donations <div style={{ height: '13px', width: '13px', marginLeft: '6px' }}>
                <PopHover label={<InfoIcon />} value={'Please activate once the project profile is complete. Plant-for-the-Planet will then review the profile and inform you if you are eligible to receive donations through this platform. This may take a few weeks.'} />

              </div></label>

              <Controller
                name="acceptDonations"
                control={control}
                render={props => (
                  <ToggleSwitch
                    id="acceptDonations"
                    checked={props.value}
                    onChange={e => props.onChange(e.target.checked)}
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
                    message: 'Please enter cost per tree',
                  },
                  validate: (value) =>
                    parseFloat(value) > 0,
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
                    : 'Cost per tree should be more than €0 and lesser than €3.4'}
                </span>
              )}
            </div>
          ) : null}

        </div>

        <div className={`${styles.formFieldLarge} ${styles.mapboxContainer}`}>
          <p>Project Location</p>
          <MapGL
            {...viewport}
            ref={mapRef}
            mapStyle="mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7"
            mapboxApiAccessToken={process.env.MAPBOXGL_ACCESS_TOKEN}
            onViewportChange={_onViewportChange}
            onClick={(event) => {
              setProjectCoords(event.lngLat)
              const latLong = {
                latitude: event.lngLat[1],
                longitude: event.lngLat[0]
              }
              setValue('projectCoords', latLong)
            }}

          >
            {projectCoords !== null ? (
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
            <div className={styles.formFieldHalf}>
              <MaterialTextField
                inputRef={register({ required: true, validate: (value) => parseFloat(value) > -90 && parseFloat(value) < 90 })}

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
            <div className={styles.formFieldHalf}>
              <MaterialTextField
                inputRef={register({ required: true, validate: (value) => parseFloat(value) > -180 && parseFloat(value) < 180 })}
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
              I will provide lodging, site access and local transport if a
              reviewer is sent by Plant-for-the-Planet.
            </label>
            <Controller
              name="visitorAssistance"
              control={control}
              render={props => (
                <ToggleSwitch
                  id="visitorAssistance"
                  checked={props.value}
                  onChange={e => props.onChange(e.target.checked)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />

              )}
            />

          </div>
        </div>

        <div className={styles.formFieldLarge} style={{ width: '320px' }}>
          <div className={`${styles.formFieldRadio}`}>
            <label htmlFor={'publish'}>Publish Project (if projectstatus=Approved)</label>

            <Controller
              name="publish"
              control={control}
              render={props => (
                <ToggleSwitch
                  checked={props.value}
                  onChange={e => props.onChange(e.target.checked)}
                  id="publish"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              )}
            />
          </div>
        </div>
        <div className={styles.formFieldLarge} style={{ width: '320px' }}>
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
        </div>

        {
          errorMessage && errorMessage !== '' ? (
            <div className={styles.formFieldLarge}>
              <h4 className={styles.errorMessage}>{errorMessage}</h4>
            </div>
          ) : null
        }

        <div className={styles.formField} style={{ marginTop: '48px' }}>
          <div className={`${styles.formFieldHalf}`}>
            <input
              type="submit"
              className={styles.secondaryButton}
              value="Continue to Media"
            ></input>
          </div>

          <div className={`${styles.formFieldHalf}`}>
            <input
              type="submit"
              className={styles.continueButton}
              value="Save & see Project"
            ></input>
          </div>
        </div>
      </form>
    </div>
  );
}

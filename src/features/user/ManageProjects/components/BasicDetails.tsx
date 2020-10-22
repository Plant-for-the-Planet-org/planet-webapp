import React, { ReactElement } from 'react';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm } from 'react-hook-form';
import i18next from './../../../../../i18n';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import styles from './../styles/StepForm.module.scss';
import MapGL, { Marker } from 'react-map-gl';
import { MenuItem } from '@material-ui/core';

const { useTranslation } = i18next;

interface Props {
  handleNext: Function;
}

export default function BasicDetails({ handleNext }: Props): ReactElement {
  const { t, i18n } = useTranslation(['manageProjects']);

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
    setProjectCoords([
      projectCoords ? projectCoords[0] : 0,
      parseFloat(e.target.value),
    ]);
  };

  const changeLon = (e: any) => {
    setProjectCoords([
      parseFloat(e.target.value),
      projectCoords ? projectCoords[1] : 0,
    ]);
  };
  const _onViewportChange = (view: any) => setViewPort({ ...view });


  // Form Fields
  // In future if the details are present, we will feed default values here
  const defaultBasicDetails = {
    projectName: '',
    projectURL: '',
    projectType: '',
    treeTarget: 0,
    website: '',
    description: '',
    costPerTree: 0,
  };
  const [receiveDonations, setReceiveDonations] = React.useState(true);
  const [reviewerExpense, setReviewerExpense] = React.useState(true);
  const [publishProject, setPublishProject] = React.useState(true);
  const [projectAnalysis, setProjectAnalysis] = React.useState(true);

  const [basicDetails, setBasicDetails] = React.useState(defaultBasicDetails);

  const changeBasicDetails = (e: any) => {
    setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
  };

  const { register, handleSubmit, errors } = useForm({ mode: 'onChange' });

  const projectTypes = [
    { label: 'Large scale planting', value: 'large-scale-planting' },
    { label: 'Agroforestry', value: 'agroforestry' },
    { label: 'Natural Regeneration', value: 'natural-regeneration' },
    { label: 'Managed Regeneration', value: 'managed-regeneration' },
    { label: 'Urban Planting', value: 'urban-planting' },
    { label: 'Other Planting', value: 'other-planting' },
  ];

  const onSubmit = (data: any) => {

    console.log('Data', data);
    // Project type
    // Receive donations
    // Lodging support

    let submitData = {
      name: data.projectName,
      desiredSlug: data.projectURL,
      classification: data.projectType,
      geoLocation: {
        type: 'Point',
        coordinates: [
          data.longitude,
          data.latitude
        ]
      },
      countTarget: Number(data.treeTarget),
      webSite: data.website,
      description: data.description,
      acceptDonations: receiveDonations,
      treeCost: data.costPerTree ? Number(data.costPerTree) : 0,
      currency: 'EUR',
      vistorAssitance: reviewerExpense,
      publish: publishProject, 
      enablePlantLocations: projectAnalysis 
    }

    console.log('Submit Data', submitData);


    // handleNext();

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
            label={t('manageProjects:projectName')}
            variant="outlined"
            name="projectName"
            onChange={changeBasicDetails}
          />
          {errors.projectName && (
            <span className={styles.formErrors}>
              {errors.projectName.message}
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
              label={t('manageProjects:projectURL')}
              variant="outlined"
              name="projectURL"
              onChange={changeBasicDetails}
              InputProps={{
                startAdornment: (
                  <p className={styles.inputStartAdornment}>pp.eco/</p>
                ),
              }}
            />
            {errors.projectURL && (
              <span className={styles.formErrors}>
                {errors.projectURL.message}
              </span>
            )}
          </div>
          <div style={{ width: '20px' }}></div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              // inputRef={register({
              //   required: {
              //     value: true,
              //     message: "Please select Project type"
              //   },
              // })}
              label={t('manageProjects:projectType')}
              variant="outlined"
              name="projectType"
              onChange={changeBasicDetails}
              select
              value={basicDetails.projectType}

            >
              {projectTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MaterialTextField>
            {errors.projectType && (
              <span className={styles.formErrors}>
                {errors.projectType.message}
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
              label={t('manageProjects:treeTarget')}
              variant="outlined"
              name="treeTarget"
              onChange={changeBasicDetails}
            />
            {errors.treeTarget && (
              <span className={styles.formErrors}>
                {errors.treeTarget.message
                  ? errors.treeTarget.message
                  : 'Tree target should be more than 1'}
              </span>
            )}
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              label={t('manageProjects:website')}
              variant="outlined"
              name="website"
              onChange={changeBasicDetails}
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
            onChange={changeBasicDetails}
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
              <label htmlFor="receiveDonations">Receive Donations</label>
              <ToggleSwitch
                id="receiveDonations"
                checked={receiveDonations}
                onChange={() => setReceiveDonations(!receiveDonations)}
                name="receiveDonations"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
          </div>
          {receiveDonations ? (
            <div className={styles.formFieldHalf}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: 'Please enter cost per tree',
                  },
                  validate: (value) =>
                    parseFloat(value) > 0 && parseFloat(value) < 3.4028,
                })}
                label={t('manageProjects:costPerTree')}
                variant="outlined"
                name="costPerTree"
                onChange={changeBasicDetails}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9,.]/g, '');
                }}
                InputProps={{
                  startAdornment: (
                    <p
                      className={styles.inputStartAdornment}
                      style={{ paddingRight: '4px' }}
                    >{`€`}</p>
                  ),
                }}
              />
              {errors.costPerTree && (
                <span className={styles.formErrors}>
                  {errors.costPerTree.message
                    ? errors.costPerTree.message
                    : 'Cost per tree should be more than €0 and lesser than €3.4'}
                </span>
              )}
            </div>
          ) : null}

        </div>

        <div className={`${styles.formFieldLarge} ${styles.mapboxContainer}`}>
          <MapGL
            {...viewport}
            ref={mapRef}
            mapStyle="mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7"
            mapboxApiAccessToken={process.env.MAPBOXGL_ACCESS_TOKEN}
            onViewportChange={_onViewportChange}
            onClick={(event) => {
              console.log(event);
              if ((event.type = 'click')) {
                setProjectCoords(event.lngLat);
              }
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

          </MapGL>
          <div
            className={styles.formField}
            style={{ margin: 'auto', marginTop: '-120px' }}
          >
            <div className={styles.formFieldHalf}>
              <MaterialTextField
                inputRef={register({ required: true })}
                label="Latitude"
                variant="outlined"
                name="latitude"
                onChange={changeLat}
                className={styles.latitudeInput}
                value={projectCoords !== null ? projectCoords[1] : null}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9.-]/g, '');
                }}
              />
            </div>
            <div className={styles.formFieldHalf}>
              <MaterialTextField
                inputRef={register({ required: true })}
                label="Longitude"
                variant="outlined"
                name="longitude"
                onChange={changeLon}
                className={styles.longitudeInput}
                value={projectCoords !== null ? projectCoords[0] : null}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9.-]/g, '');
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.formFieldLarge}>
          <div className={styles.formFieldRadio}>
            <label htmlFor="reviewerExpense">
              I will provide lodging, site access and local transport if a
              reviewer is sent by Plant-for-the-Planet.
            </label>
            <ToggleSwitch
              id="reviewerExpense"
              checked={reviewerExpense}
              onChange={() => setReviewerExpense(!reviewerExpense)}
              name="reviewerExpense"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>
        </div>

        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <div className={`${styles.formFieldRadio}`}>
              <label htmlFor={'publishProject'}>Publish Project (if projectstatus=Approved)</label>
              <ToggleSwitch
                checked={publishProject}
                onChange={() => setPublishProject(!publishProject)}
                name="publishProject"
                id="publishProject"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />

            </div>
          </div>
          <div className={styles.formFieldHalf}>
            <div className={`${styles.formFieldRadio}`}>
              <label htmlFor={'projectAnalysis'}>
                Detailed Project Analysis if projectstatus=Approved
                Activate once all relevant data is submitted via Tree Mapper.
                    </label>
              <ToggleSwitch
                checked={projectAnalysis}
                onChange={() => setProjectAnalysis(!projectAnalysis)}
                name="projectAnalysis"
                id="projectAnalysis"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />

            </div>
          </div>
        </div>


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

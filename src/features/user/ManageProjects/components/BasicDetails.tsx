import React, { ReactElement } from 'react';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm } from 'react-hook-form';
import i18next from './../../../../../i18n';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import styles from './../styles/StepForm.module.scss';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import MapGL, { Marker } from 'react-map-gl';
import { Editor, DrawPointMode } from 'react-map-gl-draw';
const { useTranslation } = i18next;

interface Props {
  handleNext: Function;
}

export default function BasicDetails({ handleNext }: Props): ReactElement {
  const { t, i18n } = useTranslation(['manageProjects']);
  const defaultMapCenter = [36.96, -28.5];
  const defaultZoom = 1.4;
  const [receiveDonations, setReceiveDonations] = React.useState(true);
  const [projectAnalysis, setProjectAnalysis] = React.useState(true);
  const [reviewerExpense, setReviewerExpense] = React.useState(true);
  const [publishProject, setPublishProject] = React.useState(true);
  const mode = React.useState(new DrawPointMode());
  const mapRef = React.useRef(null);

  const [viewport, setViewPort] = React.useState({
    width: 700,
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const defaultBasicDetails = {
    projectName: '',
    projectURL: '',
    projectType: '',
    treeTarget: 0,
    website: '',
    aboutProject: '',
    costPerTree: 0,
  };

  const [basicDetails, setBasicDetails] = React.useState(defaultBasicDetails);

  const changeBasicDetails = (e: any) => {
    setBasicDetails({ ...basicDetails, [e.target.name]: e.target.value });
  };

  const { register, handleSubmit, errors } = useForm({ mode: 'onChange' });
  const _onViewportChange = (view: any) => setViewPort({ ...view });
  const onSubmit = (data: any) => {
    handleNext();
  };

  return (
    <div className={styles.stepContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formFieldLarge}>
          <MaterialTextField
            inputRef={register({ required: true })}
            label={t('manageProjects:projectName')}
            variant="outlined"
            name="projectName"
            onChange={changeBasicDetails}
          />
        </div>

        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('manageProjects:projectURL')}
              variant="outlined"
              name="projectURL"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
          <div style={{ width: '20px' }}></div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('manageProjects:projectType')}
              variant="outlined"
              name="projectType"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
        </div>

        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('manageProjects:treeTarget')}
              variant="outlined"
              name="treeTarget"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('manageProjects:website')}
              variant="outlined"
              name="website"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
        </div>

        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('manageProjects:projectURL')}
              variant="outlined"
              name="projectURL"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('manageProjects:projectType')}
              variant="outlined"
              name="projectType"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
        </div>

        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('manageProjects:treeTarget')}
              variant="outlined"
              name="treeTarget"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('manageProjects:website')}
              variant="outlined"
              name="website"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
        </div>

        <div className={styles.formFieldLarge}>
          <MaterialTextField
            inputRef={register({ required: true })}
            label={t('manageProjects:aboutProject')}
            variant="outlined"
            name="aboutProject"
            onChange={changeBasicDetails}
          // defaultValue={}
          />
        </div>

        <div className={styles.formField}>
          <div className={`${styles.formFieldHalf}`}>
            <div className={`${styles.formFieldRadio}`}>
              <label>Receive Donations</label>
              <ToggleSwitch
                checked={receiveDonations}
                onChange={() => setReceiveDonations(!receiveDonations)}
                name="receiveDonations"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label={t('manageProjects:costPerTree')}
              variant="outlined"
              name="costPerTree"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
        </div>

        <div className={styles.formFieldLarge}>
          <MapGL
            {...viewport}
            ref={mapRef}
            mapStyle="mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7"
            mapboxApiAccessToken={process.env.MAPBOXGL_ACCESS_TOKEN}
            onViewportChange={_onViewportChange}
          >
            <Editor
              clickRadius={12}
              mode={new DrawPointMode()}
              onUpdate={(data: any) => {
                console.log(data);
              }}
            />
          </MapGL>
        </div>
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label="latitude"
              variant="outlined"
              name="projectURL"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({ required: true })}
              label="longitude"
              variant="outlined"
              name="projectType"
              onChange={changeBasicDetails}
            // defaultValue={}
            />
          </div>
        </div>

        <div className={styles.formFieldLarge}>
          <div className={styles.formFieldRadio}>
            <label>
              I will provide lodging, site access and local transport if a
              reviewer is sent by Plant-for-the-Planet.
            </label>
            <ToggleSwitch
              checked={reviewerExpense}
              onChange={() => setReviewerExpense(!reviewerExpense)}
              name="reviewerExpense"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>
        </div>

        {/* <div className={styles.formField}>
                    <ToggleSwitch
                        checked={publishProject}
                        onChange={() => setPublishProject(!publishProject)}
                        name="publishProject"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    <p>Publish Project (if projectstatus=Approved)</p>
                </div>

                <div className={styles.formField}>
                    <ToggleSwitch
                        checked={projectAnalysis}
                        onChange={() => setProjectAnalysis(!projectAnalysis)}
                        name="projectAnalysis"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    <p>
                        Detailed Project Analysis if projectstatus=Approved
                        Activate once all relevant data is submitted via Tree Mapper.
                    </p>
                </div> */}

        <div className={styles.formField}>
          <div className={`${styles.formFieldHalf}`}>
            <input type='submit' className={styles.secondaryButton} value="Continue to Media" ></input>
          </div>

          <div className={`${styles.formFieldHalf}`}>
            <input type='submit' className={styles.continueButton} value="Save & see Project" ></input>
          </div>
        </div>
      </form>
    </div>
  );
}

import React, { ReactElement } from 'react';
import styles from './../styles/StepForm.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { Controller, useForm } from 'react-hook-form';
import i18next from './../../../../../i18n';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import dynamic from 'next/dynamic';
import StaticMap, { Source, Layer, WebMercatorViewport } from 'react-map-gl';
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import { MenuItem } from '@material-ui/core';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import {
  deleteAuthenticatedRequest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';

const { useTranslation } = i18next;
const MAPBOX_TOKEN = process.env.MAPBOXGL_ACCESS_TOKEN;

const MapStatic = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN,
  interactive: false,
});

interface Props {
  handleNext: Function;
  handleBack: Function;
  projectGUID: String;
  handleReset: Function;
  session: any;
}

const Map = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p></p>,
});

export default function ProjectSites({
  handleBack,
  session,
  handleNext,
  projectGUID,
  handleReset,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['manageProjects']);
  const [features, setFeatures] = React.useState([]);
  const { register, handleSubmit, errors, control } = useForm();
  const drawControlRef = React.useRef(null);
  const [isUploadingData, setIsUploadingData] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState('');

  const defaultSiteDetails = {
    name: '',
    status: '',
    geometry: {},
  };

  // Assigning defaultSiteDetails as default
  const [siteDetails, setSiteDetails] = React.useState(defaultSiteDetails);
  const [siteList, setSiteList] = React.useState<
    Array<{
      id: String;
      name: String;
      status: String;
      geometry: Object;
    }>
  >([]);

  const changeSiteDetails = (e: any) => {
    setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
  };

  const [geoJson, setGeoJson] = React.useState(null);
  const defaultMapCenter = [36.96, -28.5];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    height: 320,
    width: 200,
    center: defaultMapCenter,
    zoom: [defaultZoom],
  });

  const [showForm, setShowForm] = React.useState(true);

  const MapProps = {
    geoJson,
    setGeoJson,
    drawControlRef,
  };

  const onSubmit = (data: any) => {
    handleNext();
  };

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset(t('manageProjects:resetMessage'));
    }
  });

  const uploadProjectSite = (data: any) => {
    if (drawControlRef.current) {
      setIsUploadingData(true);
      let submitData;
      submitData = {
        name: siteDetails.name,
        geometry: geoJson ? geoJson : drawControlRef.current.draw.getAll(),
        status: data.status,
      };
      postAuthenticatedRequest(
        `/app/projects/${projectGUID}/sites`,
        submitData,
        session
      ).then((res) => {
        if (!res.code) {
          let temp = siteList;
          let submitData = {
            id: res.id,
            name: res.name,
            geometry: res.geometry,
            status: res.status,
          };
          temp.push(submitData);
          setSiteList(temp);
          setGeoJson(null);
          setFeatures([]);
          setIsUploadingData(false);
          setShowForm(false);
          setErrorMessage('');
        } else {
          if (res.code === 404) {
            setIsUploadingData(false);
            setErrorMessage(t('manageProjects:projectNotFound'));
          } else {
            setIsUploadingData(false);
            setErrorMessage(res.message);
          }
        }
      });
    }
  };

  const uploadProjectSiteNext = (data: any) => {
    uploadProjectSite(data);
    handleNext();
  };

  const deleteProjectSite = (id: any) => {
    setIsUploadingData(true);
    deleteAuthenticatedRequest(
      `/app/projects/${projectGUID}/sites/${id}`,
      session
    ).then((res) => {
      if (res !== 404) {
        let siteListTemp = siteList.filter((item) => item.id !== id);
        setSiteList(siteListTemp);
        setIsUploadingData(false);
      }
    });
  };

  const status = [
    { label: t('manageProjects:Planting'), value: 'planting' },
    { label: t('manageProjects:Planted'), value: 'planted' },
    { label: t('manageProjects:Barren'), value: 'barren' },
    { label: t('manageProjects:Reforestation'), value: 'reforestation' },
  ];

  React.useEffect(() => {
    // Fetch sites of the project
    if (projectGUID && session?.accessToken)
      getAuthenticatedRequest(
        `/app/profile/projects/${projectGUID}?_scope=sites`,
        session
      ).then((result) => {
        if (result.sites.length > 0) {
          setShowForm(false);
        }
        setSiteList(result.sites);
      });
  }, [projectGUID]);

  return (
    <div className={styles.stepContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formField}>
          {siteList
            .filter((site) => {
              return site.geometry !== null;
            })
            .map((site) => {
              const bbox = turf.bbox(site.geometry);
              const { longitude, latitude, zoom } = new WebMercatorViewport(
                viewport
              ).fitBounds(
                [
                  [bbox[0], bbox[1]],
                  [bbox[2], bbox[3]],
                ],
                {
                  padding: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50,
                  },
                }
              );

              return (
                <div key={site.id} className={`${styles.formFieldHalf}`}>
                  <div className={styles.mapboxContainer}>
                    <div className={styles.uploadedMapName}>{site.name}</div>
                    <div className={styles.uploadedMapStatus}>
                      {String(site.status).toUpperCase()}
                    </div>
                    <div
                      onClick={() => {
                        deleteProjectSite(site.id);
                      }}
                      className={styles.uploadedMapDeleteButton}
                    >
                      <TrashIcon color={'#000'} />
                    </div>
                    <MapStatic
                      {...viewport}
                      center={[longitude, latitude]}
                      zoom={[zoom]}
                      style="mapbox://styles/mapbox/satellite-v9" // eslint-disable-line
                      containerStyle={{
                        height: 200,
                        width: 320,
                      }}
                    >
                      <GeoJSONLayer
                        data={site.geometry}
                        fillPaint={{
                          'fill-color': '#fff',
                          'fill-opacity': 0.2,
                        }}
                        linePaint={{
                          'line-color': '#89b54a',
                          'line-width': 2,
                        }}
                      />
                    </MapStatic>
                  </div>
                </div>
              );
            })}
        </div>
        {showForm ? (
          <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
            <div className={styles.formField}>
              <div className={styles.formFieldHalf}>
                <MaterialTextField
                  inputRef={register({ required: true })}
                  label={t('manageProjects:name')}
                  variant="outlined"
                  name="name"
                  onChange={changeSiteDetails}
                  defaultValue={siteDetails.name}
                />
              </div>
              <div className={styles.formFieldHalf}>
                <Controller
                  as={
                    <MaterialTextField
                      label={t('manageProjects:projectStatus')}
                      variant="outlined"
                      name="status"
                      onChange={changeSiteDetails}
                      select
                      value={siteDetails.status}
                    >
                      {status.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </MaterialTextField>
                  }
                  name="status"
                  rules={{ required: t('manageProjects:selectProjectStatus') }}
                  control={control}
                  defaultValue={siteDetails.status ? siteDetails.status : ''}
                />
                {errors.status && (
                  <span className={styles.formErrors}>
                    {errors.status.message}
                  </span>
                )}
              </div>
            </div>

            <Map {...MapProps} />

            <div
              onClick={handleSubmit(uploadProjectSite)}
              className={styles.formFieldLarge}
            >
              <p className={styles.inlineLinkButton}>
                {t('manageProjects:saveAndAddSite')}
              </p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setShowForm(true)}
            className={styles.formFieldLarge}
          >
            <p className={styles.inlineLinkButton}>
              {t('manageProjects:addSite')}
            </p>
          </div>
        )}

        {errorMessage && errorMessage !== '' ? (
          <div className={styles.formFieldLarge}>
            <h4 className={styles.errorMessage}>{errorMessage}</h4>
          </div>
        ) : null}

        <div className={styles.formField}>
          <div className={`${styles.formFieldHalf}`}>
            <AnimatedButton
              onClick={handleBack}
              className={styles.secondaryButton}
            >
              <BackArrow />
              <p>{t('manageProjects:backToAnalysis')}</p>
            </AnimatedButton>
          </div>
          <div style={{ width: '20px' }}></div>
          <div className={`${styles.formFieldHalf}`}>
            <AnimatedButton
              onClick={handleSubmit(uploadProjectSiteNext)}
              className={styles.continueButton}
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                t('manageProjects:saveAndContinue')
              )}
            </AnimatedButton>
          </div>
        </div>
      </form>
    </div>
  );
}

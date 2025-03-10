import type { ChangeEvent, ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type {
  SiteDetails,
  ProjectSitesProps,
  GeoLocation,
  EditSiteProps,
  Site,
  SitesScopeProjects,
} from '../../../common/types/project';
import type { FeatureCollection as GeoJson } from 'geojson';

import React from 'react';
import styles from './../StepForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import dynamic from 'next/dynamic';
import { WebMercatorViewport } from 'react-map-gl';
import ReactMapboxGl, { GeoJSONLayer, Source, Layer } from 'react-mapbox-gl';
import * as turf from '@turf/turf';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import {
  deleteAuthenticatedRequest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import EditIcon from '../../../../../public/assets/images/icons/manageProjects/Pencil';
import {
  Fade,
  Modal,
  MenuItem,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import { ThemeContext } from '../../../../theme/themeContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ProjectCreationTabs } from '..';
import { useTenant } from '../../../common/Layout/TenantContext';

const MapStatic = ReactMapboxGl({
  interactive: false,
  accessToken: '',
});

const Map = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p></p>,
});

function EditSite({
  openModal,
  handleModalClose,
  changeSiteDetails,
  siteDetails,
  status,
  geoJsonProp,
  projectGUID,
  setSiteList,
  token,
  seteditMode,
  siteGUID,
  siteList,
}: EditSiteProps) {
  const { theme } = React.useContext(ThemeContext);
  const { tenantConfig } = useTenant();
  const t = useTranslations('ManageProjects');
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectSitesFormData>();
  const [geoJson, setGeoJson] = React.useState<GeoJson | null>(geoJsonProp);
  const [geoJsonError, setGeoJsonError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isUploadingData, setIsUploadingData] = React.useState<boolean>(false);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();

  const MapProps = {
    geoJson,
    setGeoJson,
    geoJsonError,
    setGeoJsonError,
    geoLocation: {
      geoLatitude: 36.96,
      geoLongitude: -28.5,
    },
  };

  const editProjectSite = async (data: ProjectSitesFormData) => {
    if (geoJson && geoJson.features && geoJson.features.length !== 0) {
      setIsUploadingData(true);
      const submitData = {
        name: siteDetails.name,
        geometry: geoJson,
        status: data.status,
      };

      try {
        const res = await putAuthenticatedRequest<Site>({
          tenant: tenantConfig?.id,
          url: `/app/projects/${projectGUID}/sites/${siteGUID}`,
          data: submitData,
          token,
          logoutUser,
        });
        const temp = siteList;
        let siteIndex = 0;
        temp.find((site: Site, index: number) => {
          if (site.id === res.id) {
            siteIndex = index;
            return true;
          }
        });
        if (siteIndex !== null) {
          temp[siteIndex] = res;
        }
        setSiteList(temp);
        setGeoJson(null);
        setIsUploadingData(false);
        seteditMode(false);
        setErrorMessage('');
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    } else {
      setErrorMessage(t('polygonRequired'));
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={'modalContainer' + ' ' + theme}
      open={openModal}
      onClose={handleModalClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <form
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
            <div className={styles.formField}>
              <div className={styles.formFieldHalf}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: t('siteNameValidation') }}
                  defaultValue={siteDetails.name}
                  render={({ field: { onChange, value, onBlur, name } }) => (
                    <TextField
                      label={t('siteName')}
                      variant="outlined"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        changeSiteDetails(e);
                        onChange(e.target.value);
                      }}
                      value={value}
                      onBlur={onBlur}
                      name={name}
                      error={errors.name !== undefined}
                      helperText={
                        errors.name !== undefined && errors.name.message
                      }
                    />
                  )}
                />
              </div>
              <div className={styles.formFieldHalf}>
                <Controller
                  name="status"
                  rules={{ required: t('selectProjectStatus') }}
                  control={control}
                  defaultValue={siteDetails.status ? siteDetails.status : ''}
                  render={({ field: { onChange, onBlur, name, value } }) => (
                    <TextField
                      label={t('siteStatus')}
                      variant="outlined"
                      name={name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        changeSiteDetails(e);
                        onChange(e.target.value);
                      }}
                      onBlur={onBlur}
                      select
                      value={value}
                      error={errors.status !== undefined}
                      helperText={
                        errors.status !== undefined && errors.status.message
                      }
                    >
                      {status.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </div>
            </div>

            <Map {...MapProps} />
          </div>

          {errorMessage && errorMessage !== '' ? (
            <div className={styles.formFieldLarge}>
              <h4 className={styles.errorMessage}>{errorMessage}</h4>
            </div>
          ) : null}

          <div className={styles.buttonsForProjectCreationForm}>
            <Button
              onClick={() => handleModalClose()}
              className={styles.backButton}
            >
              <BackArrow />
              <p>{t('backToSites')}</p>
            </Button>

            <Button
              onClick={handleSubmit(editProjectSite)}
              className={styles.saveAndContinueButton}
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                t('saveSite')
              )}
            </Button>
          </div>
        </form>
      </Fade>
    </Modal>
  );
}

interface ProjectSitesFormData {
  name: string;
  status: string;
}

export default function ProjectSites({
  handleBack,
  token,
  handleNext,
  projectGUID,
  projectDetails,
}: ProjectSitesProps): ReactElement {
  const t = useTranslations('ManageProjects');
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectSitesFormData>();
  const [isUploadingData, setIsUploadingData] = React.useState<boolean>(false);
  const [geoJsonError, setGeoJsonError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [showForm, setShowForm] = React.useState<boolean>(true);
  const [editMode, seteditMode] = React.useState<boolean>(false);
  const [geoLocation, setgeoLocation] = React.useState<GeoLocation | undefined>(
    undefined
  );
  const [geoJson, setGeoJson] = React.useState<GeoJson | null>(null);
  const defaultMapCenter = [36.96, -28.5];
  const defaultZoom = 1.4;
  const viewport = {
    height: 320,
    width: 200,
    center: defaultMapCenter,
    zoom: defaultZoom,
  };
  const style = {
    version: 8,
    sources: {},
    layers: [],
  };
  const defaultSiteDetails = {
    name: '',
    status: '',
    geometry: {},
  };
  const { tenantConfig } = useTenant();
  const [siteDetails, setSiteDetails] =
    React.useState<SiteDetails>(defaultSiteDetails);
  const [siteList, setSiteList] = React.useState<Site[]>([]);
  const [siteGUID, setSiteGUID] = React.useState<string | null>(null);
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();

  // Assigning defaultSiteDetails as default

  const changeSiteDetails = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
  };

  const RASTER_SOURCE_OPTIONS = {
    type: 'raster',
    tiles: [
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    tileSize: 128,
  };

  const handleModalClose = () => {
    seteditMode(false);
    setOpenModal(false);
  };

  const MapProps = {
    geoJson,
    setGeoJson,
    geoJsonError,
    setGeoJsonError,
    geoLocation,
  };

  const fetchProjSites = async () => {
    try {
      if (projectGUID) {
        // Fetch sites of the project
        const result = await getAuthenticatedRequest<SitesScopeProjects>({
          tenant: tenantConfig?.id,
          url: `/app/profile/projects/${projectGUID}?_scope=sites`,
          token,
          logoutUser,
        });
        const geoLocation = {
          geoLatitude: result.geoLatitude,
          geoLongitude: result.geoLongitude,
        };
        setgeoLocation(geoLocation);

        if (result?.sites.length > 0) {
          setShowForm(false);
        }
        setSiteList(result.sites);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/profile');
    }
  };
  React.useEffect(() => {
    fetchProjSites();
  }, [projectGUID]);

  const uploadProjectSite = async (data: ProjectSitesFormData) => {
    if (geoJson && geoJson.features.length !== 0) {
      if (!data.name) return;

      setIsUploadingData(true);
      const submitData = {
        name: siteDetails.name,
        geometry: geoJson,
        status: data.status,
      };

      try {
        const res = await postAuthenticatedRequest<Site>({
          tenant: tenantConfig?.id,
          url: `/app/projects/${projectGUID}/sites`,
          data: submitData,
          token,
          logoutUser,
        });
        const temp = siteList ? siteList : [];
        const _submitData = {
          id: res.id,
          name: res.name,
          geometry: res.geometry,
          status: res.status,
        };
        temp.push(_submitData);
        setSiteList(temp);
        setGeoJson(null);
        setIsUploadingData(false);
        setShowForm(false);
        setErrorMessage('');
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    } else {
      setErrorMessage(t('polygonRequired'));
    }
  };

  const uploadProjectSiteNext = (data: ProjectSitesFormData) => {
    uploadProjectSite(data);
    handleNext(ProjectCreationTabs.PROJECT_SPENDING);
  };

  const deleteProjectSite = async (id: string) => {
    try {
      setIsUploadingData(true);
      await deleteAuthenticatedRequest({
        tenant: tenantConfig?.id,
        url: `/app/projects/${projectGUID}/sites/${id}`,
        token,
        logoutUser,
      });
      const siteListTemp = siteList.filter((item) => item.id !== id);
      setSiteList(siteListTemp);
      setIsUploadingData(false);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const status = [
    {
      label:
        projectDetails?.purpose === 'trees'
          ? t('siteStatusPlanting')
          : t('siteStatusNotYetProtected'),
      value:
        projectDetails?.purpose === 'trees' ? 'planting' : 'not yet protected',
    },
    {
      label:
        projectDetails?.purpose === 'trees'
          ? t('siteStatusPlanted')
          : t('siteStatusPartiallyProtected'),
      value:
        projectDetails?.purpose === 'trees' ? 'planted' : 'partially protected',
    },
    {
      label:
        projectDetails?.purpose === 'trees'
          ? t('siteStatusBarren')
          : t('siteStatusFullyProtected'),
      value: projectDetails?.purpose === 'trees' ? 'barren' : 'fully protected',
    },
    {
      label:
        projectDetails?.purpose === 'trees' ? t('siteStatusReforestation') : '',
      value: projectDetails?.purpose === 'trees' ? 'reforestation' : '',
    },
  ];

  const editSite = (site: Site) => {
    const defaultSiteDetails = {
      name: site.name,
      status: site.status,
      geometry: {},
    };

    const collection: GeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          geometry: site.geometry,
          properties: {},
          type: 'Feature',
        },
      ],
    };

    setGeoJson(collection);
    setSiteDetails(defaultSiteDetails);
    setSiteGUID(site.id);
    seteditMode(true);
    setOpenModal(true);
  };

  const EditProps = {
    openModal,
    handleModalClose,
    changeSiteDetails,
    siteDetails,
    errorMessage,
    status,
    geoJsonProp: geoJson,
    projectGUID,
    setSiteList,
    token,
    seteditMode,
    siteGUID,
    siteList,
  };

  return (
    <CenteredContainer>
      {editMode && <EditSite {...EditProps} />}

      <StyledForm>
        <InlineFormDisplayGroup>
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
                <div key={site.id}>
                  <div className={styles.mapboxContainer}>
                    <div className={styles.uploadedMapName}>{site.name}</div>
                    <div className={styles.uploadedMapStatus}>
                      {status
                        .find((e) => site.status == e.value)
                        ?.label.toUpperCase()}
                    </div>
                    <IconButton
                      id={'trashIconProjS'}
                      onClick={() => {
                        deleteProjectSite(site.id);
                      }}
                      size="small"
                      className={styles.uploadedMapDeleteButton}
                    >
                      <TrashIcon />
                    </IconButton>
                    <IconButton
                      id={'edit'}
                      onClick={() => {
                        editSite(site);
                      }}
                      className={styles.uploadedMapEditButton}
                    >
                      <EditIcon color={'#000'} />
                    </IconButton>
                    <MapStatic
                      {...viewport}
                      center={[longitude, latitude]}
                      zoom={[zoom]}
                      style={style} // eslint-disable-line
                      containerStyle={{
                        height: 200,
                        width: 320,
                      }}
                    >
                      <Source
                        id="satellite_source"
                        tileJsonSource={RASTER_SOURCE_OPTIONS}
                      />
                      <Layer
                        type="raster"
                        id="satellite_layer"
                        sourceId="satellite_source"
                      />
                      <GeoJSONLayer
                        data={site.geometry}
                        fillPaint={{
                          'fill-color': '#fff',
                          'fill-opacity': 0.2,
                        }}
                        linePaint={{
                          'line-color': '#68B030',
                          'line-width': 2,
                        }}
                      />
                    </MapStatic>
                  </div>
                </div>
              );
            })}
        </InlineFormDisplayGroup>

        {showForm ? (
          <div
            className={`${isUploadingData ? styles.shallowOpacity : ''}`}
            style={{ width: 'inherit' }}
          >
            <InlineFormDisplayGroup>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('siteNameValidation') }}
                defaultValue={siteDetails.name}
                render={({ field: { onChange, value, onBlur, name } }) => (
                  <TextField
                    label={t('siteName')}
                    variant="outlined"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      changeSiteDetails(e);
                      onChange(e.target.value);
                    }}
                    value={value}
                    onBlur={onBlur}
                    name={name}
                    error={errors.name !== undefined}
                    helperText={
                      errors.name !== undefined && errors.name.message
                    }
                  />
                )}
              />
              <Controller
                name="status"
                rules={{
                  required: t('selectProjectStatus'),
                }}
                control={control}
                defaultValue={siteDetails.status ? siteDetails.status : ''}
                render={({ field: { onChange, onBlur, name, value } }) => (
                  <TextField
                    label={t('siteStatus')}
                    variant="outlined"
                    name={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      changeSiteDetails(e);
                      onChange(e.target.value);
                    }}
                    onBlur={onBlur}
                    select
                    value={value}
                    error={errors.status !== undefined}
                    helperText={
                      errors.status !== undefined && errors.status.message
                    }
                  >
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </InlineFormDisplayGroup>

            {geoLocation && <Map {...MapProps} />}

            <Button
              id="projSiteSaveandAdd"
              onClick={handleSubmit(uploadProjectSite)}
              className={styles.projSiteSaveandAdd}
            >
              <p className={styles.inlineLinkButton}>{t('saveAndAddSite')}</p>
            </Button>
          </div>
        ) : (
          <Button
            id={'manageProjAddSite'}
            onClick={() => {
              setShowForm(true);
              setGeoJson(null);
              setSiteDetails(defaultSiteDetails);
              setSiteGUID(null);
              seteditMode(false);
              setOpenModal(false);
            }}
            className={styles.formFieldLarge}
          >
            <p className={styles.inlineLinkButton}>{t('addSite')}</p>
          </Button>
        )}

        {errorMessage && errorMessage !== '' ? (
          <div className={styles.formFieldLarge}>
            <h4 className={styles.errorMessage}>{errorMessage}</h4>
          </div>
        ) : null}

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.DETAILED_ANALYSIS)}
            variant="outlined"
            className="formButton"
            startIcon={<BackArrow />}
          >
            {t('backToAnalysis')}
          </Button>

          <Button
            onClick={handleSubmit(uploadProjectSiteNext)}
            variant="contained"
            className="formButton"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('saveAndContinue')
            )}
          </Button>

          <Button
            onClick={() => handleNext(ProjectCreationTabs.PROJECT_SPENDING)}
            variant="contained"
            className="formButton"
          >
            {t('skip')}
          </Button>
        </div>
      </StyledForm>
    </CenteredContainer>
  );
}

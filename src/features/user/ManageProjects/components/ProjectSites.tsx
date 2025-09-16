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
import type { SitesGeoJSON } from '../../../common/types/ProjectPropsContextInterface';

import { useEffect, useState, useContext, useMemo } from 'react';
import styles from './../StepForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import dynamic from 'next/dynamic';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
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
import { ProjectCreationTabs } from '..';
import { useApi } from '../../../../hooks/useApi';
import SiteDeleteConfirmationModal from './microComponent/SiteDeleteConfirmationModal';
import StaticMap from './microComponent/StaticMap';
import themeProperties from '../../../../theme/themeProperties';

const defaultSiteDetails = {
  name: '',
  status: '',
  geometry: {},
};
const SiteFormationMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p></p>,
});

type ProjectSitesFormData = {
  name: string;
  status: string;
};

type SiteApiPayload = {
  name: string;
  geometry: SitesGeoJSON;
  status: string;
};

function EditSite({
  openModal,
  handleModalClose,
  changeSiteDetails,
  siteDetails,
  status,
  geoJsonProp,
  projectGUID,
  setSiteList,
  setEditMode,
  siteGUID,
  siteList,
  tiles,
}: EditSiteProps) {
  const { theme } = useContext(ThemeContext);
  const { putApiAuthenticated } = useApi();
  const t = useTranslations('ManageProjects');
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectSitesFormData>();
  const [geoJson, setGeoJson] = useState<GeoJson | null>(geoJsonProp);
  const [geoJsonError, setGeoJsonError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingData, setIsUploadingData] = useState<boolean>(false);
  const { setErrors } = useContext(ErrorHandlingContext);

  const MapProps = {
    geoJson,
    setGeoJson,
    geoJsonError,
    setGeoJsonError,
    geoLocation: {
      geoLatitude: 36.96,
      geoLongitude: -28.5,
    },
    tiles,
  };

  const editProjectSite = async (data: ProjectSitesFormData) => {
    if (geoJson && geoJson.features && geoJson.features.length !== 0) {
      setIsUploadingData(true);
      const updatedSitePayload: SiteApiPayload = {
        name: siteDetails.name,
        geometry: geoJson,
        status: data.status,
      };

      try {
        const res = await putApiAuthenticated<Site, SiteApiPayload>(
          `/app/projects/${projectGUID}/sites/${siteGUID}`,
          {
            payload: updatedSitePayload,
          }
        );
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
        setEditMode(false);
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
        <form className={styles.editSiteForm}>
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

            <SiteFormationMap {...MapProps} />
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

export default function ProjectSites({
  handleBack,
  handleNext,
  projectGUID,
  projectDetails,
}: ProjectSitesProps): ReactElement {
  const { deleteApiAuthenticated, postApiAuthenticated, getApiAuthenticated } =
    useApi();
  const { colors } = themeProperties.designSystem;
  const t = useTranslations('ManageProjects');
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectSitesFormData>();
  const { redirect, setErrors } = useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = useState<boolean>(false);
  const [geoJsonError, setGeoJsonError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [geoLocation, setGeoLocation] = useState<GeoLocation | undefined>(
    undefined
  );
  const [geoJson, setGeoJson] = useState<SitesGeoJSON | null>(null);
  const [siteDetails, setSiteDetails] =
    useState<SiteDetails>(defaultSiteDetails);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [siteGUID, setSiteGUID] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');

  // Assigning defaultSiteDetails as default
  const changeSiteDetails = (e: ChangeEvent<HTMLInputElement>): void => {
    setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
  };

  const tiles = useMemo(
    () => [
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    []
  );

  const handleModalClose = () => {
    setEditMode(false);
    setOpenModal(false);
  };

  const MapProps = {
    geoJson,
    setGeoJson,
    geoJsonError,
    setGeoJsonError,
  };

  const fetchProjSites = async () => {
    try {
      if (projectGUID) {
        // Fetch sites of the project
        const result = await getApiAuthenticated<SitesScopeProjects>(
          `/app/profile/projects/${projectGUID}`,
          {
            queryParams: { _scope: 'sites' },
          }
        );
        const geoLocation = {
          geoLatitude: result.geoLatitude,
          geoLongitude: result.geoLongitude,
        };
        setGeoLocation(geoLocation);

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
  useEffect(() => {
    fetchProjSites();
  }, [projectGUID]);

  const uploadProjectSite = async (data: ProjectSitesFormData) => {
    if (geoJson && geoJson.features.length !== 0) {
      if (!data.name) return;

      setIsUploadingData(true);
      const newSitePayload: SiteApiPayload = {
        name: siteDetails.name,
        geometry: geoJson,
        status: data.status,
      };

      try {
        const res = await postApiAuthenticated<Site, SiteApiPayload>(
          `/app/projects/${projectGUID}/sites`,
          {
            payload: newSitePayload,
          }
        );
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
      await deleteApiAuthenticated(`/app/projects/${projectGUID}/sites/${id}`);
      const siteListTemp = siteList.filter((item) => item.id !== id);
      setSiteList(siteListTemp);
    } catch (err) {
      setErrors(handleError(err as APIError));
    } finally {
      setIsUploadingData(false);
      setIsModalOpen(false);
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

    const collection: SitesGeoJSON = {
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
    setEditMode(true);
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
    setEditMode,
    siteGUID,
    siteList,
    tiles,
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
                        setSelectedSiteId(site.id);
                        setIsModalOpen(true);
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
                      <EditIcon color={colors.coreText} />
                    </IconButton>
                    <StaticMap
                      siteId={site.id}
                      siteGeometry={site.geometry}
                      tiles={tiles}
                    />
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

            {geoLocation && <SiteFormationMap {...MapProps} />}

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
              setEditMode(false);
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
        <SiteDeleteConfirmationModal
          siteId={selectedSiteId}
          deleteProjectSite={deleteProjectSite}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isUploadingData={isUploadingData}
        />
      </StyledForm>
    </CenteredContainer>
  );
}

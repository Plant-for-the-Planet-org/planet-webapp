import type { ChangeEvent, ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type {
  SiteDetails,
  ProjectSitesProps,
  GeoLocation,
  Site,
  SitesScopeProjects,
} from '../../../common/types/project';
import type { ProjectSiteFeatureCollection } from '../../../common/types/map';

import { useEffect, useState, useContext, useCallback } from 'react';
import styles from './../StepForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import dynamic from 'next/dynamic';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import EditIcon from '../../../../../public/assets/images/icons/manageProjects/Pencil';
import { MenuItem, Button, TextField } from '@mui/material';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError } from '@planet-sdk/common';
import { ProjectCreationTabs } from '..';
import { useApi } from '../../../../hooks/useApi';
import SitePreviewMap from './microComponent/SitePreviewMap';
import themeProperties from '../../../../theme/themeProperties';
import CustomModal from '../../../common/Layout/CustomModal';
import EditSite from './microComponent/EditSite';
import SitesSyncActions from './microComponent/SitesSyncActions';

const defaultSiteDetails = {
  name: '',
  status: '',
  geometry: {},
};
const SiteGeometryEditor = dynamic(() => import('./SiteGeometryEditor'), {
  ssr: false,
  loading: () => <p></p>,
});

export type ProjectSitesFormData = {
  name: string;
  status: string;
};

export type SiteApiPayload = {
  name: string;
  geometry: ProjectSiteFeatureCollection;
  status: string;
};

export interface SiteInfo {
  siteId: string | null;
  siteName: string | null;
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
    reset,
  } = useForm<ProjectSitesFormData>();
  const { redirect, setErrors } = useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncedWithRestoreEco, setIsSyncedWithRestoreEco] = useState(false);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [geoLocation, setGeoLocation] = useState<GeoLocation | undefined>(
    undefined
  );
  const [geoJson, setGeoJson] = useState<ProjectSiteFeatureCollection | null>(
    null
  );
  const [siteDetails, setSiteDetails] =
    useState<SiteDetails>(defaultSiteDetails);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [siteGUID, setSiteGUID] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSiteInfo, setSelectedSiteInfo] = useState<SiteInfo>({
    siteId: null,
    siteName: null,
  });

  // Assigning defaultSiteDetails as default
  const changeSiteDetails = (e: ChangeEvent<HTMLInputElement>): void => {
    setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    setEditMode(false);
    setOpenModal(false);
  };

  const MapProps = {
    geoJson,
    setGeoJson,
    setErrorMessage,
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
    const hasGeo = geoJson !== null && geoJson.features.length !== 0;

    if (!hasGeo) {
      setErrorMessage(t('errors.polygon.required'));
      return false;
    }

    setIsUploadingData(true);
    const newSitePayload: SiteApiPayload = {
      name: data.name,
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
      const _submitData = {
        id: res.id,
        name: res.name,
        geometry: res.geometry,
        status: res.status,
      };
      setSiteList((prevSites) => [...prevSites, _submitData]);
      reset({
        name: '',
        status: '',
      });
      setGeoJson(null);
      setShowForm(false);
      setErrorMessage(null);
      return true;
    } catch (err) {
      setErrors(handleError(err as APIError));
      return false;
    } finally {
      setIsUploadingData(false);
    }
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

  const uploadProjectSiteNext = async (data: ProjectSitesFormData) => {
    const success = await uploadProjectSite(data);
    if (success) handleNext(ProjectCreationTabs.PROJECT_SPENDING);
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

    const collection: ProjectSiteFeatureCollection = {
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

  const handleSyncSites = useCallback(async () => {
    // prevent multiple parallel syncs
    if (isSyncing) return;

    const webhookBase = process.env.WEBHOOK_URL;
    if (!webhookBase) {
      console.warn('WEBHOOK_URL is not defined');
      return;
    }
    setIsSyncing(true);

    try {
      const webhookUrl = `${webhookBase}/33878023-ee47-44e1-8a62-34eb2d2b3246/?project=${projectGUID}`;
      const response = await fetch(webhookUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Webhook call failed with status ${response.status}`);
      }

      setIsSyncedWithRestoreEco(true);
      setErrorMessage(null);
    } catch (err) {
      console.error('Sync error:', err);
      setErrorMessage(t('syncSites.error'));
    } finally {
      setIsSyncing(false);
      setIsSyncModalOpen(false);
    }
  }, [isSyncing, projectGUID, t]);

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
                    <div className={styles.siteActions}>
                      <button
                        type="button"
                        aria-label={t('deleteSite')}
                        onClick={() => {
                          setSelectedSiteInfo({
                            siteId: site.id,
                            siteName: site.name,
                          });
                          setIsModalOpen(true);
                        }}
                        className={styles.controlButton}
                      >
                        <TrashIcon />
                      </button>
                      <button
                        type="button"
                        aria-label={t('editSite')}
                        onClick={() => editSite(site)}
                        className={styles.controlButton}
                      >
                        <EditIcon color={colors.coreText} />
                      </button>
                    </div>

                    <SitePreviewMap
                      siteId={site.id}
                      siteGeometry={site.geometry}
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

            {geoLocation && <SiteGeometryEditor {...MapProps} />}

            <Button
              id="projSiteSaveAndAdd"
              onClick={handleSubmit(uploadProjectSite)}
              className={styles.projSiteSaveAndAdd}
            >
              <p className={styles.inlineLinkButton}>{t('saveAndAddSite')}</p>
            </Button>
          </div>
        ) : (
          <div className={styles.syncAndAddSitesButtons}>
            <button
              className={styles.inlineLinkButton}
              type="button"
              onClick={() => {
                setShowForm(true);
                setGeoJson(null);
                setSiteDetails(defaultSiteDetails);
                setSiteGUID(null);
                setEditMode(false);
                setOpenModal(false);
              }}
            >
              {t('addSite')}
            </button>
            <SitesSyncActions
              isSyncModalOpen={isSyncModalOpen}
              setIsSyncModalOpen={setIsSyncModalOpen}
              isSyncedWithRestoreEco={isSyncedWithRestoreEco}
              setIsSyncedWithRestoreEco={setIsSyncedWithRestoreEco}
              handleSyncSites={handleSyncSites}
            />
          </div>
        )}

        {errorMessage !== null && (
          <div className={styles.formFieldLarge}>
            <h4 className={styles.errorMessage}>{errorMessage}</h4>
          </div>
        )}
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
        <CustomModal
          isOpen={isModalOpen}
          handleContinue={() => {
            if (selectedSiteInfo.siteId !== null) {
              deleteProjectSite(selectedSiteInfo.siteId);
            }
          }}
          handleCancel={() => setIsModalOpen(false)}
          modalTitle={t('deleteSite')}
          modalSubtitle={t('siteDeleteConfirmation', {
            siteName: selectedSiteInfo.siteName ?? '',
          })}
          continueButtonText={t('delete')}
          cancelButtonText={t('cancel')}
        />
      </StyledForm>
    </CenteredContainer>
  );
}

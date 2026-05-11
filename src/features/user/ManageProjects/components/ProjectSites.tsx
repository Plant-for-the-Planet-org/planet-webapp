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

import { useEffect, useState, useCallback } from 'react';
import styles from './../StepForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import dynamic from 'next/dynamic';
import { MenuItem, Button, TextField } from '@mui/material';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError } from '@planet-sdk/common';
import { ProjectCreationTabs } from '..';
import { useApi } from '../../../../hooks/useApi';
import themeProperties from '../../../../theme/themeProperties';
import CustomModal from '../../../common/Layout/CustomModal';
import EditSite from './microComponent/EditSite';
import SitesSyncActions from './microComponent/SitesSyncActions';
import SiteCard from './microComponent/SiteCard';
import SyncErrorPopover from './microComponent/SyncErrorPopover';
import { clsx } from 'clsx';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import useRestorSync from '../hooks/useRestorSync';
import ProjectLockedBanner from './microComponent/ProjectLockedBanner';

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
  acquisitionYear?: string;
  yearAbandoned?: string;
};

export type SiteApiPayload = {
  name: string;
  geometry: ProjectSiteFeatureCollection;
  status: string;
  acquisitionYear?: number | null;
  yearAbandoned?: number | null;
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
  isLocked,
  onCompletenessChange,
}: ProjectSitesProps): ReactElement {
  const { deleteApiAuthenticated, postApiAuthenticated, getApiAuthenticated } = useApi();
  const { colors } = themeProperties.designSystem;
  const t = useTranslations('ManageProjects');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ProjectSitesFormData>();

  const [isUploadingData, setIsUploadingData] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [geoLocation, setGeoLocation] = useState<GeoLocation | undefined>(undefined);
  const [geoJson, setGeoJson] = useState<ProjectSiteFeatureCollection | null>(null);
  const [siteDetails, setSiteDetails] = useState<SiteDetails>(defaultSiteDetails);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [siteGUID, setSiteGUID] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSiteInfo, setSelectedSiteInfo] = useState<SiteInfo>({
    siteId: null,
    siteName: null,
  });

  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const {
    isSyncingSites,
    isSiteSyncModalOpen,
    setIsSiteSyncModalOpen,
    isSiteSyncSuccessful,
    snackbarOpen,
    setSnackbarOpen,
    syncErrors,
    syncErrorAnchor,
    setSyncErrorAnchor,
    handleSyncSites,
  } = useRestorSync({
    projectDetails,
    siteList,
    onConfigError: (key) => setErrorMessage(t(key as Parameters<typeof t>[0])),
  });

  const changeSiteDetails = (e: ChangeEvent<HTMLInputElement>): void => {
    setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
  };

  const handleModalClose = () => {
    setEditMode(false);
    setOpenModal(false);
  };

  const fetchProjSites = useCallback(async () => {
    try {
      if (!projectGUID) return;
      const result = await getApiAuthenticated<SitesScopeProjects>(
        `/app/profile/projects/${projectGUID}`,
        { queryParams: { _scope: 'sites' } }
      );
      setGeoLocation({ geoLatitude: result.geoLatitude, geoLongitude: result.geoLongitude });
      if (result.sites.length > 0) setShowForm(false);
      setSiteList(result.sites);
    } catch (err) {
      setErrors(handleError(err as APIError));
      router.push(localizedPath('/profile'));
    }
  }, [projectGUID]);

  useEffect(() => {
    fetchProjSites();
  }, [fetchProjSites]);

  useEffect(() => {
    onCompletenessChange?.(siteList.length > 0);
  }, [siteList]);

  const uploadProjectSite = async (data: ProjectSitesFormData) => {
    if (!geoJson || geoJson.features.length === 0) {
      setErrorMessage(t('errors.polygon.required'));
      return false;
    }
    setIsUploadingData(true);
    try {
      const res = await postApiAuthenticated<Site, SiteApiPayload>(
        `/app/projects/${projectGUID}/sites`,
        {
          payload: {
            name: data.name,
            geometry: geoJson,
            status: data.status,
            acquisitionYear: data.acquisitionYear
              ? Number(data.acquisitionYear)
              : null,
            yearAbandoned: data.yearAbandoned
              ? Number(data.yearAbandoned)
              : null,
          },
        }
      );
      setSiteList((prev) => [...prev, { id: res.id, name: res.name, geometry: res.geometry, status: res.status }]);
      reset({ name: '', status: '', acquisitionYear: '', yearAbandoned: '' });
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
      setSiteList((prev) => prev.filter((item) => item.id !== id));
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

  const editSite = (site: Site) => {
    setGeoJson({
      type: 'FeatureCollection',
      features: [{ geometry: site.geometry, properties: {}, type: 'Feature' }],
    });
    setSiteDetails({ name: site.name, status: site.status, geometry: {} });
    setSiteGUID(site.id);
    setEditMode(true);
    setOpenModal(true);
  };

  const statusOptions = [
    {
      label: projectDetails?.purpose === 'trees' ? t('siteStatusPlanting') : t('siteStatusNotYetProtected'),
      value: projectDetails?.purpose === 'trees' ? 'planting' : 'not yet protected',
    },
    {
      label: projectDetails?.purpose === 'trees' ? t('siteStatusPlanted') : t('siteStatusPartiallyProtected'),
      value: projectDetails?.purpose === 'trees' ? 'planted' : 'partially protected',
    },
    {
      label: projectDetails?.purpose === 'trees' ? t('siteStatusBarren') : t('siteStatusFullyProtected'),
      value: projectDetails?.purpose === 'trees' ? 'barren' : 'fully protected',
    },
    {
      label: projectDetails?.purpose === 'trees' ? t('siteStatusReforestation') : '',
      value: projectDetails?.purpose === 'trees' ? 'reforestation' : '',
    },
  ];

  const EditProps = {
    openModal,
    handleModalClose,
    changeSiteDetails,
    siteDetails,
    errorMessage,
    status: statusOptions,
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
        {projectDetails && (
          <ProjectLockedBanner
            verificationStatus={projectDetails.verificationStatus}
          />
        )}
        <InlineFormDisplayGroup>
          {siteList
            .filter((site) => site.geometry !== null)
            .map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                statusOptions={statusOptions}
                iconColor={colors.coreText}
                onDeleteClick={(siteId, siteName) => {
                  setSelectedSiteInfo({ siteId, siteName });
                  setIsModalOpen(true);
                }}
                onEditClick={editSite}
              />
            ))}
        </InlineFormDisplayGroup>

        {showForm ? (
          <div className={clsx({ [styles.shallowOpacity]: isUploadingData })} style={{ width: 'inherit' }}>
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
                    helperText={errors.name !== undefined && errors.name.message}
                  />
                )}
              />
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
                    helperText={errors.status !== undefined && errors.status.message}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </InlineFormDisplayGroup>

            <InlineFormDisplayGroup>
              <Controller
                name="acquisitionYear"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={t('acquisitionYear')}
                    variant="outlined"
                    type="number"
                    onChange={onChange}
                    value={value ?? ''}
                    onBlur={onBlur}
                    inputProps={{ min: 1900, max: 2100 }}
                    error={errors.acquisitionYear !== undefined}
                    helperText={
                      errors.acquisitionYear !== undefined &&
                      errors.acquisitionYear.message
                    }
                  />
                )}
              />
              <Controller
                name="yearAbandoned"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={t('yearOfAbandonment')}
                    variant="outlined"
                    type="number"
                    onChange={onChange}
                    value={value ?? ''}
                    onBlur={onBlur}
                    inputProps={{ min: 1900, max: 2100 }}
                    error={errors.yearAbandoned !== undefined}
                    helperText={
                      errors.yearAbandoned !== undefined &&
                      errors.yearAbandoned.message
                    }
                  />
                )}
              />
            </InlineFormDisplayGroup>

            {geoLocation && <SiteGeometryEditor geoJson={geoJson} setGeoJson={setGeoJson} setErrorMessage={setErrorMessage} />}

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
              isSyncingSites={isSyncingSites}
              isSiteSyncModalOpen={isSiteSyncModalOpen}
              setIsSiteSyncModalOpen={setIsSiteSyncModalOpen}
              isSiteSyncSuccessful={isSiteSyncSuccessful}
              snackbarOpen={snackbarOpen}
              setSnackbarOpen={setSnackbarOpen}
              handleSyncSites={handleSyncSites}
            />
          </div>
        )}

        {errorMessage !== null && (
          <div className={styles.formFieldLarge}>
            <h4 className={styles.errorMessage}>{errorMessage}</h4>
          </div>
        )}

        {syncErrors.length > 0 && (
          <SyncErrorPopover
            label={t('syncSites.partialError')}
            syncErrors={syncErrors}
            anchor={syncErrorAnchor}
            setAnchor={setSyncErrorAnchor}
          />
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
          {!isLocked && (
            <>
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
            </>
          )}
        </div>

        <CustomModal
          isOpen={isModalOpen}
          handleContinue={() => {
            if (selectedSiteInfo.siteId !== null) deleteProjectSite(selectedSiteInfo.siteId);
          }}
          handleCancel={() => setIsModalOpen(false)}
          modalTitle={t('deleteSite')}
          modalSubtitle={t('siteDeleteConfirmation', { siteName: selectedSiteInfo.siteName ?? '' })}
          continueButtonText={t('delete')}
          cancelButtonText={t('cancel')}
        />
      </StyledForm>
    </CenteredContainer>
  );
}

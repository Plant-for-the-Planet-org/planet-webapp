import type { EditSiteProps, Site } from '../../../../common/types/project';
import type { APIError } from '@planet-sdk/common';
import type { ProjectSitesFormData, SiteApiPayload } from '../ProjectSites';
import type { ChangeEvent } from 'react';
import type { ProjectSiteFeatureCollection } from '../../../../common/types/map';

import styles from '../../StepForm.module.scss';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { useApi } from '../../../../../hooks/useApi';
import { useContext, useState } from 'react';
import { ThemeContext } from '../../../../../theme/themeContext';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import { Button, Fade, MenuItem, Modal, TextField } from '@mui/material';
import SiteGeometryEditor from '../SiteGeometryEditor';
import BackArrow from '../../../../../../public/assets/images/icons/headerIcons/BackArrow';
import { clsx } from 'clsx';

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
}: EditSiteProps) {
  const { theme } = useContext(ThemeContext);
  const { putApiAuthenticated } = useApi();
  const t = useTranslations('ManageProjects');
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectSitesFormData>();
  const [geoJson, setGeoJson] = useState<ProjectSiteFeatureCollection | null>(
    geoJsonProp
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingData, setIsUploadingData] = useState<boolean>(false);
  const { setErrors } = useContext(ErrorHandlingContext);

  const MapProps = {
    geoJson,
    setGeoJson,
    setErrorMessage,
    geoLocation: {
      geoLatitude: 36.96,
      geoLongitude: -28.5,
    },
  };

  const editProjectSite = async (data: ProjectSitesFormData) => {
    if (geoJson && geoJson.features && geoJson.features.length !== 0) {
      setIsUploadingData(true);
      const updatedSitePayload: SiteApiPayload = {
        name: data.name,
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
        setSiteList((prevSites) => {
          const nextSites = [...prevSites];
          const index = nextSites.findIndex((site) => site.id === res.id);
          if (index === -1) {
            return prevSites; // Early exit if not found
          }
          nextSites[index] = res;
          return nextSites;
        });
        setGeoJson(null);
        setIsUploadingData(false);
        setEditMode(false);
        setErrorMessage(null);
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    } else {
      setErrorMessage(t('errors.polygon.required'));
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
    >
      <Fade in={openModal}>
        <form className={styles.editSiteForm}>
          <div className={clsx({ [styles.shallowOpacity]: isUploadingData })}>
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

            <SiteGeometryEditor {...MapProps} />
          </div>

          {errorMessage !== null && (
            <div className={styles.formFieldLarge}>
              <h4 className={styles.errorMessage}>{errorMessage}</h4>
            </div>
          )}

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

export default EditSite;

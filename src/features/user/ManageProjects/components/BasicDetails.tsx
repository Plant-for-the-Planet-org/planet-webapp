import type { ChangeEvent, ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type {
  BasicDetailsProps,
  ExtendedProfileProjectProperties,
} from '../../../common/types/project';
import type {
  MapLayerMouseEvent,
  ViewState,
  ViewStateChangeEvent,
} from 'react-map-gl-v7/maplibre';
import type {
  ExtendedMapLibreMap,
  MapRef,
} from '../../../common/types/projectv2';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, FormControlLabel, Tooltip } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import styles from './../StepForm.module.scss';
import MapGL, { Marker, NavigationControl } from 'react-map-gl-v7/maplibre';

import { MenuItem, TextField } from '@mui/material';
import InfoIcon from './../../../../../public/assets/images/icons/manageProjects/Info';
import {
  getFormattedNumber,
  parseNumber,
} from '../../../../utils/getFormattedNumber';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import { ThemeContext } from '../../../../theme/themeContext';
import { useRouter } from 'next/router';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError } from '@planet-sdk/common';
import { ProjectCreationTabs } from '..';
import { useApi } from '../../../../hooks/useApi';
import NewToggleSwitch from '../../../common/InputTypes/NewToggleSwitch';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { getAddressFromCoordinates } from '../../../../utils/geocoder';
import {
  DEFAULT_MAP_STATE,
  DEFAULT_VIEW_STATE,
} from '../../../projectsV2/ProjectsMapContext';
import { ProjectLocationIcon } from '../../../../../public/assets/images/icons/projectV2/ProjectLocationIcon';
import themeProperties from '../../../../theme/themeProperties';

type BaseFormData = {
  name: string;
  slug: string;
  website: string;
  description: string;
  acceptDonations: boolean;
  unitCost: string;
  latitude: string;
  longitude: string;
  metadata: {
    visitorAssistance: boolean;
    ecosystem: string;
  };
};

type TreeFormData = BaseFormData & {
  classification: string;
  countTarget: string;
  unitType: 'tree' | 'm2';
};

type ConservationFormData = BaseFormData;

type BaseProjectApiPayload = {
  name: string;
  slug: string;
  website: string;
  description: string;
  acceptDonations: boolean;
  unitCost?: number;
  currency: 'EUR';
  metadata: {
    ecosystem: string;
    visitorAssistance: boolean;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

type TreeProjectApiPayload = BaseProjectApiPayload & {
  classification: string;
  countTarget: number;
  unitType: 'tree' | 'm2';
};

type ConservationProjectApiPayload = BaseProjectApiPayload & {
  purpose: 'conservation';
};

type ProjectApiPayload = TreeProjectApiPayload | ConservationProjectApiPayload;

type ProjectCoordinates = {
  lng: number;
  lat: number;
};

export default function BasicDetails({
  handleNext,
  projectDetails,
  setProjectDetails,
  setProjectGUID,
  projectGUID,
  purpose,
}: BasicDetailsProps): ReactElement {
  const t = useTranslations('ManageProjects');
  const locale = useLocale();
  const mapRef: MapRef = useRef<ExtendedMapLibreMap | null>(null);
  const { theme } = useContext(ThemeContext);
  const { putApiAuthenticated, postApiAuthenticated } = useApi();
  const { setErrors } = useContext(ErrorHandlingContext);
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  const [acceptDonations, setAcceptDonations] = useState(false);
  const [IsSkipButtonVisible, setIsSkipButtonVisible] =
    useState<boolean>(false);
  const [isUploadingData, setIsUploadingData] = useState<boolean>(false);
  const [viewState, setViewState] = useState(DEFAULT_VIEW_STATE);
  const [mapState, setMapState] = useState(DEFAULT_MAP_STATE);
  const [projectCoords, setProjectCoords] = useState<ProjectCoordinates | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadMapStyle() {
      const result = await getMapStyle('openStreetMap');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);

  const handleViewStateChange = (newViewState: Partial<ViewState>) => {
    setViewState((prev) => ({
      ...prev,
      ...newViewState,
    }));
  };

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      handleViewStateChange(evt.viewState);
    },
    [handleViewStateChange]
  );
  const changeLat = (e: ChangeEvent<HTMLInputElement>) => {
    const latNumericValue = Number(e.target.value);

    if (
      !isNaN(latNumericValue) &&
      latNumericValue > -90 &&
      latNumericValue < 90
    ) {
      setProjectCoords({
        lat: latNumericValue,
        lng: projectCoords?.lng ?? 0,
      });
    }
  };
  const changeLon = (e: ChangeEvent<HTMLInputElement>) => {
    const lonNumericValue = Number(e.target.value);

    if (
      !isNaN(lonNumericValue) &&
      lonNumericValue > -180 &&
      lonNumericValue < 180
    ) {
      setProjectCoords({
        lat: projectCoords?.lat ?? 0,
        lng: lonNumericValue,
      });
    }
  };
  const classifications = [
    {
      label: t('largeScalePlanting'),
      value: 'large-scale-planting',
    },
    {
      label: t('agroforestry'),
      value: 'agroforestry',
    },
    {
      label: t('naturalRegeneration'),
      value: 'natural-regeneration',
    },
    {
      label: t('managedRegeneration'),
      value: 'managed-regeneration',
    },
    {
      label: t('urbanPlanting'),
      value: 'urban-planting',
    },
    {
      label: t('otherPlanting'),
      value: 'other-planting',
    },
  ];

  const ecosystemTypes = [
    'tropical-moist-forests',
    'tropical-dry-forests',
    'tropical-coniferous-forests',
    'tropical-grasslands-forests',
    'temperate-broadleaf-forests',
    'temperate-coniferous-forests',
    'temperate-grasslands-forests',
    'mediterranean-forests',
    'mangroves',
    'deserts',
    'flooded-grasslands',
    'montane-grasslands',
    'boreal-forests',
    'tundra',
  ];

  const unitTypeOptions = ['tree', 'm2'] as const;

  // Default Form Fields
  const defaultBasicDetails =
    purpose === 'trees'
      ? {
          name: '',
          slug: '',
          website: '',
          description: '',
          acceptDonations: false,
          unitCost: '',
          unitType: '',
          latitude: '',
          longitude: '',
          metadata: {
            ecosystem: '',
            visitorAssistance: false,
          },
          classification: '',
          countTarget: '',
        }
      : {
          name: '',
          slug: '',
          website: '',
          description: '',
          acceptDonations: false,
          unitCost: '',
          latitude: '',
          longitude: '',
          metadata: {
            ecosystem: '',
            visitorAssistance: false,
          },
        };

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TreeFormData | ConservationFormData>({
    mode: 'onBlur',
    defaultValues: defaultBasicDetails,
  });

  //if project is already had created then user can visit to  other forms using skip button
  useEffect(() => {
    if (projectDetails?.id) {
      setIsSkipButtonVisible(true);
    }
  }, [router]);

  useEffect(() => {
    if (projectDetails) {
      const basicDetails =
        purpose === 'trees'
          ? {
              name: projectDetails.name,
              slug: projectDetails.slug,
              website: projectDetails.website || '',
              description: projectDetails.description,
              acceptDonations: projectDetails.acceptDonations,
              unitType: projectDetails.unitType,
              unitCost: getFormattedNumber(
                locale,
                projectDetails.unitCost || 0
              ),
              latitude: projectDetails.geoLatitude.toString(),
              longitude: projectDetails.geoLongitude.toString(),
              metadata: {
                visitorAssistance:
                  projectDetails.metadata.visitorAssistance || false,
                ecosystem: projectDetails.metadata.ecosystem || '',
              },
              classification: projectDetails.classification || '',
              countTarget: projectDetails.countTarget || '',
            }
          : {
              name: projectDetails.name,
              slug: projectDetails.slug,
              website: projectDetails.website || '',
              description: projectDetails.description,
              acceptDonations: projectDetails.acceptDonations,
              unitCost: getFormattedNumber(
                locale,
                projectDetails.unitCost || 0
              ),
              latitude: projectDetails.geoLatitude.toString(),
              longitude: projectDetails.geoLongitude.toString(),
              metadata: {
                visitorAssistance:
                  projectDetails.metadata.visitorAssistance || false,
                ecosystem: projectDetails.metadata.ecosystem || '',
              },
            };
      if (projectDetails.geoLongitude && projectDetails.geoLatitude) {
        setProjectCoords({
          lng: projectDetails.geoLongitude,
          lat: projectDetails.geoLatitude,
        });
        setViewState((prev) => ({
          ...prev,
          latitude: projectDetails.geoLatitude,
          longitude: projectDetails.geoLongitude,
          zoom: 7,
        }));
      }
      reset(basicDetails);
      if (projectDetails.acceptDonations) {
        setAcceptDonations(projectDetails.acceptDonations);
      }
    }
  }, [projectDetails]);

  const onSubmit = async (data: TreeFormData | ConservationFormData) => {
    setIsUploadingData(true);
    const commonFields: BaseProjectApiPayload = {
      name: data.name,
      slug: data.slug,
      website: data.website,
      description: data.description,
      acceptDonations: data.acceptDonations,
      unitCost: parseNumber(locale, Number(data.unitCost))
        ? parseNumber(locale, Number(data.unitCost))
        : undefined,
      currency: 'EUR',
      metadata: {
        ecosystem: data.metadata.ecosystem,
        visitorAssistance: data.metadata.visitorAssistance,
      },
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
      },
    };
    const projectPayload: ProjectApiPayload =
      purpose === 'trees'
        ? {
            ...commonFields,
            unitType: (data as TreeFormData).unitType,
            classification: (data as TreeFormData).classification,
            countTarget: Number((data as TreeFormData).countTarget),
          }
        : {
            ...commonFields,
            purpose: 'conservation',
          };
    // Check if GUID is set use update instead of create project
    if (projectGUID) {
      try {
        const res = await putApiAuthenticated<
          ExtendedProfileProjectProperties,
          ProjectApiPayload
        >(`/app/projects/${projectGUID}`, {
          payload: projectPayload,
        });
        setProjectDetails(res);
        setIsUploadingData(false);
        handleNext(ProjectCreationTabs.PROJECT_MEDIA);
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    } else {
      try {
        const res = await postApiAuthenticated<
          ExtendedProfileProjectProperties,
          ProjectApiPayload
        >(`/app/projects`, { payload: projectPayload });
        setProjectGUID(res.id);
        setProjectDetails(res);
        router.push(localizedPath(`/profile/projects/${res.id}?type=media`));
        setIsUploadingData(false);
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    }
  };

  const onClick = useCallback(
    async (e: MapLayerMouseEvent) => {
      const latitude = e.lngLat.lat;
      const longitude = e.lngLat.lat;
      if (e.lngLat) {
        setProjectCoords({
          lat: latitude,
          lng: longitude,
        });
      }
      try {
        const result = await getAddressFromCoordinates(latitude, longitude);

        if (result?.address.CountryCode) {
          clearErrors(['latitude', 'longitude']);
        } else {
          setError('latitude', {
            message: t('coordinateError.seaCoordinates'),
          });
          setError('longitude', {
            message: t('coordinateError.seaCoordinates'),
          });
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
      }
      setValue('latitude', latitude.toString());
      setValue('longitude', longitude.toString());
    },
    [setError, clearErrors, setValue]
  );

  return (
    <CenteredContainer>
      <StyledForm>
        <div className="inputContainer">
          <Controller
            name="name"
            control={control}
            rules={{ required: t('nameValidation') }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('name')}
                variant="outlined"
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.name !== undefined}
                helperText={errors.name !== undefined && errors.name.message}
              />
            )}
          />
          <InlineFormDisplayGroup>
            <Controller
              name="metadata.ecosystem"
              rules={{
                required: t('ecosystemType'),
              }}
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={t('ecosystem')}
                  variant="outlined"
                  select
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors.metadata?.ecosystem !== undefined}
                  helperText={
                    errors.metadata?.ecosystem !== undefined &&
                    errors.metadata.ecosystem.message
                  }
                >
                  {ecosystemTypes.map((ecosystem) => (
                    <MenuItem key={ecosystem} value={ecosystem}>
                      {t(`ecosystemTypes.${ecosystem}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {purpose === 'trees' && (
              <Controller
                name="classification"
                rules={{
                  required: t('classificationValidation'),
                }}
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={t('classification')}
                    variant="outlined"
                    select
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    error={
                      'classification' in errors &&
                      errors.classification !== undefined
                    }
                    helperText={
                      'classification' in errors &&
                      errors.classification !== undefined &&
                      errors.classification?.message
                    }
                  >
                    {classifications.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}
          </InlineFormDisplayGroup>
          {purpose === 'trees' && (
            <InlineFormDisplayGroup>
              <Controller
                name="unitType"
                rules={{
                  required: t('unitTypeRequired'),
                }}
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={t('unitType')}
                    variant="outlined"
                    select
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    error={
                      'unitType' in errors && errors.unitType !== undefined
                    }
                    helperText={
                      'unitType' in errors &&
                      errors.unitType !== undefined &&
                      errors.unitType.message
                    }
                  >
                    {unitTypeOptions.map((unitType) => (
                      <MenuItem key={unitType} value={unitType}>
                        {t(`unitTypes.${unitType}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="countTarget"
                control={control}
                rules={{
                  required: t('countTargetValidation'),
                  validate: (value) => parseInt(value, 10) > 1,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label={t('countTarget')}
                    variant="outlined"
                    placeholder={'0'}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      onChange(e);
                    }}
                    value={value}
                    onBlur={onBlur}
                    error={
                      'countTarget' in errors &&
                      errors.countTarget !== undefined
                    }
                    helperText={
                      'countTarget' in errors &&
                      errors.countTarget !== undefined &&
                      (errors.countTarget.message ||
                        t('countTargetValidation2'))
                    }
                  />
                )}
              />
            </InlineFormDisplayGroup>
          )}
          <InlineFormDisplayGroup>
            <Controller
              name="slug"
              control={control}
              rules={{ required: t('slugValidation') }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label={t('slug')}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <p className={styles.inputStartAdornment}>pp.eco/</p>
                    ),
                  }}
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors.slug !== undefined}
                  helperText={errors.slug !== undefined && errors.slug.message}
                />
              )}
            />
            <Controller
              name="website"
              control={control}
              rules={{
                required: t('websiteValidationRequired'),
                pattern: {
                  value:
                    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=*]*)$/,
                  message: t('websiteValidationInvalid'),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label={t('website')}
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors.website !== undefined}
                  helperText={
                    errors.website !== undefined && errors.website.message
                  }
                />
              )}
            />
          </InlineFormDisplayGroup>
          <Controller
            name="description"
            control={control}
            rules={{
              required: t('aboutProjectValidation'),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('aboutProject')}
                variant="outlined"
                multiline
                minRows={2}
                maxRows={4}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.description !== undefined}
                helperText={
                  errors.description !== undefined && errors.description.message
                }
              />
            )}
          />
          <InlineFormDisplayGroup>
            <Controller
              name="acceptDonations"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  label={
                    <div className={styles.toggleLabelWithInfo}>
                      <span className={styles.toggleText}>
                        {t('receiveDonations')}
                      </span>
                      <Tooltip title={t('receiveDonationsInfo')} arrow>
                        <span className={styles.tooltipIcon}>
                          <InfoIcon />
                        </span>
                      </Tooltip>
                    </div>
                  }
                  labelPlacement="end"
                  control={
                    <NewToggleSwitch
                      checked={value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChange(e.target.checked);
                        setAcceptDonations(e.target.checked);
                      }}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  }
                  sx={{ marginLeft: '0px' }}
                />
              )}
            />
            {acceptDonations && (
              <Controller
                name="unitCost"
                control={control}
                rules={{
                  required: {
                    value: acceptDonations,
                    message: t('unitCostRequired'),
                  },
                  validate: (value) =>
                    parseNumber(locale, Number(value)) > 0 &&
                    parseNumber(locale, Number(value)) <= 100,
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={t('unitCost')}
                    variant="outlined"
                    type="number"
                    placeholder={'0'}
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    InputProps={{
                      startAdornment: (
                        <p
                          className={styles.inputStartAdornment}
                          style={{ paddingRight: '4px' }}
                        >{`€`}</p>
                      ),
                    }}
                    error={errors.unitCost !== undefined}
                    helperText={
                      errors.unitCost !== undefined &&
                      (errors.unitCost.message || t('invalidUnitCost'))
                    }
                  />
                )}
              />
            )}
          </InlineFormDisplayGroup>
          <div
            className={`${styles.formFieldLarge} ${styles.mapboxContainer}`}
            style={{ width: '100%' }}
          >
            <p
              style={{
                backgroundColor:
                  theme === 'theme-light'
                    ? themeProperties.designSystem.colors.white
                    : themeProperties.dark.dark,
              }}
            >
              {t('projectLocation')}
            </p>
            <MapGL
              {...viewState}
              {...mapState}
              ref={mapRef}
              onMove={onMove}
              onClick={onClick}
              style={{ width: '100%', height: '400px', overflow: 'hidden' }}
              attributionControl={false}
              onLoad={() => setMapLoaded(true)}
            >
              {projectCoords !== null && mapLoaded && (
                <Marker
                  latitude={projectCoords.lat}
                  longitude={projectCoords.lng}
                >
                  <ProjectLocationIcon
                    color={themeProperties.designSystem.colors.primaryColor}
                  />
                </Marker>
              )}

              <NavigationControl position="bottom-right" />
            </MapGL>

            <div className={styles.basicDetailsCoordinatesContainer}>
              <div
                className={`${styles.formFieldHalf} ${styles.latLongField}`}
                data-test-id="latitude"
              >
                <Controller
                  name="latitude"
                  control={control}
                  rules={{
                    required: t('latitudeRequired'),
                    validate: (value) => {
                      const num = parseFloat(value);
                      if (num < -90 || num > 90)
                        return t('coordinateError.latitudeRange');
                      return true;
                    },
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextField
                      label={t('latitude')}
                      variant="filled"
                      className={styles.latLongInput}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.target.value = e.target.value.replace(
                          /[^0-9.-]/g,
                          ''
                        );
                        changeLat(e);
                        onChange(e);
                      }}
                      value={value}
                      onBlur={onBlur}
                    />
                  )}
                />
              </div>
              <div
                className={`${styles.formFieldHalf} ${styles.latLongField}`}
                data-test-id="longitude"
              >
                <Controller
                  name="longitude"
                  control={control}
                  rules={{
                    required: t('longitudeRequired'),
                    validate: (value) => {
                      const num = parseFloat(value);
                      if (num < -180 || num > 180)
                        return t('coordinateError.longitudeRange');
                      return true;
                    },
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextField
                      label={t('longitude')}
                      variant="filled"
                      className={styles.latLongInput}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        e.target.value = e.target.value.replace(
                          /[^0-9.-]/g,
                          ''
                        );
                        changeLon(e);
                        onChange(e);
                      }}
                      value={value}
                      onBlur={onBlur}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          {(errors.latitude || errors.longitude) && (
            <p className={styles.formErrors} role="alert">
              {errors.latitude?.message || errors.longitude?.message}
            </p>
          )}
          <Controller
            name="metadata.visitorAssistance"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={
                  <p className={styles.toggleText}>
                    {t('visitorAssistanceLabel')}
                  </p>
                }
                labelPlacement="end"
                control={
                  <NewToggleSwitch
                    checked={value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      onChange(e.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                }
                sx={{ marginLeft: '0px' }}
              />
            )}
          />
        </div>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            className="formButton"
            disabled={Object.keys(errors).length > 0}
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('saveAndContinue')
            )}
          </Button>

          {IsSkipButtonVisible ? (
            <Button
              className="formButton"
              variant="contained"
              onClick={() => handleNext(ProjectCreationTabs.PROJECT_MEDIA)}
            >
              {t('skip')}
            </Button>
          ) : (
            ''
          )}
        </div>
      </StyledForm>
    </CenteredContainer>
  );
}

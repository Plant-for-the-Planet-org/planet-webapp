import type { ChangeEvent, ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type {
  BasicDetailsProps,
  ProfileProjectConservation,
  ProfileProjectTrees,
  ViewPort,
} from '../../../common/types/project';
import type { ReverseAddress } from '../../../common/types/geocoder';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, FormControlLabel, Switch, Tooltip } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import styles from './../StepForm.module.scss';
import MapGL, {
  Marker,
  NavigationControl,
  FlyToInterpolator,
} from 'react-map-gl';
import * as d3 from 'd3-ease';
import { MenuItem, TextField } from '@mui/material';
import InfoIcon from './../../../../../public/assets/images/icons/manageProjects/Info';
import {
  postAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import {
  getFormattedNumber,
  parseNumber,
} from '../../../../utils/getFormattedNumber';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import themeProperties from '../../../../theme/themeProperties';
import { ThemeContext } from '../../../../theme/themeContext';
import { useRouter } from 'next/router';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import GeocoderArcGIS from 'geocoder-arcgis';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { ProjectCreationTabs } from '..';
import { useTenant } from '../../../common/Layout/TenantContext';

type FormData = {
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

type TreeFormData = FormData & {
  classification: string;
  countTarget: string;
  unitType: 'tree' | 'm2';
};

type ConservationFormData = FormData;

interface SubmitDataBase {
  name: string;
  slug: string;
  website: string;
  description: string;
  acceptDonations: boolean;
  unitCost: number | undefined;
  currency: 'EUR'; // Fixed currency
  metadata: {
    ecosystem: string;
    visitorAssistance: boolean;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface SubmitDataTrees extends SubmitDataBase {
  unitType: 'tree' | 'm2';
  classification: string;
  countTarget: number;
}

interface SubmitDataConservation extends SubmitDataBase {
  purpose: 'conservation';
}

type SubmitData = SubmitDataTrees | SubmitDataConservation;

export default function BasicDetails({
  handleNext,
  token,
  projectDetails,
  setProjectDetails,
  setProjectGUID,
  projectGUID,
  purpose,
}: BasicDetailsProps): ReactElement {
  const t = useTranslations('ManageProjects');
  const locale = useLocale();
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };

  const [IsSkipButtonVisible, setIsSkipButtonVisible] =
    React.useState<boolean>(false);
  const { tenantConfig } = useTenant();
  const [isUploadingData, setIsUploadingData] = React.useState<boolean>(false);
  // Map setup
  const { theme } = useContext(ThemeContext);
  const { logoutUser } = useUserProps();
  const defaultMapCenter = [0, 0];
  const defaultZoom = 1.4;
  const mapRef = useRef(null);
  const [style, setStyle] = useState(EMPTY_STYLE);
  const [wrongCoordinatesMessage, setWrongCoordinatesMessage] =
    useState<boolean>(false);
  const [viewport, setViewPort] = useState<ViewPort>({
    width: 760,
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });
  const router = useRouter();

  const { setErrors } = useContext(ErrorHandlingContext);

  useEffect(() => {
    //loads the default mapstyle
    async function loadMapStyle() {
      const result = await getMapStyle('openStreetMap');
      if (result) {
        setStyle(result);
      }
    }
    loadMapStyle();
  }, []);

  const [projectCoords, setProjectCoords] = useState<number[]>([0, 0]);

  const changeLat = (e: ChangeEvent<HTMLInputElement>) => {
    const latNumericValue = Number(e.target.value);
    if (latNumericValue && latNumericValue > -90 && latNumericValue < 90) {
      setProjectCoords([
        projectCoords ? projectCoords[0] : 0,
        parseFloat(e.target.value),
      ]);
    }
  };
  const changeLon = (e: ChangeEvent<HTMLInputElement>) => {
    const lonNumericValue = Number(e.target.value);
    if (lonNumericValue && lonNumericValue > -180 && lonNumericValue < 180) {
      setProjectCoords([
        parseFloat(e.target.value),
        projectCoords ? projectCoords[1] : 0,
      ]);
    }
  };
  const _onViewportChange = (view: ViewPort) => setViewPort({ ...view });

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

  const [acceptDonations, setAcceptDonations] = useState(false);
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
        setProjectCoords([
          projectDetails.geoLongitude,
          projectDetails.geoLatitude,
        ]);
        setViewPort({
          ...viewport,
          latitude: projectDetails.geoLatitude,
          longitude: projectDetails.geoLongitude,
          zoom: 7,
        });
      }
      reset(basicDetails);
      if (projectDetails.acceptDonations) {
        setAcceptDonations(projectDetails.acceptDonations);
      }
    }
  }, [projectDetails]);

  const onSubmit = async (data: TreeFormData | ConservationFormData) => {
    setIsUploadingData(true);
    const submitData: SubmitData =
      purpose === 'trees'
        ? {
            name: data.name,
            slug: data.slug,
            website: data.website,
            description: data.description,
            acceptDonations: data.acceptDonations,
            unitCost: data.unitCost
              ? parseNumber(locale, Number(data.unitCost))
              : undefined,
            unitType: (data as TreeFormData).unitType,
            currency: 'EUR',
            classification: (data as TreeFormData).classification,
            countTarget: Number((data as TreeFormData).countTarget),
            metadata: {
              ecosystem: data.metadata.ecosystem,
              visitorAssistance: data.metadata.visitorAssistance,
            },
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(data.longitude),
                parseFloat(data.latitude),
              ],
            },
          }
        : {
            purpose: 'conservation',
            name: data.name,
            slug: data.slug,
            website: data.website,
            description: data.description,
            acceptDonations: data.acceptDonations,
            unitCost: data.unitCost
              ? parseNumber(locale, Number(data.unitCost))
              : undefined,
            currency: 'EUR',
            metadata: {
              ecosystem: data.metadata.ecosystem,
              visitorAssistance: data.metadata.visitorAssistance,
            },
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(data.longitude),
                parseFloat(data.latitude),
              ],
            },
          };

    // Check if GUID is set use update instead of create project
    if (projectGUID) {
      try {
        const res = await putAuthenticatedRequest<
          ProfileProjectTrees | ProfileProjectConservation,
          SubmitData
        >({
          tenant: tenantConfig?.id,
          url: `/app/projects/${projectGUID}`,
          data: submitData,
          token,
          logoutUser,
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
        const res = await postAuthenticatedRequest<
          ProfileProjectTrees | ProfileProjectConservation,
          SubmitData
        >({
          tenant: tenantConfig?.id,
          url: `/app/projects`,
          data: submitData,
          token,
          logoutUser,
        });
        setProjectGUID(res.id);
        setProjectDetails(res);
        router.push(`/profile/projects/${res.id}?type=media`);
        setIsUploadingData(false);
      } catch (err) {
        setIsUploadingData(false);
        setErrors(handleError(err as APIError));
      }
    }
  };

  const geocoder = new GeocoderArcGIS(
    process.env.ESRI_CLIENT_SECRET
      ? {
          client_id: process.env.ESRI_CLIENT_ID,
          client_secret: process.env.ESRI_CLIENT_SECRET,
        }
      : {}
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
                  //value: /^(?:http(s)?:\/\/)?[\w\.\-]+(?:\.[\w\.\-]+)+[\w\.\-_~:/?#[\]@!\$&'\(\)\*\+,;=#%]+$/,
                  value:
                    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=*]*)$/,
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
                    <div>
                      {t('receiveDonations')}
                      <Tooltip title={t('receiveDonationsInfo')} arrow>
                        <span className={styles.tooltipIcon}>
                          <InfoIcon />
                        </span>
                      </Tooltip>
                    </div>
                  }
                  labelPlacement="end"
                  control={
                    <Switch
                      checked={value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChange(e.target.checked);
                        setAcceptDonations(e.target.checked);
                      }}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  }
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
                    ? themeProperties.light.light
                    : themeProperties.dark.dark,
              }}
            >
              {t('projectLocation')}
            </p>
            <MapGL
              {...viewport}
              ref={mapRef}
              mapStyle={style}
              onViewportChange={_onViewportChange}
              onClick={(event) => {
                setProjectCoords(event.lngLat);
                const latLong = {
                  latitude: event.lngLat[1],
                  longitude: event.lngLat[0],
                };
                geocoder
                  .reverse(`${latLong.longitude}, ${latLong.latitude}`, {
                    // longitude,latitude
                    maxLocations: 10,
                    distance: 100,
                  })
                  .then((result: ReverseAddress) => {
                    if (result?.address?.Type === 'Ocean') {
                      setWrongCoordinatesMessage(true);
                      setError('latitude', {
                        message: '',
                      });
                      setError('longitude', {
                        message: '',
                      });
                    } else {
                      setWrongCoordinatesMessage(false);
                      clearErrors(['latitude', 'longitude']);
                    }
                  })
                  .catch((error: string) => {
                    console.log(`error`, error);
                  });
                setViewPort({
                  ...viewport,
                  latitude: event.lngLat[1],
                  longitude: event.lngLat[0],
                  transitionDuration: 400,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionEasing: d3.easeCubic,
                });
                setValue('latitude', latLong.latitude.toString());
                setValue('longitude', latLong.longitude.toString());
              }}
            >
              {projectCoords ? (
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
            <div className={styles.basicDetailsCoordinatesContainer}>
              <div
                className={`${styles.formFieldHalf} ${styles.latlongField}`}
                data-test-id="latitude"
              >
                <Controller
                  name="latitude"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) =>
                      parseFloat(value) > -90 && parseFloat(value) < 90,
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
                      error={errors.latitude !== undefined}
                      helperText={
                        errors.latitude !== undefined &&
                        (wrongCoordinatesMessage
                          ? t('wrongCoordinates')
                          : t('latitudeRequired'))
                      }
                    />
                  )}
                />
              </div>
              <div
                className={`${styles.formFieldHalf} ${styles.latlongField}`}
                data-test-id="longitude"
              >
                <Controller
                  name="longitude"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) =>
                      parseFloat(value) > -180 && parseFloat(value) < 180,
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
                      error={errors.longitude !== undefined}
                      helperText={
                        errors.longitude !== undefined &&
                        (wrongCoordinatesMessage
                          ? t('wrongCoordinates')
                          : t('longitudeRequired'))
                      }
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <Controller
            name="metadata.visitorAssistance"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t('visitorAssistanceLabel')}
                labelPlacement="end"
                control={
                  <Switch
                    checked={value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      onChange(e.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                }
              />
            )}
          />
        </div>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            className="formButton"
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

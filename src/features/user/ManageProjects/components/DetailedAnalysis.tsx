import type { ReactElement } from 'react';
import type { APIError, InterventionTypes } from '@planet-sdk/common';
import type {
  DetailedAnalysisProps,
  SiteOwners,
  PlantingSeason,
  InterventionOption,
  ExtendedProfileProjectProperties,
} from '../../../common/types/project';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import styles from './../StepForm.module.scss';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import ProjectCertificates from './ProjectCertificates';
import InfoIcon from '../../../../../public/assets/images/icons/manageProjects/Info';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { useRouter } from 'next/router';
import { handleError } from '@planet-sdk/common';
import { Alert, TextField, Button, MenuItem, Tooltip } from '@mui/material';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ProjectCreationTabs } from '..';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { useApi } from '../../../../hooks/useApi';
import themeProperties from '../../../../theme/themeProperties';
import { clsx } from 'clsx';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';
import ProjectLockedBanner from './microComponent/ProjectLockedBanner';
import AnnotationCallout from './microComponent/AnnotationCallout';

type BaseFormData = {
  ecosystem: string;
  employeesCount: string;
  mainChallenge: string;
  motivation: string;
  longTermPlan: string;
  siteOwnerName: string;
};

type TreeFormData = BaseFormData & {
  purpose: 'trees';
  firstTreePlanted: Date | null;
  plantingDensity: string;
  maxPlantingDensity: string;
  degradationCause: string;
};

type ConservationFormData = BaseFormData & {
  purpose: 'conservation';
  acquisitionYear: Date | null;
  areaProtected: string;
  startingProtectionYear: Date | null;
  ownershipType: string;
  actions: string;
  benefits: string;
};

type BaseProjectMetadata = {
  employeesCount: string;
  mainInterventions: string[];
  longTermPlan: string;
  mainChallenge: string;
  motivation: string;
  siteOwnerName: string;
};

type TreeMetadata = BaseProjectMetadata & {
  ecosystem: string;
  degradationCause: string;
  plantingDensity: string;
  maxPlantingDensity: string;
  plantingSeasons: number[];
  siteOwnerType: string[];
  firstTreePlanted: string | null;
};

type ConservationMetadata = BaseProjectMetadata & {
  ecosystem: string;
  acquisitionYear: number | null;
  activitySeasons: number[];
  areaProtected: string;
  startingProtectionYear: number | null;
  ownershipType: string;
  landOwnershipType: string[];
  actions: string;
  benefits: string;
};

type TreeProjectApiPayload = {
  metadata: TreeMetadata;
};

type ConservationProjectApiPayload = {
  metadata: ConservationMetadata;
};

type ProjectApiPayload = TreeProjectApiPayload | ConservationProjectApiPayload;

export default function DetailedAnalysis({
  handleBack,
  userLang,
  token,
  handleNext,
  projectDetails,
  setProjectDetails,
  projectGUID,
  purpose,
  isLocked,
  onCompletenessChange,
}: DetailedAnalysisProps): ReactElement {
  const tManageProjects = useTranslations('ManageProjects');
  const tCommon = useTranslations('Common');
  const { putApiAuthenticated } = useApi();
  const { colors } = themeProperties.designSystem;
  // local state
  const [siteOwners, setSiteOwners] = useState<SiteOwners[]>([
    {
      id: 1,
      title: tManageProjects('siteOwnerPrivate'),
      value: 'private',
      isSet: false,
    },
    {
      id: 2,
      title: tManageProjects('siteOwnerPublic'),
      value: 'public-property',
      isSet: false,
    },
    {
      id: 3,
      title: tManageProjects('siteOwnerSmallHolding'),
      value: 'smallholding',
      isSet: false,
    },
    {
      id: 4,
      title: tManageProjects('siteOwnerCommunal'),
      value: 'communal-land',
      isSet: false,
    },
    {
      id: 5,
      title: tManageProjects('siteOwnerOwned'),
      value: 'owned-by-owner',
      isSet: false,
    },
    {
      id: 6,
      title: tManageProjects('siteOwnerOther'),
      value: 'other',
      isSet: false,
    },
  ]);
  const [isUploadingData, setIsUploadingData] = useState<boolean>(false);
  const [plantingSeasons, setPlantingSeasons] = useState<PlantingSeason[]>([
    { id: 1, title: tCommon('january'), isSet: false },
    { id: 2, title: tCommon('february'), isSet: false },
    { id: 3, title: tCommon('march'), isSet: false },
    { id: 4, title: tCommon('april'), isSet: false },
    { id: 5, title: tCommon('may'), isSet: false },
    { id: 6, title: tCommon('june'), isSet: false },
    { id: 7, title: tCommon('july'), isSet: false },
    { id: 8, title: tCommon('august'), isSet: false },
    { id: 9, title: tCommon('september'), isSet: false },
    { id: 10, title: tCommon('october'), isSet: false },
    { id: 11, title: tCommon('november'), isSet: false },
    { id: 12, title: tCommon('december'), isSet: false },
  ]);
  const [interventionOptions, setInterventionOptions] = useState<
    InterventionOption[]
  >([
    ['assisting-seed-rain', false],
    ['control-remove-livestock', false],
    ['cut-suppressing-grass', false],
    ['direct-seeding', false],
    ['enrichment-planting', false],
    ['establish-firebreaks', false],
    ['fire-patrols', false],
    ['fire-suppression-team', false],
    ['liberating-regenerants', false],
    ['maintenance', false],
    ['marking-regenerants', false],
    ['other-interventions', false],
    ['planting-trees', false],
    ['removal-contaminated-soil', false],
    ['removal-invasive-species', false],
    ['soil-improvement', false],
    ['stop-tree-harvesting', false],
  ]);
  const [mainInterventions, setMainInterventions] = useState<
    InterventionTypes[]
  >([]);
  const [isInterventionsMissing, setIsInterventionsMissing] = useState<
    boolean | null
  >(null);
  const [isSiteOwnerMissing, setIsSiteOwnerMissing] = useState<boolean | null>(
    null
  );
  const [minDensity, setMinDensity] = useState<number | string | null>(0);
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

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

  const handleSetPlantingSeasons = (id: number) => {
    const month = plantingSeasons[id - 1];
    const updatedMonth = month;
    updatedMonth.isSet = !month.isSet;
    const plantingSeasonsUpdated = plantingSeasons;
    plantingSeasonsUpdated[id - 1] = updatedMonth;
    setPlantingSeasons([...plantingSeasonsUpdated]);
  };

  const handleSetSiteOwner = (id: number) => {
    const owner = siteOwners[id - 1];
    const updatedOwner = owner;
    updatedOwner.isSet = !owner.isSet;
    const updatedSiteOwners = siteOwners;
    updatedSiteOwners[id - 1] = updatedOwner;
    setSiteOwners([...updatedSiteOwners]);
    setIsSiteOwnerMissing(!updatedSiteOwners.some((o) => o.isSet));
  };

  const updateMainInterventions = (interventionToUpdate: InterventionTypes) => {
    const updatedInterventions: InterventionOption[] = interventionOptions.map(
      (interventionOption) => {
        const [intervention, isSet] = interventionOption;
        return intervention === interventionToUpdate
          ? [intervention, !isSet]
          : [intervention, isSet];
      }
    );
    setIsInterventionsMissing(
      !updatedInterventions.some(([_intervention, isSet]) => isSet === true)
    );
    setInterventionOptions(updatedInterventions);
  };

  useEffect(() => {
    setMainInterventions(
      interventionOptions
        .filter(([_intervention, isSet]) => isSet)
        .map(([intervention, _isSet]) => intervention)
    );
  }, [interventionOptions]);

  const router = useRouter();

  const defaultFormData: TreeFormData | ConservationFormData =
    purpose === 'trees'
      ? {
          purpose: 'trees',
          ecosystem: '',
          firstTreePlanted: null,
          plantingDensity: '',
          maxPlantingDensity: '',
          employeesCount: '',
          mainChallenge: '',
          siteOwnerName: '',
          degradationCause: '',
          longTermPlan: '',
          motivation: '',
        }
      : {
          purpose: 'conservation',
          ecosystem: '',
          actions: '',
          benefits: '',
          employeesCount: '',
          acquisitionYear: null,
          startingProtectionYear: null,
          areaProtected: '',
          ownershipType: '',
          siteOwnerName: '',
          mainChallenge: '',
          longTermPlan: '',
          motivation: '',
        };

  const {
    handleSubmit,
    control,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TreeFormData | ConservationFormData>({
    mode: 'onBlur',
    defaultValues: defaultFormData,
  });

  const owners: string[] = [];
  for (let i = 0; i < siteOwners.length; i++) {
    if (siteOwners[i].isSet) {
      owners.push(`${siteOwners[i].value}`);
    }
  }

  const months: number[] = [];
  for (let i = 0; i < plantingSeasons.length; i++) {
    if (plantingSeasons[i].isSet) {
      const j = i + 1;
      months.push(j);
    }
  }
  // for validating max planting density value > planting density value
  useEffect(() => {
    if (
      projectDetails &&
      projectDetails.purpose === 'trees' &&
      router.query.type === 'detail-analysis'
    ) {
      setMinDensity(projectDetails.metadata.plantingDensity);
    }
  }, [router.query.type]);

  const onSubmit = async (data: TreeFormData | ConservationFormData) => {
    if (data.purpose === 'trees' && mainInterventions.length === 0) {
      setIsInterventionsMissing(true);
    }
    setIsUploadingData(true);
    const commonFields: BaseProjectMetadata = {
      employeesCount: data.employeesCount,
      mainInterventions: mainInterventions,
      longTermPlan: data.longTermPlan,
      mainChallenge: data.mainChallenge,
      motivation: data.motivation,
      siteOwnerName: data.siteOwnerName,
    };

    const projectPayload: ProjectApiPayload =
      data.purpose === 'trees'
        ? {
            metadata: {
              ...commonFields,
              ecosystem: data.ecosystem,
              degradationCause: data.degradationCause,
              plantingDensity: data.plantingDensity,
              maxPlantingDensity: data.maxPlantingDensity,
              plantingSeasons: months,
              siteOwnerType: owners,
              firstTreePlanted: data.firstTreePlanted
                ? `${data.firstTreePlanted.getFullYear()}-${
                    data.firstTreePlanted.getMonth() + 1
                  }-${data.firstTreePlanted.getDate()}`
                : null,
            },
          }
        : {
            metadata: {
              ...commonFields,
              ecosystem: (data as ConservationFormData).ecosystem,
              acquisitionYear: (data as ConservationFormData).acquisitionYear
                ? (data as ConservationFormData).acquisitionYear!.getFullYear()
                : null,
              activitySeasons: months,
              areaProtected: (data as ConservationFormData).areaProtected,
              startingProtectionYear: (data as ConservationFormData)
                .startingProtectionYear
                ? (
                    data as ConservationFormData
                  ).startingProtectionYear!.getFullYear()
                : null,
              ownershipType: (data as ConservationFormData).ownershipType,
              landOwnershipType: owners,
              actions: (data as ConservationFormData).actions,
              benefits: (data as ConservationFormData).benefits,
            },
          };

    try {
      const res = await putApiAuthenticated<
        ExtendedProfileProjectProperties,
        ProjectApiPayload
      >(`/app/projects/${projectGUID}`, { payload: projectPayload });
      setProjectDetails(res);
      setIsUploadingData(false);
      setIsInterventionsMissing(null);
      handleNext(ProjectCreationTabs.PROJECT_SITES);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  // Use Effect to hide error message after 10 seconds

  useEffect(() => {
    if (projectDetails) {
      const { metadata, purpose: projectPurpose } = projectDetails;
      const formData: TreeFormData | ConservationFormData =
        projectPurpose === 'trees'
          ? {
              purpose: 'trees',
              ecosystem: metadata.ecosystem || '',
              firstTreePlanted: metadata.firstTreePlanted
                ? new Date(metadata.firstTreePlanted)
                : new Date(),
              plantingDensity: metadata.plantingDensity?.toString() || '',
              maxPlantingDensity: metadata.maxPlantingDensity?.toString() || '',
              employeesCount: metadata.employeesCount?.toString() || '',
              mainChallenge: metadata.mainChallenge || '',
              siteOwnerName: metadata.siteOwnerName || '',
              degradationCause: metadata.degradationCause || '',
              longTermPlan: metadata.longTermPlan || '',
              motivation: metadata.motivation || '',
            }
          : {
              purpose: 'conservation',
              ecosystem: metadata.ecosystem || '',
              actions: metadata.actions || '',
              benefits: metadata.benefits || '',
              employeesCount: metadata.employeesCount?.toString() || '',
              acquisitionYear: metadata.acquisitionYear
                ? new Date(new Date().setFullYear(metadata.acquisitionYear))
                : null,
              startingProtectionYear: metadata.startingProtectionYear
                ? new Date(
                    new Date().setFullYear(metadata.startingProtectionYear)
                  )
                : null,
              areaProtected: metadata.areaProtected?.toString() || '',
              ownershipType: metadata.ownershipType || '',
              siteOwnerName: metadata.siteOwnerName || '',
              mainChallenge: metadata.mainChallenge || '',
              longTermPlan: metadata.longTermPlan || '',
              motivation: metadata.motivation || '',
            };
      // set planting seasons

      if (projectPurpose === 'trees') {
        if (metadata.plantingSeasons && metadata.plantingSeasons.length > 0) {
          const updatedPlantingSeasons = plantingSeasons;
          for (let i = 0; i < metadata.plantingSeasons.length; i++) {
            for (let j = 0; j < updatedPlantingSeasons.length; j++) {
              if (
                updatedPlantingSeasons[j].id === metadata.plantingSeasons[i]
              ) {
                updatedPlantingSeasons[j].isSet = true;
              }
            }
          }
          setPlantingSeasons(updatedPlantingSeasons);
        }
      } else {
        if (metadata.activitySeasons && metadata.activitySeasons.length > 0) {
          const updatedActivitySeasons = plantingSeasons;
          for (let i = 0; i < metadata.activitySeasons.length; i++) {
            for (let j = 0; j < updatedActivitySeasons.length; j++) {
              if (
                updatedActivitySeasons[j].id === metadata.activitySeasons[i]
              ) {
                updatedActivitySeasons[j].isSet = true;
              }
            }
          }
          setPlantingSeasons(updatedActivitySeasons);
        }
      }

      // set owner type

      if (projectPurpose === 'trees') {
        if (metadata.siteOwnerType && metadata.siteOwnerType.length > 0) {
          const newSiteOwners = siteOwners;
          for (let i = 0; i < metadata.siteOwnerType.length; i++) {
            for (let j = 0; j < newSiteOwners.length; j++) {
              if (newSiteOwners[j].value === metadata.siteOwnerType[i]) {
                newSiteOwners[j].isSet = true;
              }
            }
          }
          setSiteOwners(newSiteOwners);
        }
      } else {
        if (
          projectDetails?.metadata?.landOwnershipType &&
          projectDetails?.metadata?.landOwnershipType.length > 0
        ) {
          const newSiteOwners = siteOwners;
          for (
            let i = 0;
            i < projectDetails?.metadata?.landOwnershipType.length;
            i++
          ) {
            for (let j = 0; j < newSiteOwners.length; j++) {
              if (
                newSiteOwners[j].value ===
                projectDetails?.metadata?.landOwnershipType[i]
              ) {
                newSiteOwners[j].isSet = true;
              }
            }
          }
          setSiteOwners(newSiteOwners);
        }
      }

      // set main interventions
      if (
        metadata.mainInterventions !== null &&
        metadata.mainInterventions.length > 0
      ) {
        const { mainInterventions } = metadata;
        const initialInterventionOptions: InterventionOption[] =
          interventionOptions.map(([intervention, isSet]) =>
            mainInterventions.includes(intervention)
              ? [intervention, true]
              : [intervention, isSet]
          );
        setInterventionOptions(initialInterventionOptions);
      }

      reset(formData);
      trigger();
      if (projectPurpose === 'trees') {
        setIsInterventionsMissing(
          !(metadata.mainInterventions && metadata.mainInterventions.length > 0)
        );
      } else {
        setIsInterventionsMissing(null);
      }
      const savedOwners =
        projectPurpose === 'trees'
          ? metadata.siteOwnerType
          : projectDetails?.metadata?.landOwnershipType;
      setIsSiteOwnerMissing(!(savedOwners && savedOwners.length > 0));
    }
  }, [projectDetails]);

  const savedDataIncomplete = (() => {
    if (!projectDetails || isLocked) return false;
    if (!projectDetails.metadata) return true;
    const { metadata: m } = projectDetails;
    if (!m.mainChallenge || !m.motivation || !m.siteOwnerName) return true;
    if (projectDetails.purpose === 'trees') {
      const tm = projectDetails.metadata;
      return !tm.mainInterventions?.length || !tm.employeesCount || !tm.longTermPlan
        || !tm.ecosystem || !tm.plantingDensity || !tm.degradationCause
        || !tm.siteOwnerType?.length;
    }
    const cm = projectDetails.metadata;
    return !cm.ecosystem || !cm.areaProtected || !cm.startingProtectionYear
      || !cm.ownershipType || !cm.landOwnershipType?.length || !cm.actions;
  })();

  const revisionAnnotations =
    projectDetails?.verificationStatus === 'revision_requested'
      ? (projectDetails.revisionRequest?.annotations ?? {})
      : {};
  const metaAnnotation = (field: string) =>
    revisionAnnotations[`metadata.${field}`];

  return (
    <CenteredContainer>
      <StyledForm>
        {projectDetails && (
          <ProjectLockedBanner
            verificationStatus={projectDetails.verificationStatus}
          />
        )}
        {savedDataIncomplete && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {tManageProjects('incompleteFieldsBanner')}
          </Alert>
        )}
        <div className="inputContainer">
          {purpose === 'trees' ? (
            <>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={
                  localeMapForDate[userLang]
                    ? localeMapForDate[userLang]
                    : localeMapForDate['en']
                }
              >
                <Controller
                  name="firstTreePlanted"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <MuiDatePicker
                      label={tManageProjects('labelRestorationStarted')}
                      value={value}
                      onChange={onChange}
                      renderInput={(props) => (
                        <TextField {...props} required />
                      )}
                      disableFuture
                      minDate={new Date(new Date().setFullYear(1950))}
                      inputFormat="d MMMM yyyy"
                      maxDate={new Date()}
                    />
                  )}
                />
              </LocalizationProvider>
            </>
          ) : (
            <InlineFormDisplayGroup>
              <Controller
                name="areaProtected"
                control={control}
                rules={{
                  required: tManageProjects('validation', {
                    fieldName: tManageProjects('areaProtected'),
                  }),
                  validate: (value) => (value ? parseInt(value, 10) > 0 : true),
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    required
                    label={tManageProjects('areaProtected')}
                    variant="outlined"
                    type="number"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    error={
                      'areaProtected' in errors &&
                      errors.areaProtected !== undefined
                    }
                    helperText={
                      'areaProtected' in errors &&
                      errors.areaProtected !== undefined &&
                      errors.areaProtected.message
                    }
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          title={tManageProjects('areaProtectedInfo')}
                          arrow
                        >
                          <span className={styles.tooltipIcon}>
                            <InfoIcon />
                          </span>
                        </Tooltip>
                      ),
                    }}
                  />
                )}
              />
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={
                  localeMapForDate[userLang]
                    ? localeMapForDate[userLang]
                    : localeMapForDate['en']
                }
              >
                <Controller
                  name="startingProtectionYear"
                  control={control}
                  rules={{
                    required: tManageProjects('validation', {
                      fieldName: tManageProjects('date'),
                    }),
                  }}
                  render={({ field: { value, onChange } }) => (
                    <MuiDatePicker
                      label={tManageProjects('protectionStartedIN')}
                      value={value}
                      onChange={onChange}
                      renderInput={(props) => (
                        <TextField
                          required
                          {...props}
                          error={
                            'startingProtectionYear' in errors &&
                            errors.startingProtectionYear !== undefined
                          }
                          helperText={
                            'startingProtectionYear' in errors &&
                            errors.startingProtectionYear !== undefined &&
                            errors.startingProtectionYear.message
                          }
                        />
                      )}
                      disableFuture
                      minDate={new Date(new Date().setFullYear(1950))}
                      views={['year']}
                      maxDate={new Date()}
                    />
                  )}
                />
              </LocalizationProvider>
            </InlineFormDisplayGroup>
          )}
          {metaAnnotation('areaProtected') && (
            <AnnotationCallout text={metaAnnotation('areaProtected')!} />
          )}
          {metaAnnotation('startingProtectionYear') && (
            <AnnotationCallout text={metaAnnotation('startingProtectionYear')!} />
          )}
          <InlineFormDisplayGroup>
            <Controller
              name="employeesCount"
              control={control}
              rules={{
                required: purpose === 'trees'
                  ? tManageProjects('validation', { fieldName: tManageProjects('employeeCount') })
                  : false,
                validate: (value) => !value || parseInt(value, 10) > 0,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  required={purpose === 'trees'}
                  label={tManageProjects('employeeCount')}
                  variant="outlined"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]./g, '');
                    onChange(e.target.value);
                  }}
                  value={value}
                  onBlur={onBlur}
                  error={errors.employeesCount !== undefined}
                  helperText={
                    errors.employeesCount !== undefined &&
                    errors.employeesCount.message
                  }
                  InputProps={{
                    endAdornment: (
                      <Tooltip
                        title={tManageProjects('employeesCountInfo')}
                        arrow
                      >
                        <span className={styles.tooltipIcon}>
                          <InfoIcon />
                        </span>
                      </Tooltip>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="ecosystem"
              control={control}
              rules={{
                required: tManageProjects('ecosystemType'),
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  required
                  label={tManageProjects('ecosystem')}
                  variant="outlined"
                  select
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors.ecosystem !== undefined}
                  helperText={
                    errors.ecosystem !== undefined && errors.ecosystem.message
                  }
                >
                  {ecosystemTypes.map((ecosystem) => (
                    <MenuItem key={ecosystem} value={ecosystem}>
                      {tManageProjects(`ecosystemTypes.${ecosystem}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </InlineFormDisplayGroup>
          {metaAnnotation('employeesCount') && (
            <AnnotationCallout text={metaAnnotation('employeesCount')!} />
          )}
          {metaAnnotation('ecosystem') && (
            <AnnotationCallout text={metaAnnotation('ecosystem')!} />
          )}
          {purpose === 'conservation' && (
            <InlineFormDisplayGroup>
              <Controller
                name="acquisitionYear"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={
                      localeMapForDate[userLang]
                        ? localeMapForDate[userLang]
                        : localeMapForDate['en']
                    }
                  >
                    <MuiDatePicker
                      label={tManageProjects('acquisitionYear')}
                      value={value}
                      onChange={onChange}
                      renderInput={(props) => <TextField {...props} />}
                      disableFuture
                      minDate={new Date(new Date().setFullYear(1950))}
                      views={['year']}
                      maxDate={new Date()}
                    />
                  </LocalizationProvider>
                )}
              />
              <Controller
                name="ownershipType"
                control={control}
                rules={{ required: tManageProjects('requiredField') }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    required
                    label={tManageProjects('ownershipType')}
                    variant="outlined"
                    select
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    error={
                      'ownershipType' in errors &&
                      errors.ownershipType !== undefined
                    }
                    helperText={
                      'ownershipType' in errors &&
                      errors.ownershipType !== undefined &&
                      errors.ownershipType.message
                    }
                  >
                    <MenuItem value="tenure">{tManageProjects('tenure')}</MenuItem>
                    <MenuItem value="rent">{tManageProjects('rent')}</MenuItem>
                  </TextField>
                )}
              />
            </InlineFormDisplayGroup>
          )}
          {metaAnnotation('acquisitionYear') && (
            <AnnotationCallout text={metaAnnotation('acquisitionYear')!} />
          )}
          {metaAnnotation('ownershipType') && (
            <AnnotationCallout text={metaAnnotation('ownershipType')!} />
          )}
          <div className={styles.multiSelectContainer}>
            <div className={styles.multiSelectField}>
              <p className={styles.multiSelectLabel}>
                {tManageProjects('labelMainInterventions') + (purpose === 'trees' ? '*' : '')}
              </p>
              {interventionOptions.map(([intervention, isSet]) => {
                return (
                  <div
                    className={styles.multiSelectInput}
                    key={intervention}
                    onClick={() => updateMainInterventions(intervention)}
                  >
                    <div
                      className={clsx(styles.multiSelectInputCheck, {
                        [styles.multiSelectInputCheckTrue]: isSet,
                      })}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13.02"
                        height="9.709"
                        viewBox="0 0 13.02 9.709"
                      >
                        <path
                          id="check-solid"
                          d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z"
                          transform="translate(0 -65.098)"
                          fill={colors.white}
                        />
                      </svg>
                    </div>
                    <p>
                      {tManageProjects(`interventionTypes.${intervention}`)}
                    </p>
                  </div>
                );
              })}
            </div>
            {isInterventionsMissing === true && purpose === 'trees' && (
              <span className={styles.formErrors}>
                {tManageProjects('missingInterventionsError')}
              </span>
            )}
            {metaAnnotation('mainInterventions') && (
              <AnnotationCallout text={metaAnnotation('mainInterventions')!} />
            )}
          </div>
          <div className={styles.multiSelectField}>
            <p className={styles.multiSelectLabel}>
              {' '}
              {purpose === 'trees'
                ? tManageProjects('labelRestorationSeasons')
                : tManageProjects('protectionSeasons')}{' '}
            </p>
            {plantingSeasons.map((month) => {
              return (
                <div
                  className={styles.multiSelectInput}
                  key={month.id}
                  onClick={() => {
                    handleSetPlantingSeasons(month.id);
                  }}
                >
                  <div
                    className={clsx(styles.multiSelectInputCheck, {
                      [styles.multiSelectInputCheckTrue]: month.isSet,
                    })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13.02"
                      height="9.709"
                      viewBox="0 0 13.02 9.709"
                    >
                      <path
                        id="check-solid"
                        d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z"
                        transform="translate(0 -65.098)"
                        fill={colors.white}
                      />
                    </svg>
                  </div>
                  <p>{month.title}</p>
                </div>
              );
            })}
          </div>
          {purpose === 'trees' ? (
            <>
              <InlineFormDisplayGroup spacing="none">
                {/* Integer - the planting density expressed in trees per ha */}
                <Controller
                  name="plantingDensity"
                  control={control}
                  rules={{
                    required: tManageProjects('requiredField'),
                    validate: (value) =>
                      !value || parseInt(value, 10) > 1,
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextField
                      label={tManageProjects('plantingDensity')}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <p className={styles.inputEndAdornment}>
                            {tManageProjects('treePerHa')}
                          </p>
                        ),
                      }}
                      onChange={(e) => {
                        setMinDensity(Number(e.target.value));
                        e.target.value = e.target.value.replace(/[^0-9]./g, '');
                        onChange(e.target.value);
                      }}
                      value={value}
                      onBlur={onBlur}
                      error={
                        'plantingDensity' in errors &&
                        errors.plantingDensity !== undefined
                      }
                      helperText={
                        'plantingDensity' in errors &&
                        errors.plantingDensity !== undefined &&
                        errors.plantingDensity.message
                      }
                    />
                  )}
                />
                <p className={styles.hyphen}>-</p>
                <Controller
                  name="maxPlantingDensity"
                  control={control}
                  rules={{
                    min: {
                      value: minDensity || 0,
                      message: tManageProjects('errorForMaxPlantingDensity'),
                    },
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextField
                      label={tManageProjects('maxPlantingDensity')}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <p className={styles.inputEndAdornment}>
                            {tManageProjects('treePerHa')}
                          </p>
                        ),
                      }}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]./g, '');
                        onChange(e.target.value);
                      }}
                      value={value}
                      onBlur={onBlur}
                      error={
                        'maxPlantingDensity' in errors &&
                        errors.maxPlantingDensity !== undefined
                      }
                      helperText={
                        'maxPlantingDensity' in errors &&
                        errors.maxPlantingDensity !== undefined &&
                        errors.maxPlantingDensity.message
                      }
                    />
                  )}
                />
              </InlineFormDisplayGroup>
            {metaAnnotation('plantingDensity') && (
              <AnnotationCallout text={metaAnnotation('plantingDensity')!} />
            )}

            </>
          ) : (
            <Controller
              name="actions"
              control={control}
              rules={{
                required: tManageProjects('requiredField'),
                maxLength: {
                  value: 300,
                  message: tManageProjects('max300Chars'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={tManageProjects('forestProtectionType')}
                  variant="outlined"
                  multiline
                  minRows={2}
                  maxRows={4}
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={'actions' in errors && errors.actions !== undefined}
                  helperText={
                    'actions' in errors &&
                    errors.actions !== undefined &&
                    errors.actions.message
                  }
                />
              )}
            />
          )}
          {purpose === 'trees' ? (
            <InlineFormDisplayGroup>
              <Controller
                name="degradationCause"
                control={control}
                rules={{
                  required: tManageProjects('requiredField'),
                  maxLength: {
                    value: 300,
                    message: tManageProjects('max300Chars'),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={tManageProjects('causeOfDegradation')}
                    variant="outlined"
                    multiline
                    minRows={2}
                    maxRows={4}
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                    error={
                      'degradationCause' in errors &&
                      errors.degradationCause !== undefined
                    }
                    helperText={
                      'degradationCause' in errors &&
                      errors.degradationCause &&
                      errors.degradationCause.message
                    }
                    InputProps={{
                      endAdornment: (
                        <Tooltip title={tManageProjects('max300Chars')} arrow>
                          <span className={styles.tooltipIcon}>
                            <InfoIcon />
                          </span>
                        </Tooltip>
                      ),
                    }}
                  />
                )}
              />
            </InlineFormDisplayGroup>
          ) : (
            <Controller
              name="benefits"
              control={control}
              rules={{
                maxLength: {
                  value: 300,
                  message: tManageProjects('max300Chars'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={tManageProjects('conservationImpacts')}
                  variant="outlined"
                  multiline
                  minRows={2}
                  maxRows={4}
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={'benefits' in errors && errors.benefits !== undefined}
                  helperText={
                    'benefits' in errors &&
                    errors.benefits !== undefined &&
                    errors.benefits.message
                  }
                />
              )}
            />
          )}
          {metaAnnotation('actions') && (
            <AnnotationCallout text={metaAnnotation('actions')!} />
          )}
          {metaAnnotation('degradationCause') && (
            <AnnotationCallout text={metaAnnotation('degradationCause')!} />
          )}
          {metaAnnotation('benefits') && (
            <AnnotationCallout text={metaAnnotation('benefits')!} />
          )}
          {/* the main challenge the project is facing (max. 300 characters) */}
          <Controller
            name="mainChallenge"
            control={control}
            rules={{
              required: tManageProjects('requiredField'),
              maxLength: {
                value: 300,
                message: tManageProjects('max300Chars'),
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={tManageProjects('mainChallenge')}
                variant="outlined"
                multiline
                minRows={2}
                maxRows={4}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.mainChallenge !== undefined}
                helperText={
                  errors.mainChallenge !== undefined &&
                  errors.mainChallenge.message
                }
                InputProps={{
                  endAdornment: (
                    <Tooltip title={tManageProjects('mainChallengeInfo')} arrow>
                      <span className={styles.tooltipIcon}>
                        <InfoIcon />
                      </span>
                    </Tooltip>
                  ),
                }}
              />
            )}
          />
          {metaAnnotation('mainChallenge') && (
            <AnnotationCallout text={metaAnnotation('mainChallenge')!} />
          )}
          {/* the reason this project has been created (max. 300 characters) */}
          <Controller
            name="motivation"
            control={control}
            rules={{
              required: tManageProjects('requiredField'),
              maxLength: {
                value: 300,
                message: tManageProjects('max300Chars'),
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={tManageProjects('whyThisSite')}
                variant="outlined"
                multiline
                minRows={2}
                maxRows={4}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.motivation !== undefined}
                helperText={
                  errors.motivation !== undefined && errors.motivation.message
                }
                InputProps={{
                  endAdornment: (
                    <Tooltip title={tManageProjects('max300Chars')} arrow>
                      <span className={styles.tooltipIcon}>
                        <InfoIcon />
                      </span>
                    </Tooltip>
                  ),
                }}
              />
            )}
          />
          {metaAnnotation('motivation') && (
            <AnnotationCallout text={metaAnnotation('motivation')!} />
          )}
          <Controller
            name="longTermPlan"
            control={control}
            rules={{
              required: purpose === 'trees' ? tManageProjects('requiredField') : false,
              maxLength: {
                value: 300,
                message: tManageProjects('max300Chars'),
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={tManageProjects('longTermPlan')}
                variant="outlined"
                multiline
                minRows={2}
                maxRows={4}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.longTermPlan !== undefined}
                helperText={
                  errors.longTermPlan !== undefined &&
                  errors.longTermPlan.message
                }
              />
            )}
          />
          {metaAnnotation('longTermPlan') && (
            <AnnotationCallout text={metaAnnotation('longTermPlan')!} />
          )}
          <div className={styles.multiSelectField}>
            <p className={styles.multiSelectLabel}>
              {tManageProjects('siteOwner')}
            </p>
            {siteOwners.map((owner) => {
              return (
                <div
                  className={styles.multiSelectInput}
                  style={{ width: 'fit-content' }}
                  key={owner.id}
                  onClick={() => handleSetSiteOwner(owner.id)}
                >
                  <div
                    className={clsx(styles.multiSelectInputCheck, {
                      [styles.multiSelectInputCheckTrue]: owner.isSet,
                    })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13.02"
                      height="9.709"
                      viewBox="0 0 13.02 9.709"
                    >
                      <path
                        id="check-solid"
                        d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z"
                        transform="translate(0 -65.098)"
                        fill={colors.white}
                      />
                    </svg>
                  </div>
                  <p>{owner.title}</p>
                </div>
              );
            })}
            {isSiteOwnerMissing === true && (
              <span className={styles.formErrors}>
                {tManageProjects('missingSiteOwnerError')}
              </span>
            )}
            {(metaAnnotation('siteOwnerType') || metaAnnotation('landOwnershipType')) && (
              <AnnotationCallout
                text={(metaAnnotation('siteOwnerType') || metaAnnotation('landOwnershipType'))!}
              />
            )}
          </div>
          <Controller
            name="siteOwnerName"
            control={control}
            rules={{ required: tManageProjects('requiredField') }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                required
                label={tManageProjects('ownerName')}
                variant="outlined"
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                error={errors.siteOwnerName !== undefined}
                helperText={errors.siteOwnerName?.message}
              />
            )}
          />
          {metaAnnotation('siteOwnerName') && (
            <AnnotationCallout text={metaAnnotation('siteOwnerName')!} />
          )}
          <ProjectCertificates
            projectGUID={projectGUID}
            token={token}
            setIsUploadingData={setIsUploadingData}
            userLang={userLang}
          />
        </div>

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_MEDIA)}
            variant="outlined"
            className="formButton"
            startIcon={<BackArrow />}
          >
            <p>{tManageProjects('backToMedia')}</p>
          </Button>

          {!isLocked && (
            <>
              <Button
                onClick={() => {
                  trigger();
                  void onSubmit(getValues() as TreeFormData | ConservationFormData);
                }}
                className="formButton"
                data-test-id="detailAnalysisCont"
                variant="contained"
              >
                {isUploadingData ? (
                  <div className={styles.spinner}></div>
                ) : (
                  tManageProjects('saveAndContinue')
                )}
              </Button>

              <Button
                className="formButton"
                variant="contained"
                onClick={() => handleNext(ProjectCreationTabs.PROJECT_SITES)}
              >
                {tManageProjects('skip')}
              </Button>
            </>
          )}
        </div>
      </StyledForm>
    </CenteredContainer>
  );
}

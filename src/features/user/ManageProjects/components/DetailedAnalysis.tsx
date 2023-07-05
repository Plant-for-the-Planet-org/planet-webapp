import React, { ReactElement } from 'react';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import styles from './../StepForm.module.scss';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import ProjectCertificates from './ProjectCertificates';
import InfoIcon from '../../../../../public/assets/images/icons/manageProjects/Info';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { useRouter } from 'next/router';
import { SxProps } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const dialogSx: SxProps = {
  '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected': {
    backgroundColor: themeProperties.primaryColor,
    color: '#fff',
  },

  '& .MuiPickersDay-dayWithMargin': {
    '&:hover': {
      backgroundColor: themeProperties.primaryColor,
      color: '#fff',
    },
  },
  '.MuiDialogActions-root': {
    paddingBottom: '12px',
  },
};

const yearDialogSx: SxProps = {
  '& .PrivatePickersYear-yearButton': {
    '&:hover': {
      backgroundColor: themeProperties.primaryColor,
      color: '#fff',
    },

    '&.Mui-selected': {
      backgroundColor: `${themeProperties.primaryColor} !important`,
      color: '#fff',
    },
  },
  '.MuiDialogActions-root': {
    paddingBottom: '12px',
  },
};

interface Props {
  handleNext: Function;
  handleBack: Function;
  projectDetails: Object;
  setProjectDetails: Function;
  projectGUID: String;
  handleReset: Function;
  token: any;
  userLang: String;
  purpose: String;
  siteOwnerName: String;
}
export default function DetailedAnalysis({
  handleBack,
  userLang,
  token,
  handleNext,
  projectDetails,
  setProjectDetails,
  projectGUID,
  handleReset,
  purpose,
}: Props): ReactElement {
  const { t, ready } = useTranslation(['manageProjects', 'common']);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();
  // TODO - simplify SiteOwner logic
  const [siteOwners, setSiteOwners] = React.useState([
    {
      id: 1,
      title: ready ? t('manageProjects:siteOwnerPrivate') : '',
      value: 'private',
      isSet: false,
    },
    {
      id: 2,
      title: ready ? t('manageProjects:siteOwnerPublic') : '',
      value: 'public-property',
      isSet: false,
    },
    {
      id: 3,
      title: ready ? t('manageProjects:siteOwnerSmallHolding') : '',
      value: 'smallholding',
      isSet: false,
    },
    {
      id: 4,
      title: ready ? t('manageProjects:siteOwnerCommunal') : '',
      value: 'communal-land',
      isSet: false,
    },
    {
      id: 5,
      title: ready ? t('manageProjects:siteOwnerOwned') : '',
      value: 'owned-by-owner',
      isSet: false,
    },
    {
      id: 6,
      title: ready ? t('manageProjects:siteOwnerOther') : '',
      value: 'other',
      isSet: false,
    },
  ]);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  // TODO - simplify Planting Season logic
  const [plantingSeasons, setPlantingSeasons] = React.useState([
    { id: 1, title: ready ? t('common:january') : '', isSet: false },
    { id: 2, title: ready ? t('common:february') : '', isSet: false },
    { id: 3, title: ready ? t('common:march') : '', isSet: false },
    { id: 4, title: ready ? t('common:april') : '', isSet: false },
    { id: 5, title: ready ? t('common:may') : '', isSet: false },
    { id: 6, title: ready ? t('common:june') : '', isSet: false },
    { id: 7, title: ready ? t('common:july') : '', isSet: false },
    { id: 8, title: ready ? t('common:august') : '', isSet: false },
    { id: 9, title: ready ? t('common:september') : '', isSet: false },
    { id: 10, title: ready ? t('common:october') : '', isSet: false },
    { id: 11, title: ready ? t('common:november') : '', isSet: false },
    { id: 12, title: ready ? t('common:december') : '', isSet: false },
  ]);

  const [minDensity, setMinDensity] = React.useState(0);

  const handleSetPlantingSeasons = (id: any) => {
    const month = plantingSeasons[id - 1];
    const updatedMonth = month;
    updatedMonth.isSet = !month.isSet;
    const plantingSeasonsUpdated = plantingSeasons;
    plantingSeasonsUpdated[id - 1] = updatedMonth;
    setPlantingSeasons([...plantingSeasonsUpdated]);
  };

  const handleSetSiteOwner = (id: any) => {
    const owner = siteOwners[id - 1];
    const updatedOwner = owner;
    updatedOwner.isSet = !owner.isSet;
    const updatedSiteOwners = siteOwners;
    updatedSiteOwners[id - 1] = updatedOwner;
    setSiteOwners([...updatedSiteOwners]);
  };
  const router = useRouter();

  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset(ready ? t('manageProjects:resetMessage') : '');
    }
  });

  // TODO - set up better types for Form Data
  const defaultDetailedAnalysis =
    purpose === 'trees'
      ? {
          yearAbandoned: new Date(),
          firstTreePlanted: '',
          plantingDensity: '',
          maxPlantingDensity: '',
          employeesCount: '',
          mainChallenge: '',
          siteOwnerType: '',
          siteOwnerName: '',
          acquisitionYear: '',
          degradationYear: '',
          degradationCause: '',
          longTermPlan: '',
          plantingSeasons: '',
          motivation: '',
        }
      : {
          actions: '',
          benefits: '',
          employeesCount: '',
          acquisitionYear: '',
          startingProtectionYear: '',
          areaProtected: '',
          siteOwnerType: '', //TODO - Simplify site owner logic
          siteOwnerName: '',
          mainChallenge: '',
          longTermPlan: '',
          motivation: '',
        };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    // TODO - set up better form types to resolve this error
    defaultValues: defaultDetailedAnalysis,
  });

  const owners = [];
  for (let i = 0; i < siteOwners.length; i++) {
    if (siteOwners[i].isSet) {
      owners.push(siteOwners[i].value);
    }
  }

  const months = [];
  for (let i = 0; i < plantingSeasons.length; i++) {
    if (plantingSeasons[i].isSet) {
      const j = i + 1;
      months.push(j);
    }
  }
  // for validating maxplanting density value > planting density value
  React.useEffect(() => {
    if (router.query.type === 'detail-analysis') {
      setMinDensity(projectDetails.metadata.plantingDensity);
    }
  }, [router.query.type]);

  const onSubmit = async (data: any) => {
    setIsUploadingData(true);
    const submitData =
      purpose === 'trees'
        ? {
            metadata: {
              degradationCause: data.degradationCause,
              degradationYear: data.degradationYear.getFullYear(),
              employeesCount: data.employeesCount,
              acquisitionYear: data.acquisitionYear.getFullYear(),
              longTermPlan: data.longTermPlan,
              mainChallenge: data.mainChallenge,
              motivation: data.motivation,
              plantingDensity: data.plantingDensity,
              maxPlantingDensity: data.maxPlantingDensity,
              plantingSeasons: months,
              siteOwnerName: data.siteOwnerName,
              siteOwnerType: owners,
              yearAbandoned: data.yearAbandoned.getFullYear()
                ? data.yearAbandoned.getFullYear()
                : null,
              firstTreePlanted: `${data.firstTreePlanted.getFullYear()}-${
                data.firstTreePlanted.getMonth() + 1
              }-${data.firstTreePlanted.getDate()}`,
            },
          }
        : {
            metadata: {
              acquisitionYear: data.acquisitionYear.getFullYear(),
              activitySeasons: months,
              areaProtected: data.areaProtected,
              employeesCount: data.employeesCount,
              startingProtectionYear: data.startingProtectionYear.getFullYear(),
              landOwnershipType: owners,
              actions: data.actions,
              mainChallenge: data.mainChallenge,
              motivation: data.motivation,
              longTermPlan: data.longTermPlan,
              benefits: data.benefits,
              siteOwnerName: data.siteOwnerName,
            },
          };

    try {
      const res = await putAuthenticatedRequest(
        `/app/projects/${projectGUID}`,
        submitData,
        token,
        logoutUser
      );
      setProjectDetails(res);
      setIsUploadingData(false);
      handleNext();
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  // Use Effect to hide error message after 10 seconds

  React.useEffect(() => {
    if (projectDetails) {
      const detailedAnalysis =
        purpose === 'trees'
          ? {
              acquisitionYear: projectDetails?.metadata?.acquisitionYear
                ? new Date(
                    new Date().setFullYear(
                      projectDetails?.metadata?.acquisitionYear
                    )
                  )
                : new Date(),
              yearAbandoned: projectDetails?.metadata?.yearAbandoned
                ? new Date(
                    new Date().setFullYear(
                      projectDetails?.metadata?.yearAbandoned
                    )
                  )
                : new Date(),
              plantingSeasons: projectDetails?.metadata?.plantingSeasons,
              plantingDensity: projectDetails?.metadata?.plantingDensity,
              maxPlantingDensity: projectDetails?.metadata?.maxPlantingDensity,
              employeesCount: projectDetails?.metadata?.employeesCount,
              siteOwnerName: projectDetails?.metadata?.siteOwnerName,
              degradationYear: projectDetails?.metadata?.degradationYear
                ? new Date(
                    new Date().setFullYear(
                      projectDetails?.metadata?.degradationYear
                    )
                  )
                : new Date(),
              degradationCause: projectDetails?.metadata?.degradationCause,

              firstTreePlanted: projectDetails?.metadata?.firstTreePlanted
                ? new Date(projectDetails?.metadata?.firstTreePlanted)
                : new Date(),
              mainChallenge: projectDetails?.metadata?.mainChallenge,
              longTermPlan: projectDetails?.metadata?.longTermPlan,
              motivation: projectDetails?.metadata?.motivation,
            }
          : {
              areaProtected: projectDetails?.metadata?.areaProtected,
              activitySeasons: projectDetails?.metadata?.plantingSeasons,
              startingProtectionYear: projectDetails?.metadata
                ?.startingProtectionYear
                ? new Date(
                    new Date().setFullYear(
                      projectDetails?.metadata?.startingProtectionYear
                    )
                  )
                : new Date(),
              acquisitionYear: projectDetails?.metadata?.acquisitionYear
                ? new Date(
                    new Date().setFullYear(
                      projectDetails.metadata?.acquisitionYear
                    )
                  )
                : new Date(),

              employeesCount: projectDetails?.metadata?.employeesCount,
              mainChallenge: projectDetails?.metadata?.mainChallenge,
              siteOwnerName: projectDetails?.metadata?.siteOwnerName,
              landOwnershipType: projectDetails?.metadata?.landOwnershipType,
              longTermPlan: projectDetails?.metadata?.longTermPlan,
              // ownershipType: projectDetails?.metadata?.ownershipType,
              benefits: projectDetails?.metadata?.benefits,
              actions: projectDetails?.metadata?.actions,
              motivation: projectDetails?.metadata?.motivation,
            };
      // set planting seasons

      if (purpose === 'trees') {
        if (
          projectDetails?.metadata?.plantingSeasons &&
          projectDetails?.metadata?.plantingSeasons.length > 0
        ) {
          const updatedPlantingSeasons = plantingSeasons;
          for (
            let i = 0;
            i < projectDetails.metadata?.plantingSeasons.length;
            i++
          ) {
            for (let j = 0; j < updatedPlantingSeasons.length; j++) {
              if (
                updatedPlantingSeasons[j].id ===
                projectDetails?.metadata?.plantingSeasons[i]
              ) {
                updatedPlantingSeasons[j].isSet = true;
              }
            }
          }
          setPlantingSeasons(updatedPlantingSeasons);
        }
      } else {
        if (
          projectDetails?.metadata?.activitySeasons &&
          projectDetails?.metadata?.activitySeasons.length > 0
        ) {
          const updatedActivitySeasons = plantingSeasons;
          for (
            let i = 0;
            i < projectDetails?.metadata?.activitySeasons.length;
            i++
          ) {
            for (let j = 0; j < updatedActivitySeasons.length; j++) {
              if (
                updatedActivitySeasons[j].id ===
                projectDetails?.metadata?.activitySeasons[i]
              ) {
                updatedActivitySeasons[j].isSet = true;
              }
            }
          }
          setPlantingSeasons(updatedActivitySeasons);
        }
      }

      // set owner type

      if (purpose === 'trees') {
        if (
          projectDetails?.metadata?.siteOwnerType &&
          projectDetails?.metadata?.siteOwnerType.length > 0
        ) {
          const newSiteOwners = siteOwners;
          for (
            let i = 0;
            i < projectDetails?.metadata?.siteOwnerType.length;
            i++
          ) {
            for (let j = 0; j < newSiteOwners.length; j++) {
              if (
                newSiteOwners[j].value ===
                projectDetails?.metadata?.siteOwnerType[i]
              ) {
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

      reset(detailedAnalysis);
    }
  }, [projectDetails]);

  return ready ? (
    <div className={styles.stepContainer}>
      {' '}
      <form
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
          {purpose === 'trees' ? (
            <div className={styles.formField}>
              <div className={`${styles.formFieldHalf} ${styles.formFieldFix}`}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={
                    localeMapForDate[userLang]
                      ? localeMapForDate[userLang]
                      : localeMapForDate['en']
                  }
                >
                  <Controller
                    name="yearAbandoned"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <MuiDatePicker
                        views={['year']}
                        value={value}
                        onChange={onChange}
                        label={t('manageProjects:yearOfAbandonment')}
                        renderInput={(props) => (
                          <MaterialTextField {...props} />
                        )}
                        disableFuture
                        minDate={new Date(new Date().setFullYear(1950))}
                        maxDate={new Date()}
                        DialogProps={{
                          sx: yearDialogSx,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
                <div className={styles.infoIconDiv}>
                  <div className={styles.popover}>
                    <InfoIcon />
                    <div className={styles.popoverContent}>
                      <p>{t('manageProjects:yearAbandonedInfo')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ width: '20px' }}></div>
              <div className={styles.formFieldHalf}>
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
                        label={t('manageProjects:firstTreePlanted')}
                        value={value}
                        onChange={onChange}
                        renderInput={(props) => (
                          <MaterialTextField {...props} />
                        )}
                        disableFuture
                        minDate={new Date(new Date().setFullYear(1950))}
                        inputFormat="d MMMM yyyy"
                        maxDate={new Date()}
                        DialogProps={{
                          sx: dialogSx,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
          ) : (
            <div className={styles.formField}>
              <div className={`${styles.formFieldHalf} ${styles.formFieldFix}`}>
                <Controller
                  name="areaProtected"
                  control={control}
                  rules={{
                    required: t('manageProjects:validation', {
                      fieldName: t('manageProjects:areaProtected'),
                    }),
                    validate: (value) => parseInt(value, 10) > 0,
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <MaterialTextField
                      label={t('manageProjects:areaProtected')}
                      variant="outlined"
                      type="number"
                      // onBlur={(e) => e.preventDefault()}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.areaProtected && (
                  <span className={styles.formErrors}>
                    {errors.areaProtected.message}
                  </span>
                )}
                <div className={styles.infoIconDiv}>
                  <div className={styles.popover}>
                    <InfoIcon />
                    <div className={styles.popoverContent}>
                      <p>{t('manageProjects:areaProtectedInfo')}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div style={{ width: '20px' }}></div> */}
              <div className={styles.formFieldHalf}>
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
                      required: t('manageProjects:validation', {
                        fieldName: t('manageProjects:date'),
                      }),
                    }}
                    render={({ field: { value, onChange } }) => (
                      <MuiDatePicker
                        label={t('manageProjects:protectionStartedIN')}
                        value={value}
                        onChange={onChange}
                        renderInput={(props) => (
                          <MaterialTextField {...props} />
                        )}
                        disableFuture
                        minDate={new Date(new Date().setFullYear(1950))}
                        views={['year']}
                        maxDate={new Date()}
                        DialogProps={{
                          sx: yearDialogSx,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.startingProtectionYear && (
                  <span className={styles.formErrors}>
                    {errors.startingProtectionYear.message}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className={styles.formField}>
            <div className={`${styles.formFieldHalf} ${styles.formFieldFix}`}>
              <Controller
                name="employeesCount"
                control={control}
                rules={{
                  required: t('manageProjects:validation', {
                    fieldName: t('manageProjects:employeeCount'),
                  }),
                  validate: (value) => parseInt(value, 10) > 0,
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    label={t('manageProjects:employeeCount')}
                    variant="outlined"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]./g, '');
                      onChange(e.target.value);
                    }}
                    value={value}
                    onBlur={onBlur}
                  />
                )}
              />

              {errors.employeesCount && (
                <span className={styles.formErrors}>
                  {errors.employeesCount.message}
                </span>
              )}
              <div className={styles.infoIconDiv}>
                <div className={styles.popover}>
                  <InfoIcon />
                  <div className={styles.popoverContent}>
                    <p>{t('manageProjects:employeesCountInfo')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ width: '20px' }}></div>
            <div className={styles.formFieldHalf}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={
                  localeMapForDate[userLang]
                    ? localeMapForDate[userLang]
                    : localeMapForDate['en']
                }
              >
                <Controller
                  name="acquisitionYear"
                  control={control}
                  rules={{
                    required: t('manageProjects:validation', {
                      fieldName: t('manageProjects:acquisitionYear'),
                    }),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <MuiDatePicker
                      label={t('manageProjects:acquisitionYear')}
                      value={value}
                      onChange={onChange}
                      renderInput={(props) => <MaterialTextField {...props} />}
                      disableFuture
                      minDate={new Date(new Date().setFullYear(1950))}
                      views={['year']}
                      maxDate={new Date()}
                      DialogProps={{
                        sx: yearDialogSx,
                      }}
                    />
                  )}
                />
                {errors.startingProtectionYear && (
                  <span className={styles.formErrors}>
                    {errors.startingProtectionYear.message}
                  </span>
                )}
              </LocalizationProvider>
            </div>
          </div>

          <div className={styles.formFieldLarge}>
            <div className={styles.plantingSeasons}>
              <p className={styles.plantingSeasonsLabel}>
                {' '}
                {purpose === 'trees'
                  ? t('manageProjects:plantingSeasons')
                  : t('manageProjects:protectionSeasons')}{' '}
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
                      className={`${styles.multiSelectInputCheck} ${
                        month.isSet ? styles.multiSelectInputCheckTrue : ''
                      }`}
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
                          fill="#fff"
                        />
                      </svg>
                    </div>
                    <p style={{ color: 'var(--dark)' }}>{month.title}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {purpose === 'trees' ? (
            <div className={styles.formField}>
              <div className={styles.density}>
                <div
                  className={styles.formFieldHalf}
                  data-test-id="plantingDensity"
                >
                  {/* Integer - the planting density expressed in trees per ha */}
                  <Controller
                    name="plantingDensity"
                    control={control}
                    rules={{
                      required: t('manageProjects:plantingDensityValidation'),
                      validate: (value) => parseInt(value, 10) > 1,
                    }}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <MaterialTextField
                        label={t('manageProjects:plantingDensity')}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <p className={styles.inputEndAdornment}>
                              {t('manageProjects:treePerHa')}
                            </p>
                          ),
                        }}
                        onChange={(e) => {
                          setMinDensity(Number(e.target.value));
                          e.target.value = e.target.value.replace(
                            /[^0-9]./g,
                            ''
                          );
                          onChange(e.target.value);
                        }}
                        value={value}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {errors.plantingDensity && (
                    <span className={styles.formErrors}>
                      {errors.plantingDensity.message}
                    </span>
                  )}
                </div>
                <div className={styles.hyphen}>-</div>
                <div
                  className={styles.formFieldHalf}
                  data-test-id="maxPlantingDensity"
                >
                  <Controller
                    name="maxPlantingDensity"
                    control={control}
                    rules={{
                      min: {
                        value: minDensity,
                        message: t('manageProjects:errorForMaxPlantingDensity'),
                      },
                    }}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <MaterialTextField
                        label={t('manageProjects:maxPlantingDensity')}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <p className={styles.inputEndAdornment}>
                              {t('manageProjects:treePerHa')}
                            </p>
                          ),
                        }}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]./g,
                            ''
                          );
                          onChange(e.target.value);
                        }}
                        value={value}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {errors.maxPlantingDensity && (
                    <span className={styles.formErrors}>
                      {errors.maxPlantingDensity.message}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ width: '20px' }}></div>
              <div className={styles.formFieldLarge} style={{ width: '100%' }}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={
                    localeMapForDate[userLang]
                      ? localeMapForDate[userLang]
                      : localeMapForDate['en']
                  }
                >
                  <Controller
                    name="degradationYear"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <MuiDatePicker
                        views={['year']}
                        value={value}
                        onChange={onChange}
                        label={t('manageProjects:yearOfDegradation')}
                        renderInput={(props) => (
                          <MaterialTextField {...props} />
                        )}
                        disableFuture
                        minDate={new Date(new Date().setFullYear(1950))}
                        maxDate={new Date()}
                        DialogProps={{
                          sx: yearDialogSx,
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
          ) : (
            <div className={`${styles.formFieldLarge} ${styles.formFieldFix}`}>
              <Controller
                name="actions"
                control={control}
                rules={{
                  maxLength: {
                    value: 300,
                    message: t('manageProjects:max300Chars'),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    label={t('manageProjects:forestProtectionType')}
                    variant="outlined"
                    multiline
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                  />
                )}
              />
            </div>
          )}
          {purpose === 'trees' ? (
            <div className={`${styles.formFieldLarge} ${styles.formFieldFix}`}>
              <Controller
                name="degradationCause"
                control={control}
                rules={{
                  maxLength: {
                    value: 300,
                    message: t('manageProjects:max300Chars'),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    label={t('manageProjects:causeOfDegradation')}
                    variant="outlined"
                    multiline
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.degradationCause && (
                <span className={styles.formErrors}>
                  {errors.degradationCause.message}
                </span>
              )}

              <div className={styles.causeOfDegradation}>
                <div className={styles.popover}>
                  <InfoIcon />
                  <div className={styles.popoverContent}>
                    <p>{t('manageProjects:max300Chars')}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${styles.formFieldLarge} ${styles.formFieldFix}`}>
              <Controller
                name="benefits"
                control={control}
                rules={{
                  maxLength: {
                    value: 300,
                    message: t('manageProjects:max300Chars'),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    label={t('manageProjects:conservationImpacts')}
                    variant="outlined"
                    multiline
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.benefits && (
                <span className={styles.formErrors}>
                  {errors.benefits.message}
                </span>
              )}
            </div>
          )}

          <div className={styles.formField}>
            <div className={`${styles.formFieldHalf} ${styles.formFieldFix}`}>
              {/* the main challenge the project is facing (max. 300 characters) */}
              <Controller
                name="mainChallenge"
                control={control}
                rules={{
                  maxLength: {
                    value: 300,
                    message: t('manageProjects:max300Chars'),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    label={t('manageProjects:mainChallenge')}
                    variant="outlined"
                    multiline
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.mainChallenge && (
                <span className={styles.formErrors}>
                  {errors.mainChallenge.message}
                </span>
              )}
              <div className={styles.infoIconDiv}>
                <div className={styles.popover}>
                  <InfoIcon />
                  <div className={styles.popoverContent}>
                    <p>{t('manageProjects:mainChallengeInfo')}</p>
                    <br />
                    <p>{t('manageProjects:max300Chars')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ width: '20px' }}></div>
            <div className={`${styles.formFieldHalf} ${styles.formFieldFix}`}>
              {/* the reason this project has been created (max. 300 characters) */}
              <Controller
                name="motivation"
                control={control}
                rules={{
                  maxLength: {
                    value: 300,
                    message: t('manageProjects:max300Chars'),
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    label={t('manageProjects:whyThisSite')}
                    variant="outlined"
                    multiline
                    onChange={onChange}
                    value={value}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.motivation && (
                <span className={styles.formErrors}>
                  {errors.motivation.message}
                </span>
              )}
              <div className={styles.infoIconDiv}>
                <div className={styles.popover}>
                  <InfoIcon />
                  <div className={styles.popoverContent}>
                    <p>{t('manageProjects:max300Chars')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formFieldLarge}>
            <div className={styles.plantingSeasons}>
              <p className={styles.plantingSeasonsLabel}>
                {t('manageProjects:siteOwner')}
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
                      className={`${styles.multiSelectInputCheck} ${
                        owner.isSet ? styles.multiSelectInputCheckTrue : ''
                      }`}
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
                          fill="#fff"
                        />
                      </svg>
                    </div>
                    <p style={{ color: 'var(--dark)' }}>{owner.title}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${styles.formFieldLarge} ${styles.formFieldFix}`}>
            <Controller
              name="siteOwnerName"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <MaterialTextField
                  label={t('manageProjects:ownerName')}
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
            />
          </div>

          <div className={`${styles.formFieldLarge} ${styles.formFieldFix}`}>
            {/* <Controller
              name="longTermPlan"
              control={control}
              rules={{
                maxLength: {
                  value: 300,
                  message: t('manageProjects:max300Chars'),
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <MaterialTextField
                  label={t('manageProjects:longTermPlan')}
                  variant="outlined"
                  multiline
                  onChange={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
            /> */}
            {errors.longTermPlan && (
              <span className={styles.formErrors}>
                {errors.longTermPlan.message}
              </span>
            )}
          </div>

          <ProjectCertificates
            projectGUID={projectGUID}
            token={token}
            setIsUploadingData={setIsUploadingData}
            userLang={userLang}
          />

          <div className={styles.formFieldLarge} style={{ marginTop: '48px' }}>
            <div className={`${styles.formFieldHalf}`}>
              <button onClick={handleBack} className="secondaryButton">
                <BackArrow />
                <p>{t('manageProjects:backToMedia')}</p>
              </button>
            </div>
            <div style={{ width: '20px' }}></div>
            <div className={styles.formFieldHalf}>
              <button
                onClick={handleSubmit(onSubmit)}
                className={`primaryButton ${styles.saveAndContinueDetailAnalysis}`}
                data-test-id="detailAnalysisCont"
              >
                {isUploadingData ? (
                  <div className={styles.spinner}></div>
                ) : (
                  t('manageProjects:saveAndContinue')
                )}
              </button>
            </div>
            <div className={`${styles.formFieldHalf}`}>
              <button
                className={`primaryButton ${styles.skipDetailAnalysis}`}
                onClick={handleNext}
              >
                {t('manageProjects:skip')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <></>
  );
}

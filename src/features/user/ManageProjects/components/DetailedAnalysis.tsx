import React, { ReactElement } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import styles from './../StepForm.module.scss';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import ProjectCertificates from './ProjectCertificates';
import InfoIcon from '../../../../../public/assets/images/icons/manageProjects/Info';
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';
import { SxProps, TextField, Button } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';
import { ThemeContext } from '../../../../theme/themeContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ProjectCreationTabs } from '..';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';

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
  const { theme } = React.useContext(ThemeContext);
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

  const useStylesAutoComplete = makeStyles({
    root: {
      color:
        theme === 'theme-light'
          ? `${themeProperties.light.primaryFontColor} !important`
          : `${themeProperties.dark.primaryFontColor} !important`,
      backgroundColor:
        theme === 'theme-light'
          ? `${themeProperties.light.backgroundColor} !important`
          : `${themeProperties.dark.backgroundColor} !important`,
    },
    option: {
      // color: '#2F3336',
      '&:hover': {
        backgroundColor:
          theme === 'theme-light'
            ? `${themeProperties.light.backgroundColorDark} !important`
            : `${themeProperties.dark.backgroundColorDark} !important`,
      },
    },
  });

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

  const defaultDetailedAnalysis =
    purpose === 'trees'
      ? {
          yearAbandoned: '',
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
          employeesCount: '',
          acquisitionYear: '',
          protectionStartedYear: '',
          areaProtected: '',
          employeeCount: '',
          timePeriod: '',
          forestProtectionType: '',
          conservationImpacts: '',
          siteOwnerType: '',
          siteOwnerName: '',
          mainChallenge: '',
          longTermPlan: '',
          endangeredSpecies: '',
          addAnotherSpecies: '',
          motivation: '',
        };

  const { register, handleSubmit, errors, control, reset } = useForm({
    mode: 'onBlur',
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
              siteOwnerName: projectDetails?.metadata?.siteOwnerName,
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
    <CenteredContainer>
      {' '}
      <StyledForm>
        {purpose === 'trees' ? (
          <>
            <InlineFormDisplayGroup>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={
                  localeMapForDate[userLang]
                    ? localeMapForDate[userLang]
                    : localeMapForDate['en']
                }
              >
                <Controller
                  render={(properties) => (
                    <MuiDatePicker
                      views={['year']}
                      value={properties.value}
                      onChange={properties.onChange}
                      label={t('manageProjects:yearOfAbandonment')}
                      renderInput={(props) => <TextField {...props} />}
                      autoOk
                      disableFuture
                      minDate={new Date(new Date().setFullYear(1950))}
                      maxDate={new Date()}
                      DialogProps={{
                        sx: yearDialogSx,
                      }}
                    />
                  )}
                  name="yearAbandoned"
                  control={control}
                  defaultValue={new Date()}
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

              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={
                  localeMapForDate[userLang]
                    ? localeMapForDate[userLang]
                    : localeMapForDate['en']
                }
              >
                <Controller
                  render={(properties) => (
                    <MuiDatePicker
                      label={t('manageProjects:firstTreePlanted')}
                      value={properties.value}
                      onChange={properties.onChange}
                      renderInput={(props) => (
                        <TextField {...props} className="besideInfoTag" />
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
                  name="firstTreePlanted"
                  control={control}
                />
              </LocalizationProvider>
            </InlineFormDisplayGroup>
          </>
        ) : (
          <InlineFormDisplayGroup>
            <TextField
              inputRef={register({
                required: {
                  value: true,
                  message: t('manageProjects:validation', {
                    fieldName: t('manageProjects:areaProtected'),
                  }),
                },
                validate: (value) => parseInt(value, 10) > 0,
              })}
              label={t('manageProjects:areaProtected')}
              variant="outlined"
              name="areaProtected"
              type="number"
              onBlur={(e) => e.preventDefault()}
              error={errors.areaProtected}
              helperText={errors.areaProtected && errors.areaProtected.message}
            />
            <div className={styles.infoIconDiv}>
              <div className={styles.popover}>
                <InfoIcon />
                <div className={styles.popoverContent}>
                  <p>{t('manageProjects:areaProtectedInfo')}</p>
                </div>
              </div>
            </div>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={
                localeMapForDate[userLang]
                  ? localeMapForDate[userLang]
                  : localeMapForDate['en']
              }
            >
              <Controller
                render={(properties) => (
                  <MuiDatePicker
                    inputRef={register({
                      required: {
                        value: true,
                        message: t('manageProjects:validation', {
                          fieldName: t('manageProjects:date'),
                        }),
                      },
                    })}
                    label={t('manageProjects:protectionStartedIN')}
                    value={properties.value}
                    onChange={properties.onChange}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        error={errors?.startingProtectionYear}
                        helperText={
                          errors?.startingProtectionYear &&
                          errors?.startingProtectionYear.message
                        }
                      />
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
                name="startingProtectionYear"
                control={control}
                rules={{
                  required: t('manageProjects:validation', {
                    fieldName: t('manageProjects:date'),
                  }),
                }}
                // defaultValue=""
              />
            </LocalizationProvider>
          </InlineFormDisplayGroup>
        )}

        <InlineFormDisplayGroup>
          <TextField
            inputRef={register({
              required: {
                value: true,
                message: t('manageProjects:validation', {
                  fieldName: t('manageProjects:employeeCount'),
                }),
              },
              validate: (value) => parseInt(value, 10) > 0,
            })}
            label={t('manageProjects:employeeCount')}
            variant="outlined"
            name="employeesCount"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]./g, '');
            }}
            error={errors.employeesCount}
            helperText={errors.employeesCount && errors.employeesCount.message}
          />

          <div className={styles.infoIconDiv}>
            <div className={styles.popover}>
              <InfoIcon />
              <div className={styles.popoverContent}>
                <p>{t('manageProjects:employeesCountInfo')}</p>
              </div>
            </div>
          </div>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            locale={
              localeMapForDate[userLang]
                ? localeMapForDate[userLang]
                : localeMapForDate['en']
            }
          >
            <Controller
              render={(properties) => (
                <MuiDatePicker
                  inputRef={register({
                    required: {
                      value: true,
                      message: t('manageProjects:employeeCountValidation'),
                    },
                  })}
                  label={t('manageProjects:acquisitionYear')}
                  value={properties.value}
                  onChange={properties.onChange}
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      error={errors.startingProtectionYear}
                      helperText={
                        errors.startingProtectionYear &&
                        errors.startingProtectionYear.message
                      }
                    />
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
              name="acquisitionYear"
              control={control}
              rules={{
                required: t('manageProjects:validation', {
                  fieldName: t('manageProjects:acquisitionYear'),
                }),
              }}
              // defaultValue=""
            />
          </LocalizationProvider>
        </InlineFormDisplayGroup>

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

        {purpose === 'trees' ? (
          <>
            <InlineFormDisplayGroup>
              <TextField
                label={t('manageProjects:plantingDensity')}
                variant="outlined"
                name="plantingDensity"
                inputRef={register({
                  required: {
                    value: true,
                    message: t('manageProjects:plantingDensityValidation'),
                  },
                  validate: (value) => parseInt(value, 10) > 1,
                })}
                onInput={(e) => {
                  setMinDensity(e.target.value);
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                InputProps={{
                  endAdornment: (
                    <p className={styles.inputEndAdornment}>
                      {t('manageProjects:treePerHa')}
                    </p>
                  ),
                }}
                error={errors.plantingDensity}
                helperText={
                  errors.plantingDensity && errors.plantingDensity.message
                }
              />
              <p className={styles.hyphen}>-</p>
              <TextField
                label={t('manageProjects:maxPlantingDensity')}
                variant="outlined"
                name="maxPlantingDensity"
                inputRef={register({
                  min: {
                    value: minDensity,
                    message: t('manageProjects:errorForMaxPlantingDensity'),
                  },
                  required: false,
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                InputProps={{
                  endAdornment: (
                    <p className={styles.inputEndAdornment}>
                      {' '}
                      {t('manageProjects:treePerHa')}
                    </p>
                  ),
                }}
                error={errors.maxPlantingDensity}
                helperText={
                  errors.maxPlantingDensity && errors.maxPlantingDensity.message
                }
              />
            </InlineFormDisplayGroup>

            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={
                localeMapForDate[userLang]
                  ? localeMapForDate[userLang]
                  : localeMapForDate['en']
              }
            >
              <Controller
                render={(properties) => (
                  <MuiDatePicker
                    views={['year']}
                    value={properties.value}
                    onChange={properties.onChange}
                    label={t('manageProjects:yearOfDegradation')}
                    renderInput={(props) => <TextField {...props} />}
                    disableFuture
                    minDate={new Date(new Date().setFullYear(1950))}
                    maxDate={new Date()}
                    DialogProps={{
                      sx: yearDialogSx,
                    }}
                  />
                )}
                name="degradationYear"
                control={control}
                defaultValue=""
              />
            </LocalizationProvider>
          </>
        ) : (
          <TextField
            inputRef={register({
              maxLength: {
                value: 300,
                message: t('manageProjects:max300Chars'),
              },
            })}
            label={t('manageProjects:forestProtectionType')}
            variant="outlined"
            name="actions"
            multiline
          />
        )}
        {purpose === 'trees' ? (
          <InlineFormDisplayGroup>
            <TextField
              label={t('manageProjects:causeOfDegradation')}
              variant="outlined"
              name="degradationCause"
              multiline
              inputRef={register({
                maxLength: {
                  value: 300,
                  message: t('manageProjects:max300Chars'),
                },
              })}
              error={errors.degradationCause}
              helperText={
                errors.degradationCause && errors.degradationCause.message
              }
            />

            <div className={styles.infoIconDivForLargeField}>
              <div className={styles.popover}>
                <InfoIcon />
                <div className={styles.popoverContent}>
                  <p>{t('manageProjects:max300Chars')}</p>
                </div>
              </div>
            </div>
          </InlineFormDisplayGroup>
        ) : (
          <TextField
            label={t('manageProjects:conservationImpacts')}
            variant="outlined"
            name="benefits"
            multiline
            inputRef={register({
              maxLength: {
                value: 300,
                message: t('manageProjects:max300Chars'),
              },
            })}
            error={errors.degradationCause}
            helperText={
              errors.degradationCause && errors.degradationCause.message
            }
          />
        )}

        <InlineFormDisplayGroup>
          {/* the main challenge the project is facing (max. 300 characters) */}
          <TextField
            inputRef={register({
              maxLength: {
                value: 300,
                message: t('manageProjects:max300Chars'),
              },
            })}
            label={t('manageProjects:mainChallenge')}
            variant="outlined"
            name="mainChallenge"
            multiline
            error={errors.mainChallenge}
            helperText={errors.mainChallenge && errors.mainChallenge.message}
          />

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

          {/* the reason this project has been created (max. 300 characters) */}
          <TextField
            inputRef={register({
              maxLength: {
                value: 300,
                message: t('manageProjects:max300Chars'),
              },
            })}
            label={t('manageProjects:whyThisSite')}
            variant="outlined"
            name="motivation"
            multiline
            error={errors.motivation}
            helperText={errors.motivation && errors.motivation.message}
          />

          <div className={styles.infoIconDiv}>
            <div className={styles.popover}>
              <InfoIcon />
              <div className={styles.popoverContent}>
                <p>{t('manageProjects:max300Chars')}</p>
              </div>
            </div>
          </div>
        </InlineFormDisplayGroup>

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

        <TextField
          label={t('manageProjects:ownerName')}
          variant="outlined"
          name="siteOwnerName"
          inputRef={register()}
        />

        <TextField
          label={t('manageProjects:longTermPlan')}
          variant="outlined"
          name="longTermPlan"
          multiline
          inputRef={register({
            maxLength: {
              value: 300,
              message: t('manageProjects:max300Chars'),
            },
          })}
          error={errors.longTermPlan}
          helperText={errors.longTermPlan && errors.longTermPlan.message}
        />

        <ProjectCertificates
          projectGUID={projectGUID}
          token={token}
          setIsUploadingData={setIsUploadingData}
          userLang={userLang}
        />
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_MEDIA)}
            variant="outlined"
            className={styles.backButton}
          >
            <BackArrow />
            <p>{t('manageProjects:backToMedia')}</p>
          </Button>

          <Button
            onClick={handleSubmit(onSubmit)}
            className={styles.saveAndContinueButton}
            data-test-id="detailAnalysisCont"
            variant="contained"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              t('manageProjects:saveAndContinue')
            )}
          </Button>

          <Button
            className={styles.skipButton}
            variant="contained"
            onClick={() => handleNext(ProjectCreationTabs.PROJECT_SITES)}
          >
            {t('manageProjects:skip')}
          </Button>
        </div>
      </StyledForm>
    </CenteredContainer>
  ) : (
    <></>
  );
}

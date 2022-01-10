import React, { ReactElement } from 'react'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm, Controller } from 'react-hook-form';
import i18next from './../../../../../i18n'
import styles from './../StepForm.module.scss'
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import DateFnsUtils from '@date-io/date-fns';
import {
    DatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';
import InfoIcon from './../../../../../public/assets/images/icons/manageProjects/Info'
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import materialTheme from '../../../../theme/themeStyles';
import { MenuItem, makeStyles } from '@material-ui/core';
import { ThemeContext } from '../../../../theme/themeContext';
import themeProperties from '../../../../theme/themeProperties';
import { type } from 'os';

const { useTranslation } = i18next;

interface Props {
    handleNext: Function;
    handleBack: Function;
    projectDetails: Object;
    setProjectDetails: Function;
    projectGUID: String;
    handleReset: Function;
    token: any;
    userLang: String;
}
export default function DetailedConservationAnalysis({ handleBack, userLang, token, handleNext, projectDetails, setProjectDetails, projectGUID, handleReset }: Props): ReactElement {
    const { t, i18n, ready } = useTranslation(['manageProjects', 'common']);
    const { theme } = React.useContext(ThemeContext)
    const useStylesAutoComplete = makeStyles({
        root: {
            color:
                theme === "theme-light"
                    ? `${themeProperties.light.primaryFontColor} !important`
                    : `${themeProperties.dark.primaryFontColor} !important`,
            backgroundColor:
                theme === "theme-light"
                    ? `${themeProperties.light.backgroundColor} !important`
                    : `${themeProperties.dark.backgroundColor} !important`,
        },
        option: {
            // color: '#2F3336',
            "&:hover": {
                backgroundColor:
                    theme === "theme-light"
                        ? `${themeProperties.light.backgroundColorDark} !important`
                        : `${themeProperties.dark.backgroundColorDark} !important`,
            },
        }
    })
    const [plantingSeasons, setPlantingSeasons] = React.useState([
        { id: 0, title: ready ? t('common:january') : '', isSet: false },
        { id: 1, title: ready ? t('common:february') : '', isSet: false },
        { id: 2, title: ready ? t('common:march') : '', isSet: false },
        { id: 3, title: ready ? t('common:april') : '', isSet: false },
        { id: 4, title: ready ? t('common:may') : '', isSet: false },
        { id: 5, title: ready ? t('common:june') : '', isSet: false },
        { id: 6, title: ready ? t('common:july') : '', isSet: false },
        { id: 7, title: ready ? t('common:august') : '', isSet: false },
        { id: 8, title: ready ? t('common:september') : '', isSet: false },
        { id: 9, title: ready ? t('common:october') : '', isSet: false },
        { id: 10, title: ready ? t('common:november') : '', isSet: false },
        { id: 11, title: ready ? t('common:december') : '', isSet: false }
    ])
    const classes = useStylesAutoComplete();
    const [siteOwners, setSiteOwners] = React.useState([
        { id: 1, title: ready ? t('manageProjects:siteOwnerPrivate') : '', value: 'private', isSet: false },
        { id: 2, title: ready ? t('manageProjects:siteOwnerPublic') : '', value: 'public-property', isSet: false },
        { id: 3, title: ready ? t('manageProjects:siteOwnerSmallHolding') : '', value: 'smallholding', isSet: false },
        { id: 4, title: ready ? t('manageProjects:siteOwnerCommunal') : '', value: 'communal-land', isSet: false },
        { id: 5, title: ready ? t('manageProjects:siteOwnerOwned') : '', value: 'owned-by-owner', isSet: false },
        { id: 6, title: ready ? t('manageProjects:siteOwnerOther') : '', value: 'other', isSet: false }
    ])
    const landOwnershipType = [
        {
            label: ready ? t('manageProjects:siteOwnerPrivate') : '',
            value: 'private',
        },
        {
            label: ready ? t('manageProjects:siteOwnerPublic') : '',
            value: 'public-property',
        },
        {
            label: ready ? t('manageProjects:siteOwnerSmallHolding') : '',
            value: 'smallholding',
        },
        {
            label: ready ? t('manageProjects:siteOwnerCommunal') : '',
            value: 'communal-land',
        },
        {
            label: ready ? t('manageProjects:siteOwnerOwned') : '',
            value: 'owned-by-owner',
        },
    ]
    const ownershipType = [
        {
            label: ready ? t('manageProjects:tenure') : '',
            value: 'tenure',
        },
        {
            label: ready ? t('manageProjects:rent') : '',
            value: 'rent'
        },
    ]
    const [isUploadingData, setIsUploadingData] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')

    const handleSetPlantingSeasons = (id: any) => {
        const month = plantingSeasons[id];
        const newMonth = month;
        newMonth.isSet = !month.isSet;
        const plantingSeasonsNew = plantingSeasons;
        plantingSeasonsNew[id] = newMonth;
        setPlantingSeasons([...plantingSeasonsNew]);
    }

    const handleSetSiteOwner = (id: any) => {
        const owner = siteOwners[id - 1];
        const newOwner = owner;
        newOwner.isSet = !owner.isSet;
        const newSiteOwners = siteOwners;
        newSiteOwners[id - 1] = newOwner;
        setSiteOwners([...newSiteOwners]);
    }

    React.useEffect(() => {
        if (!projectGUID || projectGUID === '') {
            handleReset(ready ? t('manageProjects:resetMessage') : '')
        }
    })


    const { register, handleSubmit, errors, control, reset, setValue, watch } = useForm({ mode: 'onBlur' });

    const onSubmit = (data: any) => {
        setIsUploadingData(true)
        const months = [];
        for (let i = 0; i < plantingSeasons.length; i++) {
            if (plantingSeasons[i].isSet) {
                const j = i + 1;
                months.push(j)
            }
        }

        const owners = [];
        for (let i = 0; i < siteOwners.length; i++) {
            if (siteOwners[i].isSet) {
                owners.push(siteOwners[i].value)
            }
        }
        const submitData = {
            projectMeta: {
                location: data.location,
                areaProtected: data.areaProtected,
                employeeCount: data.employeeCount,
                startingProtectionYear: data.startingProtectionYear.getFullYear(),
                actions: data.actions,
                activitySeasons: months,
                mainChallenge: data.mainChallenge,
                motivation: data.motivation,
                longTermPlan: data.longTermPlan,
                landOwnershipType: owners,
                ownershipType: data.ownershipType
            }

        }

        putAuthenticatedRequest(`/app/projects/${projectGUID}`, submitData, token).then((res) => {
            if (!res.code) {
                setProjectDetails(res)
                setIsUploadingData(false)
                setErrorMessage('')
                handleNext()
            } else {
                if (res.code === 404) {
                    setIsUploadingData(false)
                    setErrorMessage(ready ? t('manageProjects:projectNotFound') : '')
                }
                else {
                    setIsUploadingData(false)
                    setErrorMessage(res.message)
                }

            }
        })
    };


    // Use Effect to hide error message after 10 seconds

    React.useEffect(() => {
        if (projectDetails) {
            // ? new Date(new Date().setFullYear(projectDetails.yearAbandoned)) : new Date()
            const defaultDetailedAnalysisData = {
                projectMeta: {
                    location: projectDetails.location,
                    areaProtected: projectDetails.areaProtected,
                    startingProtectionYear: projectDetails.startingProtectionYear ? new Date(new Date().setFullYear(projectDetails.startingProtectionYear)) : new Date(),
                    actions: projectDetails.actions,
                    activitySeasons: projectDetails.activitySeasons,
                    employeeCount: projectDetails.employeeCount,
                    mainChallenge: projectDetails.mainChallenge,
                    motivation: projectDetails.motivation,
                    longTermPlan: projectDetails.longTermPlan,
                    landOwnershipType: projectDetails.landOwnershipType,
                    ownershipType: projectDetails.ownershipType
                }
            };

            // set planting seasons
            if (projectDetails.plantingSeasons && projectDetails.plantingSeasons.length > 0) {
                for (let i = 0; i < projectDetails.plantingSeasons.length; i++) {
                    if (projectDetails.plantingSeasons[i]) {
                        const j = projectDetails.plantingSeasons[i] - 1;
                        handleSetPlantingSeasons(j)
                    }
                }
            }

            // set owner type
            if (projectDetails.siteOwnerType && projectDetails.siteOwnerType.length > 0) {
                const newSiteOwners = siteOwners
                for (let i = 0; i < projectDetails.siteOwnerType.length; i++) {
                    for (let j = 0; j < newSiteOwners.length; j++) {
                        if (newSiteOwners[j].value === projectDetails.siteOwnerType[i]) {
                            newSiteOwners[j].isSet = true;
                        }
                    }

                }
                setSiteOwners(newSiteOwners)
            }

            reset(defaultDetailedAnalysisData)
        }
    }, [projectDetails])
    // console.log(`projectDetails`, projectDetails)
    // console.log(`properties.value`, properties.value, typeof properties.value)
    return ready ? (
        <div className={styles.stepContainer}>
            <form onSubmit={(e) => { e.preventDefault() }}>
                <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>

                    <div className={styles.formField}>
                        <div className={styles.formFieldHalf} style={{ position: 'relative' }}>
                            <MaterialTextField
                                label={t('manageProjects:projectLocation')}
                                variant="outlined"
                                name="projectLocation"
                                multiline
                                inputRef={register({
                                    maxLength: {
                                        value: 300,
                                        message: t('manageProjects:max300Chars')
                                    }
                                })}
                            />
                        </div>
                        <div className={styles.formFieldHalf}>
                            <MaterialTextField
                                inputRef={register({ validate: value => parseInt(value, 10) > 0 })}
                                label={t('manageProjects:areaProtected')}
                                variant="outlined"
                                name="areaProtected"
                                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]./g, '') }}
                            />

                        </div>
                    </div>
                    <div className={styles.formField}>
                        <div className={styles.formFieldHalf} style={{ position: 'relative' }}>
                            <div className={styles.plantingSeasons}>
                                <p className={styles.plantingSeasonsLabel}> {t('manageProjects:landOwnershipType')} </p>
                                {siteOwners.map((owner) => {
                                    return (
                                        <div className={styles.multiSelectInput} style={{ width: 'fit-content' }} key={owner.id} onClick={() => handleSetSiteOwner(owner.id)}>
                                            <div className={`${styles.multiSelectInputCheck} ${owner.isSet ? styles.multiSelectInputCheckTrue : ''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13.02" height="9.709" viewBox="0 0 13.02 9.709">
                                                    <path id="check-solid" d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z" transform="translate(0 -65.098)" fill="#fff" />
                                                </svg>
                                            </div>
                                            <p style={{ color: 'var(--dark)' }}>{owner.title}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className={styles.formFieldHalf}>
                            <Controller
                                as={
                                    <MaterialTextField
                                        label={t('manageProjects:ownershipType')}
                                        variant="outlined"
                                        select
                                    >
                                        {ownershipType.map((option) => (
                                            <MenuItem key={option.value} value={option.value} classes={{
                                                // option: classes.option,
                                                root: classes.root,
                                            }} >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </MaterialTextField>
                                }
                                name="ownershipType"
                                rules={{
                                    required: t('manageProjects:ownershipTypeValidation'),
                                }}
                                control={control}
                            />

                        </div>
                    </div>
                    <div className={styles.formFieldLarge} style={{ position: 'relative' }}>
                        <MaterialTextField
                            inputRef={register({ validate: value => parseInt(value, 10) > 0 })}
                            label={t('manageProjects:employeeCount')}
                            variant="outlined"
                            name="employeeCount"
                            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]./g, '') }}
                        />
                        <div style={{ position: 'absolute', top: '-9px', right: '16px', width: 'fit-content' }}>
                            <div className={styles.popover}>
                                <InfoIcon />
                                <div className={styles.popoverContent} style={{ left: '-290px' }}>
                                    <p>
                                        {t('manageProjects:employeesCountInfo')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formField} style={{ alignItems: 'flex-start' }}>
                        <div className={styles.formFieldHalf} style={{ position: 'relative' }}>

                            <ThemeProvider theme={materialTheme}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMapForDate[userLang] ? localeMapForDate[userLang] : localeMapForDate['en']}>
                                    <Controller
                                        render={properties => (
                                            <DatePicker
                                                label={t('manageProjects:startingProtectionYear')}
                                                value={properties.value}
                                                onChange={properties.onChange}
                                                inputVariant="outlined"
                                                TextFieldComponent={MaterialTextField}
                                                autoOk
                                                disableFuture
                                                // minDate={new Date(new Date().setFullYear(1950))}
                                                views={["year"]}
                                                // maxDate={new Date()}
                                            />)
                                        }
                                        name="startingProtectionYear"
                                        control={control}
                                        defaultValue=""

                                    />
                                </MuiPickersUtilsProvider>
                            </ThemeProvider>
                            <div style={{ position: 'absolute', top: '-9px', right: '16px', width: 'fit-content' }}>
                                <div className={styles.popover}>
                                    <InfoIcon />
                                    <div className={styles.popoverContent} style={{ left: '-290px' }}>
                                        <p>
                                            {t('manageProjects:max300Chars')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ width: '20px' }}></div>
                        <div className={styles.formFieldHalf} style={{ position: 'relative' }}>
                            {/* the reason this project has been created (max. 300 characters) */}
                            <MaterialTextField
                                inputRef={register({
                                    maxLength: {
                                        value: 300,
                                        message: t('manageProjects:max300Chars')
                                    }
                                })}
                                label={t('manageProjects:actions')}
                                variant="outlined"
                                name="actions"
                                multiline
                            />

                            <div style={{ position: 'absolute', top: '-9px', right: '16px', width: 'fit-content' }}>
                                <div className={styles.popover}>
                                    <InfoIcon />
                                    <div className={styles.popoverContent} style={{ left: '-290px' }}>
                                        <p>
                                            {t('manageProjects:max300Chars')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formFieldLarge}>
                        <div className={styles.plantingSeasons}>
                            <p className={styles.plantingSeasonsLabel}> {t('manageProjects:activitySeasons')} </p>
                            {plantingSeasons.map((month) => {
                                return (
                                    <div className={styles.multiSelectInput} key={month.id} onClick={() => handleSetPlantingSeasons(month.id)}>
                                        <div className={`${styles.multiSelectInputCheck} ${month.isSet ? styles.multiSelectInputCheckTrue : ''}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13.02" height="9.709" viewBox="0 0 13.02 9.709">
                                                <path id="check-solid" d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z" transform="translate(0 -65.098)" fill="#fff" />
                                            </svg>
                                        </div>
                                        <p style={{ color: 'var(--dark)' }}>{month.title}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className={styles.formFieldLarge}>
                        <div style={{ width: '20px' }}></div>
                        <div className={styles.formFieldHalf} style={{ position: 'relative' }}>
                            {/* the main challenge the project is facing (max. 300 characters) */}
                            <MaterialTextField
                                inputRef={register({
                                    maxLength: {
                                        value: 300,
                                        message: t('manageProjects:max300Chars')
                                    }
                                })}
                                label={t('manageProjects:mainChallenge')}
                                variant="outlined"
                                name="mainChallenge"
                                multiline
                            />
                            <div style={{ position: 'absolute', top: '-9px', right: '16px', width: 'fit-content' }}>
                                <div className={styles.popover}>
                                    <InfoIcon />
                                    <div className={styles.popoverContent} style={{ left: '-290px' }}>
                                        <p>
                                            {t('manageProjects:max300Chars')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formFieldLarge} style={{ position: 'relative' }}>
                        <MaterialTextField
                            inputRef={register({
                                maxLength: {
                                    value: 300,
                                    message: t('manageProjects:max300Chars')
                                }
                            })}
                            label={t('manageProjects:motivation')}
                            variant="outlined"
                            name="motivation"
                            multiline
                        />

                        <div style={{ position: 'absolute', top: '-9px', right: '16px', width: 'fit-content' }}>
                            <div className={styles.popover}>
                                <InfoIcon />
                                <div className={styles.popoverContent} style={{ left: '-290px' }}>
                                    <p>
                                        {t('manageProjects:max300Chars')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formFieldLarge} style={{ position: 'relative' }}>
                        <MaterialTextField
                            label={t('manageProjects:longTermPlan')}
                            variant="outlined"
                            name="longTermPlan"
                            multiline
                            inputRef={register({
                                maxLength: {
                                    value: 300,
                                    message: t('manageProjects:max300Chars')
                                }
                            })}
                        />
                        <div style={{ position: 'absolute', top: '-9px', right: '16px', width: 'fit-content' }}>
                            <div className={styles.popover}>
                                <InfoIcon />
                                <div className={styles.popoverContent} style={{ left: '-290px' }}>
                                    <p>
                                        {t('manageProjects:longTermPlanInfo')}
                                    </p>
                                    <br />
                                    <p>{t('manageProjects:max300Chars')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formField} style={{ marginTop: '48px' }}>
                        <div className={`${styles.formFieldHalf}`}>
                            <button
                                onClick={handleBack}
                                className="secondaryButton"
                            >
                                <BackArrow />
                                <p>
                                    {t('manageProjects:backToMedia')}
                                </p>
                            </button>
                        </div>
                        <div style={{ width: '20px' }}></div>
                        <div className={`${styles.formFieldHalf}`} >
                            <button
                                onClick={handleSubmit(onSubmit)}
                                className="primaryButton"
                                style={{ minWidth: "240px" }}
                                data-test-id="detailAnalysisCont"
                            >
                                {isUploadingData ? <div className={styles.spinner}></div> : t('manageProjects:saveAndContinue')}
                            </button >
                        </div>
                    </div>
                </div>
            </form>

        </div>
    ) : <></>;
}

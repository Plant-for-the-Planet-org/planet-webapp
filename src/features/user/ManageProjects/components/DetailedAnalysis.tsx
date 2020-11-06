import 'date-fns'
import React, { ReactElement } from 'react'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm, Controller } from 'react-hook-form';
import i18next from './../../../../../i18n'
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import styles from './../styles/StepForm.module.scss'
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import DateFnsUtils from '@date-io/date-fns';
import {
    DatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MenuItem } from '@material-ui/core';
import ProjectCertificates from './ProjectCertificates';
import InfoIcon from './../../../../../public/assets/images/icons/manageProjects/Info'
import { putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';

const { useTranslation } = i18next;



interface Props {
    handleNext: Function;
    handleBack: Function;
    projectDetails: Object;
    setProjectDetails: Function;
    projectGUID: String;
    handleReset: Function;
    session: any;
    userLang: String;
}
export default function DetailedAnalysis({ handleBack, userLang, session, handleNext, projectDetails, setProjectDetails, projectGUID, handleReset }: Props): ReactElement {
    const { t, i18n } = useTranslation(['manageProjects', 'common']);

    const [siteOwners, setSiteOwners] = React.useState([
        { id: 1, title: t('manageProjects:siteOwnerPrivate'), value: 'private', isSet: false },
        { id: 2, title: t('manageProjects:siteOwnerPublic'), value: 'public-property', isSet: false },
        { id: 3, title: t('manageProjects:siteOwnerSmallHolding'), value: 'smallholding', isSet: false },
        { id: 4, title: t('manageProjects:siteOwnerCommunal'), value: 'communal-land', isSet: false },
        { id: 5, title: t('manageProjects:siteOwnerOwned'), value: 'owned-by-owner', isSet: false },
        { id: 6, title: t('manageProjects:siteOwnerOther'), value: 'other', isSet: false }
    ])

    const [isUploadingData, setIsUploadingData] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')
    const [plantingSeasons, setPlantingSeasons] = React.useState([
        { id: 0, title: t('common:january'), isSet: false },
        { id: 1, title: t('common:february'), isSet: false },
        { id: 2, title: t('common:march'), isSet: false },
        { id: 3, title: t('common:april'), isSet: false },
        { id: 4, title: t('common:may'), isSet: false },
        { id: 5, title: t('common:june'), isSet: false },
        { id: 6, title: t('common:july'), isSet: false },
        { id: 7, title: t('common:august'), isSet: false },
        { id: 8, title: t('common:september'), isSet: false },
        { id: 9, title: t('common:october'), isSet: false },
        { id: 10, title: t('common:november'), isSet: false },
        { id: 11, title: t('common:december'), isSet: false }
    ])

    const handleSetPlantingSeasons = (id: any) => {
        let month = plantingSeasons[id];
        let newMonth = month;
        newMonth.isSet = !month.isSet;
        let plantingSeasonsNew = plantingSeasons;
        plantingSeasonsNew[id] = newMonth;
        setPlantingSeasons([...plantingSeasonsNew]);
    }

    const handleSetSiteOwner = (id: any) => {
        let owner = siteOwners[id - 1];
        let newOwner = owner;
        newOwner.isSet = !owner.isSet;
        let newSiteOwners = siteOwners;
        newSiteOwners[id - 1] = newOwner;
        setSiteOwners([...newSiteOwners]);
    }

    React.useEffect(() => {
        if (!projectGUID || projectGUID === '') {
            handleReset(t('manageProjects:resetMessage'))
        }
    })

    const [isCertified, setisCertified] = React.useState(true)

    const { register, handleSubmit, errors, control, reset, setValue, watch } = useForm({ mode: 'onBlur' });

    const onSubmit = (data: any) => {
        setIsUploadingData(true)
        let months = [];
        for (let i = 0; i < plantingSeasons.length; i++) {
            if (plantingSeasons[i].isSet) {
                let j = i + 1;
                months.push(j)
            }
        }

        let owners = [];
        for (let i = 0; i < siteOwners.length; i++) {
            if (siteOwners[i].isSet) {
                owners.push(siteOwners[i].value)
            }
        }

        const submitData = {
            yearAbandoned: data.yearAbandoned.getFullYear(),
            firstTreePlanted: `${data.firstTreePlanted.getFullYear()}-${data.firstTreePlanted.getMonth()}-${data.firstTreePlanted.getDate()}`,
            plantingDensity: data.plantingDensity,
            employeesCount: data.employeesCount,
            mainChallenge: data.mainChallenge,
            motivation: data.motivation,
            siteOwnerType: owners,
            siteOwnerName: data.siteOwnerName,
            acquisitionYear: data.acquisitionYear.getFullYear(),
            degradationYear: data.degradationYear.getFullYear(),
            degradationCause: data.degradationCause,
            longTermPlan: data.longTermPlan,
            plantingSeasons: months
        }

        putAuthenticatedRequest(`/app/projects/${projectGUID}`, submitData, session).then((res) => {
            if (!res.code) {
                setProjectDetails(res)
                setIsUploadingData(false)
                setErrorMessage('')
                handleNext()
            } else {
                if (res.code === 404) {
                    setIsUploadingData(false)
                    setErrorMessage(t('manageProjects:projectNotFound'))
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

            const defaultDetailedAnalysisData = {
                yearAbandoned: projectDetails.yearAbandoned ? new Date(new Date().setFullYear(projectDetails.yearAbandoned)) : new Date(),
                firstTreePlanted: projectDetails.firstTreePlanted ? new Date(projectDetails.firstTreePlanted) : new Date(),
                plantingDensity: projectDetails.plantingDensity,
                employeesCount: projectDetails.employeesCount,
                mainChallenge: projectDetails.mainChallenge,
                motivation: projectDetails.motivation,
                siteOwnerName: projectDetails.siteOwnerName,
                acquisitionYear: projectDetails.acquisitionYear ? new Date(new Date().setFullYear(projectDetails.acquisitionYear)) : new Date(),
                degradationYear: projectDetails.degradationYear ? new Date(new Date().setFullYear(projectDetails.degradationYear)) : new Date(),
                degradationCause: projectDetails.degradationCause,
                longTermPlan: projectDetails.longTermPlan,
            };

            // set planting seasons
            if (projectDetails.plantingSeasons && projectDetails.plantingSeasons.length > 0) {
                for (let i = 0; i < projectDetails.plantingSeasons.length; i++) {
                    if (projectDetails.plantingSeasons[i]) {
                        let j = projectDetails.plantingSeasons[i] - 1;
                        handleSetPlantingSeasons(j)
                    }
                }
            }

            // set owner type
            if (projectDetails.siteOwnerType && projectDetails.siteOwnerType.length > 0) {
                let newSiteOwners = siteOwners
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
    return (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>

                    <div className={styles.formField}>
                        <div className={styles.formFieldHalf} style={{ position: 'relative' }}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMapForDate[userLang] ? localeMapForDate[userLang] : localeMapForDate['en']}>
                                <Controller
                                    render={props => (
                                        <DatePicker
                                            views={["year"]}
                                            value={props.value}
                                            onChange={props.onChange}
                                            label={t('manageProjects:yearOfAbandonment')}
                                            inputVariant="outlined"
                                            variant="inline"
                                            TextFieldComponent={MaterialTextField}
                                            autoOk
                                            disableFuture
                                            minDate={new Date(new Date().setFullYear(1950))}
                                            maxDate={new Date()}
                                        />
                                    )
                                    }
                                    name="yearAbandoned"
                                    control={control}
                                    defaultValue=""
                                />

                            </MuiPickersUtilsProvider>
                            <div style={{ position: 'absolute', top: '-9px', right: '16px', width: 'fit-content' }}>
                                <div className={styles.popover}>
                                    <InfoIcon />
                                    <div className={styles.popoverContent} style={{ left: '-290px' }}>
                                        <p>
                                            {t('manageProjects:yearAbandonedInfo')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={styles.formFieldHalf}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMapForDate[userLang] ? localeMapForDate[userLang] : localeMapForDate['en']}>
                                <Controller
                                    render={props => (

                                        <DatePicker
                                            label={t('manageProjects:firstTreePlanted')}
                                            value={props.value}
                                            onChange={props.onChange}
                                            inputVariant="outlined"
                                            TextFieldComponent={MaterialTextField}
                                            autoOk
                                            disableFuture
                                            minDate={new Date(new Date().setFullYear(1950))}
                                            format="d MMMM yyyy"
                                            maxDate={new Date()}
                                        />)
                                    }
                                    name="firstTreePlanted"
                                    control={control}
                                    defaultValue=""
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    </div>
                    <div className={styles.formField}>
                        <div className={styles.formFieldHalf}>

                            {/* Integer - the planting density expressed in trees per ha */}
                            <MaterialTextField
                                label={t('manageProjects:plantingDensity')}
                                variant="outlined"
                                name="plantingDensity"
                                inputRef={register({
                                    validate: value => parseInt(value, 10) > 1
                                })}
                                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '') }}
                                InputProps={{
                                    endAdornment: (
                                        <p
                                            className={styles.inputEndAdornment}
                                            style={{ marginLeft: '4px', width: '100%', textAlign: 'right', fontSize: '14px' }}
                                        >
                                            {t('manageProjects:treePerHa')}
                                        </p>
                                    ),
                                }}
                            />
                            {errors.plantingDensity && (
                                <span className={styles.formErrors}>
                                    {errors.plantingDensity.message}
                                </span>
                            )}
                        </div>
                        <div style={{ width: '20px' }}></div>
                        <div className={styles.formFieldHalf} style={{ position: 'relative' }}>
                            <MaterialTextField
                                inputRef={register({ validate: value => parseInt(value, 10) > 1 })}
                                label={t('manageProjects:employeeCount')}
                                variant="outlined"
                                name="employeesCount"
                                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]./g, '') }}
                            />
                            {errors.employeesCount && (
                                <span className={styles.formErrors}>
                                    {errors.employeesCount.message}
                                </span>
                            )}
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
                    </div>

                    <div className={styles.formFieldLarge}>
                        <div className={styles.plantingSeasons}>
                            <p className={styles.plantingSeasonsLabel}> {t('manageProjects:plantingSeasons')} </p>
                            {plantingSeasons.map((month) => {
                                return (
                                    <div className={styles.multiSelectInput} key={month.id} onClick={() => handleSetPlantingSeasons(month.id)}>
                                        <div className={`${styles.multiSelectInputCheck} ${month.isSet ? styles.multiSelectInputCheckTrue : ''}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13.02" height="9.709" viewBox="0 0 13.02 9.709">
                                                <path id="check-solid" d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z" transform="translate(0 -65.098)" fill="#fff" />
                                            </svg>
                                        </div>
                                        <p>{month.title}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>



                    <div className={styles.formField} style={{ alignItems: 'flex-start' }}>
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
                            {errors.mainChallenge && (
                                <span className={styles.formErrors}>
                                    {errors.mainChallenge.message}
                                </span>
                            )}
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
                                label={t('manageProjects:whyThisSite')}
                                variant="outlined"
                                name="motivation"
                                multiline
                            />
                            {errors.motivation && (
                                <span className={styles.formErrors}>
                                    {errors.motivation.message}
                                </span>
                            )}
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


                    <div className={styles.formField}>
                        <div className={styles.formFieldHalf}>

                            <div className={styles.plantingSeasons}>
                                <p className={styles.plantingSeasonsLabel}> {t('manageProjects:siteOwner')} </p>
                                {siteOwners.map((owner) => {
                                    return (
                                        <div className={styles.multiSelectInput} style={{ width: 'fit-content' }} key={owner.id} onClick={() => handleSetSiteOwner(owner.id)}>
                                            <div className={`${styles.multiSelectInputCheck} ${owner.isSet ? styles.multiSelectInputCheckTrue : ''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13.02" height="9.709" viewBox="0 0 13.02 9.709">
                                                    <path id="check-solid" d="M4.422,74.617.191,70.385a.651.651,0,0,1,0-.921l.921-.921a.651.651,0,0,1,.921,0l2.851,2.85,6.105-6.105a.651.651,0,0,1,.921,0l.921.921a.651.651,0,0,1,0,.921L5.343,74.617a.651.651,0,0,1-.921,0Z" transform="translate(0 -65.098)" fill="#fff" />
                                                </svg>
                                            </div>
                                            <p>{owner.title}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div style={{ width: '20px' }}></div>
                        <div className={styles.formFieldHalf}>
                            <MaterialTextField
                                label={t('manageProjects:ownerName')}
                                variant="outlined"
                                name="siteOwnerName"
                                inputRef={register()}
                            />
                        </div>
                    </div>
                    <div className={styles.formField}>
                        <div className={styles.formFieldHalf}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMapForDate[userLang] ? localeMapForDate[userLang] : localeMapForDate['en']}>
                                <Controller
                                    render={props => (
                                        <DatePicker
                                            label={t('manageProjects:acquisitionYear')}
                                            value={props.value}
                                            onChange={props.onChange}
                                            inputVariant="outlined"
                                            TextFieldComponent={MaterialTextField}
                                            autoOk
                                            disableFuture
                                            minDate={new Date(new Date().setFullYear(1950))}
                                            views={["year"]}
                                            maxDate={new Date()}
                                        />)
                                    }
                                    name="acquisitionYear"
                                    control={control}
                                    defaultValue=""

                                />
                            </MuiPickersUtilsProvider>

                        </div>
                        <div style={{ width: '20px' }}></div>
                        <div className={styles.formFieldHalf}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMapForDate[userLang] ? localeMapForDate[userLang] : localeMapForDate['en']}>
                                <Controller
                                    render={props => (
                                        <DatePicker
                                            views={["year"]}
                                            value={props.value}
                                            onChange={props.onChange}
                                            label={t('manageProjects:yearOfDegradation')}
                                            inputVariant="outlined"
                                            variant="inline"
                                            TextFieldComponent={MaterialTextField}
                                            autoOk
                                            disableFuture
                                            minDate={new Date(new Date().setFullYear(1950))}
                                            maxDate={new Date()}
                                        />)
                                    }
                                    name="degradationYear"
                                    control={control}
                                    defaultValue=""
                                />
                            </MuiPickersUtilsProvider>

                        </div>
                    </div>
                    <div className={styles.formFieldLarge} style={{ position: 'relative' }}>
                        <MaterialTextField
                            label={t('manageProjects:causeOfDegradation')}
                            variant="outlined"
                            name="degradationCause"
                            multiline
                            inputRef={register({
                                maxLength: {
                                    value: 300,
                                    message: t('manageProjects:max300Chars')
                                }
                            })}
                        />
                        {errors.degradationCause && (
                            <span className={styles.formErrors}>
                                {errors.degradationCause.message}
                            </span>
                        )}
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
                        {errors.longTermPlan && (
                            <span className={styles.formErrors}>
                                {errors.longTermPlan.message}
                            </span>
                        )}
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


                    <div className={styles.formField}>
                        <div className={styles.formFieldHalf}>
                            <div className={`${styles.formFieldRadio}`}>
                                <label htmlFor="isCertified">
                                    {t('manageProjects:isCertified')}
                                </label>
                                <ToggleSwitch
                                    checked={isCertified}
                                    onChange={() => setisCertified(!isCertified)}
                                    name="isCertified"
                                    id="isCertified"

                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                            </div>
                        </div>
                        <div style={{ width: '20px' }}></div>

                    </div>

                    {isCertified ? (
                        <ProjectCertificates
                            projectGUID={projectGUID}
                            session={session}
                            setIsUploadingData={setIsUploadingData}
                            userLang={userLang}
                        />
                    ) : null}

                </div>

                {errorMessage && errorMessage !== '' ?
                    <div className={styles.formFieldLarge}>
                        <h4 className={styles.errorMessage}>{errorMessage}</h4>
                    </div>
                    : null}

                <div className={styles.formField} style={{ marginTop: '48px' }}>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleBack}
                            className={styles.secondaryButton}
                        >
                            <BackArrow />
                            <p>
                                {t('manageProjects:backToMedia')}
                            </p>
                        </AnimatedButton>
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleSubmit(onSubmit)}
                            className={styles.continueButton}
                        >
                            {isUploadingData ? <div className={styles.spinner}></div> : t('manageProjects:saveAndContinue')}
                        </AnimatedButton>
                    </div>
                </div>
            </form>

        </div>
    )
}

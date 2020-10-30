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

const { useTranslation } = i18next;

const siteOwners = [
    { id: 1, title: 'Private', value: 'private' },
    { id: 2, title: 'Public Property', value: 'public-property' },
    { id: 3, title: 'Small Holding', value: 'smallholding' },
    { id: 4, title: 'Communal Land', value: 'communal-land' },
    { id: 5, title: 'Owned by Owner', value: 'owned-by-owner' },
    { id: 6, title: 'Other', value: 'other' }
]

interface Props {
    handleNext: Function;
    handleBack: Function;
    projectDetails: Object;
    setProjectDetails: Function;
    projectGUID: String;
    handleReset: Function;
    session: any;
}
export default function DetailedAnalysis({ handleBack, session, handleNext, projectDetails, setProjectDetails, projectGUID, handleReset }: Props): ReactElement {
    const { t, i18n } = useTranslation(['manageProjects']);

    const [isUploadingData, setIsUploadingData] = React.useState(false)

    const [plantingSeasons, setPlantingSeasons] = React.useState([
        { id: 0, title: 'January', isSet: false },
        { id: 1, title: 'Febuary', isSet: false },
        { id: 2, title: 'March', isSet: false },
        { id: 3, title: 'April', isSet: false },
        { id: 4, title: 'May', isSet: false },
        { id: 5, title: 'June', isSet: false },
        { id: 6, title: 'July', isSet: false },
        { id: 7, title: 'August', isSet: false },
        { id: 8, title: 'September', isSet: false },
        { id: 9, title: 'October', isSet: false },
        { id: 10, title: 'November', isSet: false },
        { id: 11, title: 'December', isSet: false }
    ])

    const handleSetPlantingSeasons = (id: any) => {
        let month = plantingSeasons[id];
        let newMonth = month;
        newMonth.isSet = !month.isSet;
        let plantingSeasonsNew = plantingSeasons;
        plantingSeasonsNew[id] = newMonth;
        setPlantingSeasons([...plantingSeasonsNew]);
    }



    React.useEffect(() => {
        if (!projectGUID || projectGUID === '') {
            handleReset('Please fill the Basic Details first')
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

        const submitData = {
            yearAbandoned: data.yearAbandoned.getFullYear(),
            firstTreePlanted: `${data.firstTreePlanted.getFullYear()}-${data.firstTreePlanted.getMonth()}-${data.firstTreePlanted.getDate()}`,
            plantingDensity: data.plantingDensity,
            employeesCount: data.employeesCount,
            mainChallenge: data.mainChallenge,
            motivation: data.motivation,
            siteOwnerType: data.siteOwnerType.value,
            siteOwnerName: data.siteOwnerName,
            acquisitionYear: data.acquisitionYear.getFullYear(),
            degradationYear: data.degradationYear.getFullYear(),
            degradationCause: data.degradationCause,
            longTermPlan: data.longTermPlan,
            plantingSeasons: months
        }

        putAuthenticatedRequest(`/app/projects/${projectGUID}`, submitData, session).then((res) => {
            if (res.code !== 200) {
                setProjectDetails(res)
                setIsUploadingData(false)
                handleNext()
            }
        })
    };



    React.useEffect(() => {
        if (projectDetails && projectDetails !== null) {

            const defaultDetailedAnalysisData = {
                yearAbandoned: projectDetails.yearAbandoned ? new Date(new Date().setFullYear(projectDetails.yearAbandoned)) : new Date(new Date().setFullYear(2000)),
                firstTreePlanted: projectDetails.firstTreePlanted ? new Date(projectDetails.firstTreePlanted) :new Date() ,
                plantingDensity: projectDetails.plantingDensity,
                employeesCount: projectDetails.employeesCount,
                mainChallenge: projectDetails.mainChallenge,
                motivation: projectDetails.motivation,
                siteOwnerType: siteOwners.find(element => element.value === projectDetails.siteOwnerType),  // Format with object to set it again
                siteOwnerName: projectDetails.siteOwnerName,
                acquisitionYear: projectDetails.acquisitionYear ?  new Date(new Date().setFullYear(projectDetails.acquisitionYear)) :new Date() ,
                degradationYear: projectDetails.degradationYear ? new Date(new Date().setFullYear(projectDetails.degradationYear)) : new Date(),
                degradationCause: projectDetails.degradationCause,
                longTermPlan: projectDetails.longTermPlan,
            };

            // set planting seasons
            for (let i = 0; i < projectDetails.plantingSeasons.length; i++) {
                if (projectDetails.plantingSeasons[i]) {
                    let j = projectDetails.plantingSeasons[i]-1;                    
                    handleSetPlantingSeasons(j)
                }
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
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                                        <p>When was the last significant human intervention in the site? Incl. logging, agriculture, cattle grazing, human induced burning.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={styles.formFieldHalf}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                                        minDate={new Date(new Date().setFullYear(2006))}
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
                                        >{`trees per ha`}</p>
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
                                        <p>Equivalent of a 40 hour week. I.e. two half time employees count as one.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formFieldLarge}>

                        <div className={styles.plantingSeasons}>
                            <p className={styles.plantingSeasonsLabel}>Planting Seasons</p>
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
                        <div className={styles.formFieldHalf}>

                            {/* the main challenge the project is facing (max. 300 characters) */}
                            <MaterialTextField
                                inputRef={register({
                                    maxLength: {
                                        value: 300,
                                        message: 'Maximum 300 characters allowed'
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
                        </div>

                        <div style={{ width: '20px' }}></div>
                        <div className={styles.formFieldHalf}>
                            {/* the reason this project has been created (max. 300 characters) */}
                            <MaterialTextField
                                inputRef={register({
                                    maxLength: {
                                        value: 300,
                                        message: 'Maximum 300 characters allowed'
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
                        </div>
                    </div>


                    <div className={styles.formField}>
                        <div className={styles.formFieldHalf}>

                            <Controller
                                as={
                                    <MaterialTextField
                                        label={t('manageProjects:siteOwner')}
                                        variant="outlined"
                                        select
                                    >
                                        {siteOwners.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.title}
                                            </MenuItem>
                                        ))}
                                    </MaterialTextField>
                                }
                                name="siteOwnerType"
                                control={control}
                                defaultValue=""
                            />
                            {errors.siteOwnerType && (
                                <span className={styles.formErrors}>
                                    {errors.siteOwnerType.message}
                                </span>
                            )}
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
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                                            minDate={new Date(new Date().setFullYear(2006))}
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
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                                            minDate={new Date(new Date().setFullYear(2006))}
                                        />)
                                    }
                                    name="degradationYear"
                                    control={control}
                                    defaultValue=""
                                />
                            </MuiPickersUtilsProvider>

                        </div>
                    </div>
                    <div className={styles.formFieldLarge}>
                        <MaterialTextField
                            label={t('manageProjects:causeOfDegradation')}
                            variant="outlined"
                            name="degradationCause"
                            multiline
                            inputRef={register({
                                maxLength: {
                                    value: 300,
                                    message: 'Maximum 300 characters allowed'
                                }
                            })}
                        />
                        {errors.degradationCause && (
                            <span className={styles.formErrors}>
                                {errors.degradationCause.message}
                            </span>
                        )}
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
                                    message: 'Maximum 300 characters allowed'
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
                                    <p>What measures are in place to project the forest in the long term? How is this funded? What resources will be extracted from the site?</p>
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
                        />
                    ) : null}

                </div>

                <div className={styles.formField} style={{ marginTop: '48px' }}>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleBack}
                            className={styles.secondaryButton}
                        >
                            <BackArrow />
                            <p>Back to project media</p>
                        </AnimatedButton>
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleSubmit(onSubmit)}
                            className={styles.continueButton}
                        >
                            {isUploadingData ? <div className={styles.spinner}></div> : "Save and Continue"}
                        </AnimatedButton>
                    </div>
                </div>
            </form>

        </div>
    )
}

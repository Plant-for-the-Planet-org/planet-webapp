import 'date-fns'
import React, { ReactElement } from 'react'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm } from 'react-hook-form';
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

const { useTranslation } = i18next;
interface Props {
    handleNext: Function;
    handleBack: Function;
}

export default function DetailedAnalysis({ handleBack, handleNext }: Props): ReactElement {
    const { t, i18n } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors } = useForm({ mode: 'all' });

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
    const onSubmit = (data: any) => {
        let months = [];
        for (let i = 0; i < plantingSeasons.length; i++) {
            if (plantingSeasons[i].isSet) {
                let j = i + 1;
                months.push(j)
            }
        }
        console.log(months);

        handleNext();
    };

    const [siteOwners, setSiteOwner] = React.useState(
        [
            { id: 1, title: 'Private', value: 'private' },
            { id: 2, title: 'Public Property', value: 'public-property' },
            { id: 3, title: 'Small Holding', value: 'smallholding' },
            { id: 4, title: 'Communal Land', value: 'communal-land' },
            { id: 5, title: 'Owned by Owner', value: 'owned-by-owner' },
            { id: 6, title: 'Other', value: 'other' }
        ]
    )

    const [isCertified, setisCertified] = React.useState(true)

    const defaultDetailedAnalysisData = {};
    const [detailedAnalysisData, setDetailedAnalysisData] = React.useState(defaultDetailedAnalysisData);

    const changeDetailedAnalysisData = (e: any) => {
        setDetailedAnalysisData({ ...detailedAnalysisData, [e.target.name]: e.target.value });
    };

    const uploadCertificate = () => {

    }

    const [firstTreePlantedDate, setFirstTreePlantedDate] = React.useState<Date | null>(
        new Date('2014-08-18T21:11:54'),
    );

    const [acquisitionDate, setAcquisitionDate] = React.useState<Date | null>(
        new Date('2014-08-18T21:11:54'),
    );

    const [yearOfAbandonment, handleyearOfAbandonment] = React.useState(new Date());

    const [yearOfDegradation, setYearOfDegradation] = React.useState(new Date());
    const [certifiedDate, setCertifiedDate] = React.useState(new Date());

    return (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                views={["year"]}
                                value={yearOfAbandonment}
                                onChange={handleyearOfAbandonment}
                                label={t('manageProjects:yearOfAbandonment')}
                                name="yearOfAbandonment"
                                inputVariant="outlined"
                                variant="inline"
                                TextFieldComponent={MaterialTextField}
                                autoOk
                                clearable
                                disableFuture
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className={styles.formFieldHalf}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                label={t('manageProjects:firstTreePlanted')}
                                value={firstTreePlantedDate}
                                onChange={setFirstTreePlantedDate}
                                inputVariant="outlined"
                                TextFieldComponent={MaterialTextField}
                                clearable
                                autoOk
                                disableFuture
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
                            onChange={changeDetailedAnalysisData}
                            helperText={'Number of trees per ha'}
                            inputRef={register({
                                validate: value => parseInt(value, 10) > 1
                            })}
                            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '') }}
                        />
                        {errors.plantingDensity && (
                            <span className={styles.formErrors}>
                                {errors.plantingDensity.message}
                            </span>
                        )}
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            inputRef={register({ validate: value => parseInt(value, 10) > 1 })}
                            label={t('manageProjects:employeeCount')}
                            variant="outlined"
                            name="employeeCount"
                            onChange={changeDetailedAnalysisData}
                            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '') }}
                        />
                        {errors.employeeCount && (
                            <span className={styles.formErrors}>
                                {errors.employeeCount.message}
                            </span>
                        )}
                    </div>
                </div>

                <div className={styles.formFieldLarge}>
                    <div className={styles.plantingSeasons}>
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

                <div className={styles.formFieldLarge}>

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
                        onChange={changeDetailedAnalysisData}
                        helperText="Main challenge the project is facing"
                        multiline
                    />
                    {errors.mainChallenge && (
                        <span className={styles.formErrors}>
                            {errors.mainChallenge.message}
                        </span>
                    )}
                </div>

                <div className={styles.formFieldLarge}>
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
                        onChange={changeDetailedAnalysisData}
                        multiline
                    />
                    {errors.motivation && (
                        <span className={styles.formErrors}>
                            {errors.motivation.message}
                        </span>
                    )}
                </div>
                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>

                        <MaterialTextField
                            label={t('manageProjects:siteOwner')}
                            variant="outlined"
                            name="siteOwner"
                            onChange={changeDetailedAnalysisData}
                            select
                        >
                            {siteOwners.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.title}
                                </MenuItem>
                            ))}
                        </MaterialTextField>
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={styles.formFieldHalf}>
                        <MaterialTextField
                            label={t('manageProjects:ownerName')}
                            variant="outlined"
                            name="ownerName"
                            onChange={changeDetailedAnalysisData}
                        />
                    </div>
                </div>
                <div className={styles.formField}>
                    <div className={styles.formFieldHalf}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                label={t('manageProjects:acquisitionDate')}
                                value={acquisitionDate}
                                onChange={setAcquisitionDate}
                                inputVariant="outlined"
                                TextFieldComponent={MaterialTextField}
                                clearable
                                autoOk
                                disableFuture
                                name="acquisitionDate"
                            />
                        </MuiPickersUtilsProvider>

                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={styles.formFieldHalf}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                views={["year"]}
                                value={yearOfDegradation}
                                onChange={setYearOfDegradation}
                                label={t('manageProjects:yearOfDegradation')}
                                name="yearOfDegradation"
                                inputVariant="outlined"
                                variant="inline"
                                TextFieldComponent={MaterialTextField}
                                autoOk
                                clearable
                                disableFuture
                            />
                        </MuiPickersUtilsProvider>

                    </div>
                </div>
                <div className={styles.formFieldLarge}>
                    <MaterialTextField
                        label={t('manageProjects:causeOfDegradation')}
                        variant="outlined"
                        name="causeOfDegradation"
                        onChange={changeDetailedAnalysisData}
                        multiline
                        inputRef={register({
                            maxLength: {
                                value: 300,
                                message: 'Maximum 300 characters allowed'
                            }
                        })}
                    />
                    {errors.causeOfDegradation && (
                        <span className={styles.formErrors}>
                            {errors.causeOfDegradation.message}
                        </span>
                    )}
                </div>
                <div className={styles.formFieldLarge}>
                    <MaterialTextField
                        label={t('manageProjects:longTermPlan')}
                        variant="outlined"
                        name="longTermPlan"
                        onChange={changeDetailedAnalysisData}
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

                {isCertified ? (<div>
                    <div className={styles.formField}>
                        <div className={styles.formFieldHalf}>
                            <MaterialTextField
                                inputRef={register({ required: true })}
                                label={t('manageProjects:certifierName')}
                                variant="outlined"
                                name="certifierName"
                                onChange={changeDetailedAnalysisData}

                            />
                        </div>
                        <div style={{ width: '20px' }}></div>
                        <div className={styles.formFieldHalf}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    value={certifiedDate}
                                    onChange={setCertifiedDate}
                                    label={t('manageProjects:certifiedDate')}
                                    name="certifiedDate"
                                    inputVariant="outlined"
                                    variant="inline"
                                    TextFieldComponent={MaterialTextField}
                                    autoOk
                                    clearable
                                    disableFuture
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    </div>

                    <div className={styles.formFieldLarge}>
                        <div className={styles.fileUploadContainer}>
                            <AnimatedButton
                                onClick={uploadCertificate}
                                className={styles.continueButton}
                            >
                                Upload Certificate
                        </AnimatedButton>
                            <p style={{ marginTop: '18px' }}>
                                or drag in a pdf
                        </p>
                        </div>
                    </div>

                    <div className={styles.formFieldLarge}>
                        <p className={styles.inlineLinkButton}>Add another cerification</p>
                    </div>
                </div>) : null}

                <div className={styles.formField}  style={{ marginTop: '48px' }}>
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
                            onClick={onSubmit}
                            className={styles.continueButton}
                        >
                            {'Save & continue'}
                        </AnimatedButton>
                    </div>
                </div>
            </form>

        </div>
    )
}

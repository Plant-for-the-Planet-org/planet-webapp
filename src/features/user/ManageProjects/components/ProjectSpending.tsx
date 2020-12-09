import React, { ReactElement } from 'react'
import styles from './../styles/StepForm.module.scss'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useForm, Controller } from 'react-hook-form';
import i18next from './../../../../../i18n'
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import DateFnsUtils from '@date-io/date-fns';
import {
    DatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { useDropzone } from 'react-dropzone';
import { deleteAuthenticatedRequest, getAuthenticatedRequest, postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { getPDFFile } from '../../../../utils/getImageURL';
import PDFRed from '../../../../../public/assets/images/icons/manageProjects/PDFRed';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';

const { useTranslation } = i18next;

interface Props {
    handleNext: Function;
    handleBack: Function;
    projectGUID: String;
    handleReset: Function;
    token: any;
    userLang: String;
}

export default function ProjectSpending({ handleBack, token, handleNext, userLang, projectGUID, handleReset }: Props): ReactElement {

    const { t, i18n, ready } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors, formState, getValues, setValue, control } = useForm({ mode: 'all' });

    const [amount, setAmount] = React.useState(0);
    const [isUploadingData, setIsUploadingData] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')

    const [showForm, setShowForm] = React.useState(true)
    const [uploadedFiles, setUploadedFiles] = React.useState([])
    React.useEffect(() => {
        if (!projectGUID || projectGUID === '') {
            handleReset(ready ? t('manageProjects:resetMessage') : '')
        }
    })

    const onDrop = React.useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file: any) => {
            const reader = new FileReader()
            reader.readAsDataURL(file);
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = (event) => {
                onSubmit(event.target.result);
            }
        })

    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: '.pdf',
        multiple: false,
        onDrop: onDrop,
        onDropAccepted: () => {
            console.log('uploaded');
        },
    });

    const { isDirty, isSubmitting } = formState;

    const onSubmit = (pdf: any) => {
        setIsUploadingData(true)
        const updatedAmount = getValues("amount");
        const year = getValues("year");

        const submitData = {
            year: year.getFullYear(),
            amount: updatedAmount,
            pdfFile: pdf
        }

        postAuthenticatedRequest(`/app/projects/${projectGUID}/expenses`, submitData, token).then((res) => {

            if (!res.code) {
                let newUploadedFiles = uploadedFiles;
                newUploadedFiles.push(res);
                setUploadedFiles(newUploadedFiles);
                setAmount(0);
                setValue('amount', 0, { shouldDirty: false })
                setIsUploadingData(false)
                setShowForm(false)
                setErrorMessage('')
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
        // handleNext()
    };

    const deleteProjectSpending = (id: any) => {
        setIsUploadingData(true)
        deleteAuthenticatedRequest(`/app/projects/${projectGUID}/expenses/${id}`, token).then(res => {
            if (res !== 404) {
                let uploadedFilesTemp = uploadedFiles.filter(item => item.id !== id);
                setUploadedFiles(uploadedFilesTemp)
                setIsUploadingData(false)
            }
        })
    }


    React.useEffect(() => {
        // Fetch spending of the project 
        if (projectGUID && token)
            getAuthenticatedRequest(`/app/profile/projects/${projectGUID}?_scope=expenses`, token).then((result) => {
                if (result.expenses.length > 0) {
                    setShowForm(false)
                }
                setUploadedFiles(result.expenses)
            })
    }, [projectGUID]);

    var fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    return ready ? (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {uploadedFiles && uploadedFiles.length > 0 ? (
                    <div className={styles.formField}>
                        {uploadedFiles.map((report) => {
                            return (
                                <div key={report.id} className={` ${styles.reportPDFContainer}`}>
                                    <a target="_blank" rel="noopener noreferrer"
                                        href={getPDFFile('projectExpense', report.pdf)}>
                                        {/* <PDFIcon color="#2F3336" /> */}
                                        <PDFRed />
                                    </a>
                                    <div className={styles.reportPDFDetails}>
                                        <p style={{ fontWeight: 'bold' }}>€ {report.amount} </p>
                                        <p>in {report.year} </p>
                                    </div>
                                    {/* <div className={styles.reportEditButton} style={{ marginRight: '8px' }}>
                                        <PencilIcon color={"#000"} />
                                    </div> */}
                                    <div
                                        onClick={() => deleteProjectSpending(report.id)}
                                        className={styles.reportEditButton}>
                                        <TrashIcon />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : null}
                {showForm ? (
                    <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
                        <div className={styles.formField}>
                            <div className={`${styles.formFieldHalf}`}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMapForDate[userLang] ? localeMapForDate[userLang] : localeMapForDate['en']}>
                                    <Controller
                                        render={props => (
                                            <DatePicker
                                                inputRef={register({
                                                    required: {
                                                        value: true,
                                                        message: t('manageProjects:spendingYearValidation')
                                                    }
                                                })}
                                                views={["year"]}
                                                value={props.value}
                                                onChange={props.onChange}
                                                label={t('manageProjects:spendingYear')}
                                                inputVariant="outlined"
                                                variant="inline"
                                                TextFieldComponent={MaterialTextField}
                                                autoOk
                                                clearable
                                                disableFuture
                                                minDate={fiveYearsAgo}
                                                maxDate={new Date()}
                                                defaultValue={new Date()}
                                            />
                                        )}
                                        name="year"
                                        control={control}
                                    />
                                </MuiPickersUtilsProvider>
                                {errors.year && (
                                    <span className={styles.formErrors}>
                                        {errors.year.message}
                                    </span>
                                )}
                            </div>
                            <div style={{ width: '20px' }}></div>
                            <div className={`${styles.formFieldHalf}`}>
                                <MaterialTextField
                                    inputRef={register({
                                        validate: (value) =>
                                            parseFloat(value) > 0,
                                        required: {
                                            value: true,
                                            message: t('manageProjects:spendingAmountValidation')
                                        }
                                    })}
                                    label={t('manageProjects:spendingAmount')}
                                    placeholder={0}
                                    variant="outlined"
                                    name="amount"
                                    onChange={(e) => setAmount(e.target.value)}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9,.]/g, '');
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <p
                                                className={styles.inputStartAdornment}
                                                style={{ paddingRight: '4px' }}
                                            >{`€`}</p>
                                        ),
                                    }}
                                />
                                {errors.amount && (
                                    <span className={styles.formErrors}>
                                        {errors.amount.message}
                                    </span>
                                )}

                            </div>
                        </div>

                        {errors.amount || errors.year || !isDirty || amount === 0 ? (
                            <div className={styles.formFieldLarge} style={{ opacity: 0.35 }}>
                                <div className={styles.fileUploadContainer}>
                                    <AnimatedButton
                                        className={styles.continueButton}
                                    >
                                        {t('manageProjects:uploadReport')}
                                    </AnimatedButton>
                                    <p style={{ marginTop: '18px' }}>
                                        {t('manageProjects:dragInPdf')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                                <div className={styles.formFieldLarge} {...getRootProps()}>
                                    <div className={styles.fileUploadContainer}>
                                        <AnimatedButton
                                            // onClick={uploadReport}
                                            className={styles.continueButton}
                                        >
                                            <input {...getInputProps()} />
                                            {t('manageProjects:uploadReport')}
                                        </AnimatedButton>
                                        <p style={{ marginTop: '18px' }}>
                                            {t('manageProjects:dragInPdf')}
                                        </p>
                                    </div>
                                </div>
                            )}
                    </div>
                ) : (
                        <div className={styles.formFieldLarge} onClick={() => setShowForm(true)}>
                            <p className={styles.inlineLinkButton}>
                                {t('manageProjects:addAnotherYear')}
                            </p>
                        </div>
                    )}

                {errorMessage && errorMessage !== '' ?
                    <div className={styles.formFieldLarge}>
                        <h4 className={styles.errorMessage}>{errorMessage}</h4>
                    </div>
                    : null}

                <div className={styles.formField}>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleBack}
                            className={styles.secondaryButton}
                        >
                            <BackArrow />
                            <p>
                                {t('manageProjects:backToSites')}
                            </p>
                        </AnimatedButton>
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={() => handleNext()}
                            className={styles.continueButton}
                        >
                            {isUploadingData ? <div className={styles.spinner}></div> :t('manageProjects:saveAndContinue')}
                        </AnimatedButton>
                    </div>
                </div>
            </form>
        </div>
    ) : null;
}

import 'date-fns'
import React, { ReactElement } from 'react'
import styles from './../styles/StepForm.module.scss'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useForm } from 'react-hook-form';
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
import PDFIcon from '../../../../../public/assets/images/icons/manageProjects/PDFIcon';
import PencilIcon from '../../../../../public/assets/images/icons/manageProjects/Pencil';
import PDFRed from '../../../../../public/assets/images/icons/manageProjects/PDFRed';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';

const { useTranslation } = i18next;

interface Props {
    handleNext: Function;
    handleBack: Function;
    projectDetails: Object;
    setProjectDetails: Function;
    projectGUID: String;
    handleReset: Function;
    session:any;
}

export default function ProjectSpending({ handleBack, session,handleNext, projectDetails, setProjectDetails, projectGUID, handleReset }: Props): ReactElement {

    const { t, i18n } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors, formState, getValues, setValue } = useForm({ mode: 'all' });

    const [year, setYear] = React.useState(new Date());
    const [amount, setAmount] = React.useState(0);

    const [uploadedFiles, setUploadedFiles] = React.useState([])
    React.useEffect(() => {
        if (!projectGUID || projectGUID === '') {
            handleReset('Please fill the Basic Details first')
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
        const updatedAmount = getValues("amount");
        const submitData = {
            year: year.getFullYear(),
            amount: updatedAmount,
            pdfFile: pdf
        }

        postAuthenticatedRequest(`/app/projects/${projectGUID}/expenses`, submitData, session).then((res) => {
            let newUploadedFiles = uploadedFiles;
            newUploadedFiles.push(res)
            setUploadedFiles(newUploadedFiles);
            setAmount(0);
            setValue('amount', 0, { shouldDirty: false })
        })
        // handleNext()
    };

    const deleteProjectSpending = (id: any) => {
        deleteAuthenticatedRequest(`/app/projects/${projectGUID}/expenses/${id}`, session).then(res => {
            if (res !== 404) {
                let uploadedFilesTemp = uploadedFiles.filter(item => item.id !== id);
                setUploadedFiles(uploadedFilesTemp)
            }
        })
    }


    React.useEffect(()=>{
        // Fetch spending of the project 
        if(projectGUID !== '' && projectGUID !== null && session?.accessToken)
        getAuthenticatedRequest(`/app/profile/projects/${projectGUID}?_scope=expenses`,session).then((result)=>{
            setUploadedFiles(result.expenses)
        })
    },[projectGUID]);

    return (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {uploadedFiles && uploadedFiles.length > 0 ? (
                    <div className={styles.formField}>
                        {uploadedFiles.map((report) => {
                            return (
                                <div key={report.id} className={` ${styles.reportPDFContainer}`}>
                                    <a target={"_blank"} href={getPDFFile('projectExpense',report.pdf)}>
                                        {/* <PDFIcon color="#2F3336" /> */}
                                        <PDFRed />
                                    </a>
                                    <div className={styles.reportPDFDetails}>
                                        <p style={{ fontWeight: 'bold' }}>€ {report.amount} </p>
                                        <p>in {report.year} </p>
                                    </div>
                                    <div className={styles.reportEditButton} style={{ marginRight: '8px' }}>
                                        <PencilIcon color={"#000"} />
                                    </div>
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

                <div className={styles.formField}>
                    <div className={`${styles.formFieldHalf}`}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                inputRef={register({
                                    required: {
                                        value: true,
                                        message: 'Please add Spending Year'
                                    }
                                })}
                                views={["year"]}
                                value={year}
                                onChange={(value) => setYear(value)}
                                label={t('manageProjects:spendingYear')}
                                name="year"
                                inputVariant="outlined"
                                variant="inline"
                                TextFieldComponent={MaterialTextField}
                                autoOk
                                clearable
                                disableFuture

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
                                    message: 'Please enter the Amount Spent'
                                }
                            })}
                            label={t('manageProjects:spendingAmount')}
                            // value={amount}
                            // defaultValue={amount}
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
                                Upload Report
                            </AnimatedButton>
                            <p style={{ marginTop: '18px' }}>
                                or drag in a pdf
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
                                    Upload Report
                                </AnimatedButton>
                                <p style={{ marginTop: '18px' }}>
                                    or drag in a pdf
                                </p>
                            </div>
                        </div>
                    )}




                {/* <div className={styles.formFieldLarge}>
                    <p className={styles.inlineLinkButton}>Add another year</p>
                </div> */}


                <div className={styles.formField}>
                    <div className={`${styles.formFieldHalf}`}>
                        <AnimatedButton
                            onClick={handleBack}
                            className={styles.secondaryButton}
                        >
                            <BackArrow />
                            <p>Back to project sites</p>
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

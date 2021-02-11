import React, { ReactElement } from 'react'
import styles from './../styles/StepForm.module.scss'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import DateFnsUtils from '@date-io/date-fns';
import {
    DatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useForm } from 'react-hook-form';
import i18next from './../../../../../i18n'
import { useDropzone } from 'react-dropzone';
import { deleteAuthenticatedRequest, getAuthenticatedRequest, postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import PDFRed from '../../../../../public/assets/images/icons/manageProjects/PDFRed';
import { getPDFFile } from '../../../../utils/getImageURL';
import PencilIcon from '../../../../../public/assets/images/icons/manageProjects/Pencil';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';

const { useTranslation } = i18next;


interface Props {
    projectGUID: String;
    token: any;
    setIsUploadingData: Function;
    userLang:String;    
}

function ProjectCertificates({ projectGUID, token, setIsUploadingData,userLang }: Props): ReactElement {
    const { t, i18n, ready } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors, control, formState, getValues, setValue } = useForm({ mode: 'all' });
    const { isDirty } = formState;

    const [issueDate, setIssueDate] = React.useState(new Date());

    const [certifierName, setCertifierName] = React.useState('');

    const [uploadedFiles, setUploadedFiles] = React.useState([])
    const [showForm, setShowForm] = React.useState(true)
    const [errorMessage, setErrorMessage] = React.useState('')

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

    const onSubmit = (pdf: any) => {
        setIsUploadingData(true)
        const updatedAmount = getValues("certifierName");
        const submitData = {
            issueDate: issueDate.getFullYear(),
            certifierName: updatedAmount,
            pdfFile: pdf
        }

        postAuthenticatedRequest(`/app/projects/${projectGUID}/certificates`, submitData, token).then((res) => {
            if (!res.code) {
                const newUploadedFiles = uploadedFiles;
                newUploadedFiles.push(res)
                setUploadedFiles(newUploadedFiles);
                setCertifierName('');
                setValue('certifierName', '', { shouldDirty: false })
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
    };

    const deleteProjectCertificate = (id: any) => {
        deleteAuthenticatedRequest(`/app/projects/${projectGUID}/certificates/${id}`, token).then(res => {
            if (res !== 404) {
                const uploadedFilesTemp = uploadedFiles.filter(item => item.id !== id);
                setUploadedFiles(uploadedFilesTemp)
            }
        })
    }

    React.useEffect(() => {
        // Fetch certificates of the project 
        if (projectGUID && token?.accessToken)
            getAuthenticatedRequest(`/app/profile/projects/${projectGUID}?_scope=certificates`, token).then((result) => {
                if (result.certificates.length > 0) {
                    setShowForm(false)
                }
                setUploadedFiles(result.certificates)
            })
    }, [projectGUID]);


    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

    return ready ? (
        <div>

            {uploadedFiles && uploadedFiles.length > 0 ? (
                <div className={styles.formField}>
                    {uploadedFiles.map((report) => {
                        return (
                            <div key={report.id} className={` ${styles.reportPDFContainer}`}>
                                <a target="_blank" rel="noopener noreferrer"
                                  href={getPDFFile('projectCertificate', report.pdf)}>
                                    {/* <PDFIcon color="#2F3336" /> */}
                                    <PDFRed />
                                </a>
                                <div className={styles.reportPDFDetails}>
                                    <p style={{ fontWeight: 'bold' }}> {t('manageProjects:certifiedBy')} {report.certifierName} </p>
                                    <p>{report.issueDate} </p>
                                </div>
                                {/* <div className={styles.reportEditButton} style={{ marginRight: '8px' }}>
                                    <PencilIcon color={"#000"} />
                                </div> */}
                                <button id={'trashIconProjC'}
                                    onClick={() => deleteProjectCertificate(report.id)}
                                    className={styles.reportEditButton}>
                                    <TrashIcon />
                                </button>
                            </div>
                        )
                    })}
                </div>
            ) : null}

            {showForm ? (
                <>
                    <div className={styles.formField}>
                        <div className={styles.formFieldHalf}>
                            <MaterialTextField
                                inputRef={register({ required: true })}
                                label={t('manageProjects:certifierName')}
                                variant="outlined"
                                name="certifierName"
                                onChange={(e) => setCertifierName(e.target.value)}
                            />
                            {errors.certifierName && (
                                <span className={styles.formErrors}>
                                    {errors.certifierName.message}
                                </span>
                            )}
                        </div>
                        <div style={{ width: '20px' }}></div>
                        <div className={styles.formFieldHalf}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMapForDate[userLang] ? localeMapForDate[userLang] : localeMapForDate['en']}>
                                <DatePicker
                                    value={issueDate}
                                    onChange={setIssueDate}
                                    label={t('manageProjects:issueDate')}
                                    name="issueDate"
                                    inputVariant="outlined"
                                    variant="inline"
                                    TextFieldComponent={MaterialTextField}
                                    autoOk
                                    clearable
                                    disableFuture
                                    inputRef={register({
                                        required: {
                                            value: true,
                                            message: t('manageProjects:certificationDateValidation')
                                        }
                                    })}
                                    maxDate={new Date()}
                                    minDate={tenYearsAgo}
                                />

                            </MuiPickersUtilsProvider>
                            {errors.issueDate && (
                                <span className={styles.formErrors}>
                                    {errors.issueDate.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {errorMessage && errorMessage !== '' ?
                        <div className={styles.formFieldLarge}>
                            <h4 className={styles.errorMessage}>{errorMessage}</h4>
                        </div>
                        : null}


                    {errors.certifierName || errors.issueDate || !isDirty || certifierName === '' ? (
                        <div className={styles.formFieldLarge} style={{ opacity: 0.35 }}>
                            <div className={styles.fileUploadContainer}>
                                <AnimatedButton
                                    className={styles.continueButton}
                                >
                                    {t('manageProjects:uploadCertificate')}
                            </AnimatedButton>
                                <p style={{ marginTop: '18px' }}>
                                    {t('manageProjects:dragIn')}
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
                                    {t('manageProjects:uploadCertificate')}
                                </AnimatedButton>
                                    <p style={{ marginTop: '18px' }}>
                                        {t('manageProjects:dragIn')}
                                </p>
                                </div>
                            </div>
                        )}
                </>) : (
                    <div className={styles.formFieldLarge} onClick={() => setShowForm(true)}>
                        <p className={styles.inlineLinkButton}>
                            {t('manageProjects:addCertificate')}
                        </p>
                    </div>)}

        </div>
    ) : <></>;
}

export default ProjectCertificates

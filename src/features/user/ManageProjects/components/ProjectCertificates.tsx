import 'date-fns'
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

const { useTranslation } = i18next;


interface Props {
    projectGUID: String;
    session: any;
    setIsUploadingData:Function
}

function ProjectCertificates({ projectGUID, session,setIsUploadingData }: Props): ReactElement {
    const { t, i18n } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors, control, formState, getValues, setValue } = useForm({ mode: 'all' });
    const { isDirty } = formState;

    const [issueDate, setIssueDate] = React.useState(new Date());

    const [certifierName, setCertifierName] = React.useState('');

    const [uploadedFiles, setUploadedFiles] = React.useState([])
    const [showForm, setShowForm] = React.useState(true)

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

        postAuthenticatedRequest(`/app/projects/${projectGUID}/certificates`, submitData, session).then((res) => {
            let newUploadedFiles = uploadedFiles;
            newUploadedFiles.push(res)
            setUploadedFiles(newUploadedFiles);
            setCertifierName('');
            setValue('certifierName', '', { shouldDirty: false })
            setIsUploadingData(false)
            setShowForm(false)
        })
    };

    const deleteProjectCertificate = (id: any) => {
        deleteAuthenticatedRequest(`/app/projects/${projectGUID}/certificates/${id}`, session).then(res => {
            if (res !== 404) {
                let uploadedFilesTemp = uploadedFiles.filter(item => item.id !== id);
                setUploadedFiles(uploadedFilesTemp)
            }
        })
    }

    React.useEffect(()=>{
        // Fetch certificates of the project 
        if(projectGUID !== '' && projectGUID !== null && session?.accessToken)
        getAuthenticatedRequest(`/app/profile/projects/${projectGUID}?_scope=certificates`,session).then((result)=>{
            setUploadedFiles(result.certificates)
        })
    },[projectGUID]);

    return (
        <div>

            {uploadedFiles && uploadedFiles.length > 0 ? (
                <div className={styles.formField}>
                    {uploadedFiles.map((report) => {
                        return (
                            <div key={report.id} className={` ${styles.reportPDFContainer}`}>
                                <a target={"_blank"} href={getPDFFile('projectCertificate', report.pdf)}>
                                    {/* <PDFIcon color="#2F3336" /> */}
                                    <PDFRed />
                                </a>
                                <div className={styles.reportPDFDetails}>
                                    <p style={{ fontWeight: 'bold' }}>Certified By {report.certifierName} </p>
                                    <p>on {report.issueDate} </p>
                                </div>
                                <div className={styles.reportEditButton} style={{ marginRight: '8px' }}>
                                    <PencilIcon color={"#000"} />
                                </div>
                                <div
                                    onClick={() => deleteProjectCertificate(report.id)}
                                    className={styles.reportEditButton}>
                                    <TrashIcon />
                                </div>
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
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                                    message: 'Please add Certification date'
                                }
                            })}
                        />

                    </MuiPickersUtilsProvider>
                    {errors.issueDate && (
                        <span className={styles.formErrors}>
                            {errors.issueDate.message}
                        </span>
                    )}
                </div>
            </div>



            {errors.certifierName || errors.issueDate || !isDirty || certifierName === '' ? (
                <div className={styles.formFieldLarge} style={{ opacity: 0.35 }}>
                    <div className={styles.fileUploadContainer}>
                        <AnimatedButton
                            className={styles.continueButton}
                        >
                            Upload Certificate
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
                                    Upload Certificate
                                </AnimatedButton>
                            <p style={{ marginTop: '18px' }}>
                                or drag in a pdf
                                </p>
                        </div>
                    </div>
                )}
            </>) : (
            <div className={styles.formFieldLarge} onClick={()=>setShowForm(true)}>
                <p className={styles.inlineLinkButton}>Add another cerification</p>
            </div>)}

        </div>
    )
}

export default ProjectCertificates

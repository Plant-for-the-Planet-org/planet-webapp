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
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';

const { useTranslation } = i18next;


interface Props {
    projectGUID: String;
    session: any;
}

function ProjectCertificates({ projectGUID, session }: Props): ReactElement {
    const { t, i18n } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors, control, formState, getValues, setValue } = useForm({ mode: 'all' });
    const { isDirty } = formState;

    const [issueDate, setIssueDate] = React.useState(new Date());

    const [certifierName, setCertifierName] = React.useState('');

    const [uploadedFiles, setUploadedFiles] = React.useState([])

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
        })
        // handleNext()
    };

    return (
        <div>
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

            <div className={styles.formFieldLarge}>
                <p className={styles.inlineLinkButton}>Add another cerification</p>
            </div>
        </div>
    )
}

export default ProjectCertificates

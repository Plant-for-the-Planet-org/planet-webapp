import React, { ReactElement } from 'react';
import styles from './../StepForm.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useDropzone } from 'react-dropzone';
import {
  deleteAuthenticatedRequest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import PDFRed from '../../../../../public/assets/images/icons/manageProjects/PDFRed';
import { getPDFFile } from '../../../../utils/getImageURL';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  SxProps,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';
import { handleError, APIError, Certificate } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import {
  CertificateScopeProjects,
  ProjectCertificatesProps,
} from '../../../common/types/project';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { useTenant } from '../../../common/Layout/TenantContext';

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

function ProjectCertificates({
  projectGUID,
  token,
  setIsUploadingData,
  userLang,
}: ProjectCertificatesProps): ReactElement {
  const t = useTranslations('ManageProjects');
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();
  const { tenantConfig } = useTenant();
  const {
    control,
    setValue,
    formState: { errors },
    watch,
    getValues,
  } = useForm({ mode: 'all' });

  const certifierName = watch('certifierName');
  const [uploadedFiles, setUploadedFiles] = React.useState<Certificate[]>([]);
  const [showForm, setShowForm] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  );
  const [isCertified, setisCertified] = React.useState<boolean>(true);
  const [showToggle, setShowToggle] = React.useState<boolean>(true);

  const onSubmit = async (pdf: string) => {
    const { issueDate, certifierName } = getValues();
    setIsUploadingData(true);
    const submitData = {
      issueDate: issueDate.getFullYear(),
      certifierName: certifierName,
      pdfFile: pdf,
    };

    try {
      const res = await postAuthenticatedRequest<Certificate>(
        tenantConfig?.id,
        `/app/projects/${projectGUID}/certificates`,
        submitData,
        token,
        logoutUser
      );
      let newUploadedFiles = uploadedFiles;

      if (newUploadedFiles === undefined) {
        newUploadedFiles = [];
      }

      newUploadedFiles.push(res);
      setUploadedFiles(newUploadedFiles);
      setValue('certifierName', '', { shouldDirty: false });
      setIsUploadingData(false);
      setShowForm(false);
      setErrorMessage('');
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const onDrop = React.useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string')
            onSubmit(event.target?.result);
        };
      });
    },
    [uploadedFiles]
  );

  React.useEffect(() => {
    // Fetch certificates of the project

    const fetchCertificates = async () => {
      try {
        const result = await getAuthenticatedRequest<CertificateScopeProjects>(
          tenantConfig?.id,
          `/app/profile/projects/${projectGUID}?_scope=certificates`,
          token,
          logoutUser
        );
        setShowForm(false);
        setShowToggle(false);
        setUploadedFiles(result.certificates);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/profile');
        setShowToggle(true);
        setisCertified(false);
        setShowForm(true);
      }
    };
    if (projectGUID && token) {
      fetchCertificates();
    }
  }, [projectGUID]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    multiple: false,
    maxSize: 10485760,
    onDropAccepted: onDrop,
    onDrop: () => {
      console.log('uploading');
    },
    onDropRejected: (err) => {
      if (err[0].errors[0].code === 'file-too-large') {
        setErrorMessage(t('fileSizeLimit'));
      } else if (err[0].errors[0].code === 'file-invalid-type') {
        setErrorMessage(t('filePDFOnly'));
      }
    },
  });

  const deleteProjectCertificate = async (id: string) => {
    try {
      await deleteAuthenticatedRequest(
        tenantConfig?.id,
        `/app/projects/${projectGUID}/certificates/${id}`,
        token,
        logoutUser
      );
      const uploadedFilesTemp = uploadedFiles.filter((item) => item.id !== id);
      setUploadedFiles(uploadedFilesTemp);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  React.useEffect(() => {
    if (uploadedFiles && uploadedFiles.length === 0) {
      setShowToggle(true);
      setShowForm(true);
      setisCertified(false);
    }
  }, [uploadedFiles]);

  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

  return (
    <div className={styles.certificateContainer}>
      {showToggle && (
        <FormControlLabel
          label={t('isCertified')}
          labelPlacement="end"
          control={
            <Switch
              name="isCertified"
              id="isCertified"
              checked={isCertified}
              onChange={() => setisCertified(!isCertified)}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          }
        />
      )}

      {uploadedFiles && uploadedFiles.length > 0 ? (
        <div className={styles.formField}>
          {uploadedFiles.map((report) => {
            return (
              <div key={report.id} className={` ${styles.reportPDFContainer}`}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getPDFFile('projectCertificate', report.pdf)}
                >
                  <PDFRed />
                </a>
                <div className={styles.reportPDFDetails}>
                  <p style={{ fontWeight: 'bold' }}>
                    {' '}
                    {t('certifiedBy')} {report.certifierName}{' '}
                  </p>
                  <p>{report.issueDate} </p>
                </div>
                {/* <div className={styles.reportEditButton} style={{ marginRight: '8px' }}>
                                    <PencilIcon color={"#000"} />
                                </div> */}
                <button
                  id="trashIconProjC"
                  onClick={() => deleteProjectCertificate(report.id)}
                  className={styles.reportEditButton}
                >
                  <TrashIcon />
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {showForm && isCertified ? (
        <>
          <InlineFormDisplayGroup>
            <Controller
              name="certifierName"
              rules={{ required: true }}
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                  label={t('certifierName')}
                  variant="outlined"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.certifierName !== undefined}
                  helperText={
                    errors.certifierName !== undefined &&
                    errors.certifierName.message
                  }
                />
              )}
            />

            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={
                localeMapForDate[userLang]
                  ? localeMapForDate[userLang]
                  : localeMapForDate['en']
              }
            >
              <Controller
                name="issueDate"
                control={control}
                rules={{
                  required: t('certificationDateValidation'),
                }}
                defaultValue={new Date()}
                render={({ field: { onChange, value } }) => (
                  <MuiDatePicker
                    label={t('issueDate')}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        error={errors.issueDate !== undefined}
                        helperText={
                          errors.issueDate !== undefined &&
                          errors.issueDate.message
                        }
                      />
                    )}
                    disableFuture
                    maxDate={new Date()}
                    minDate={tenYearsAgo}
                    DialogProps={{
                      sx: dialogSx,
                    }}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </LocalizationProvider>
          </InlineFormDisplayGroup>

          {errorMessage && errorMessage !== '' ? (
            <div className={styles.formFieldLarge}>
              <h4 className={styles.errorMessage}>{errorMessage}</h4>
            </div>
          ) : null}

          {errors.certifierName || errors.issueDate || certifierName === '' ? (
            <div style={{ opacity: 0.35 }}>
              <div className={styles.fileUploadContainer}>
                <Button variant="contained">{t('uploadCertificate')}</Button>
                <p style={{ marginTop: '18px' }}>{t('dragIn')}</p>
              </div>
            </div>
          ) : (
            <div {...getRootProps()}>
              <div className={styles.fileUploadContainer}>
                <Button variant="contained">
                  <input {...getInputProps()} />
                  {t('uploadCertificate')}
                </Button>
                <p style={{ marginTop: '18px' }}>{t('dragInPdf')}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <></>
      )}

      {uploadedFiles && uploadedFiles.length > 0 && !showForm ? (
        <div
          className={styles.formFieldLarge}
          onClick={() => setShowForm(true)}
        >
          <p className={styles.inlineLinkButton}>{t('addCertificate')}</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ProjectCertificates;

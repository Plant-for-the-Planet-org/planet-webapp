import React, { ReactElement } from 'react';
import styles from './../StepForm.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
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
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SxProps } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';
import { handleError, APIError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

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

interface Props {
  projectGUID: String;
  token: any;
  setIsUploadingData: Function;
  userLang: String;
}

function ProjectCertificates({
  projectGUID,
  token,
  setIsUploadingData,
  userLang,
}: Props): ReactElement {
  const { t, ready } = useTranslation(['manageProjects']);
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();

  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'all' });

  const { issueDate, certifierName } = getValues();

  const [uploadedFiles, setUploadedFiles] = React.useState<Array<any>>();
  const [showForm, setShowForm] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isCertified, setisCertified] = React.useState(true);
  const [showToggle, setShowToggle] = React.useState(true);

  const onDrop = React.useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = (event) => {
          onSubmit(event.target.result);
        };
      });
    },
    [uploadedFiles]
  );

  React.useEffect(() => {
    // Fetch certificates of the project

    const fetchCertificates = async () => {
      try {
        const result = await getAuthenticatedRequest(
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: '.pdf',
    multiple: false,
    maxSize: 10485760,
    onDropAccepted: onDrop,
    onDrop: () => {
      console.log('uploading');
    },
    onDropRejected: (err) => {
      if (err[0].errors[0].code === 'file-too-large') {
        setErrorMessage(t('manageProjects:fileSizeLimit'));
      } else if (err[0].errors[0].code === 'file-invalid-type') {
        setErrorMessage(t('manageProjects:filePDFOnly'));
      }
    },
  });

  const onSubmit = async (pdf: any) => {
    setIsUploadingData(true);
    const submitData = {
      issueDate: issueDate.getFullYear(),
      certifierName: certifierName,
      pdfFile: pdf,
    };

    try {
      const res = await postAuthenticatedRequest(
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

  const deleteProjectCertificate = async (id: any) => {
    try {
      await deleteAuthenticatedRequest(
        `/app/projects/${projectGUID}/certificates/${id}`,
        token,
        logoutUser
      );
      const uploadedFilesTemp = uploadedFiles!.filter((item) => item.id !== id);
      setUploadedFiles(uploadedFilesTemp);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  React.useEffect(() => {
    if (uploadedFiles && !uploadedFiles.length > 0) {
      setShowToggle(true);
      setShowForm(true);
      setisCertified(false);
    }
  }, [uploadedFiles]);

  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

  return ready ? (
    <div>
      {showToggle && (
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <div className={`${styles.formFieldRadio}`}>
              <label htmlFor="isCertified" style={{ cursor: 'pointer' }}>
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
                    {t('manageProjects:certifiedBy')} {report.certifierName}{' '}
                  </p>
                  <p>{report.issueDate} </p>
                </div>
                {/* <div className={styles.reportEditButton} style={{ marginRight: '8px' }}>
                                    <PencilIcon color={"#000"} />
                                </div> */}
                <button
                  id={'trashIconProjC'}
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
          <div className={styles.formField}>
            <div className={styles.formFieldHalf}>
              <Controller
                name="certifierName"
                rules={{ required: true }}
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaterialTextField
                    label={t('manageProjects:certifierName')}
                    variant="outlined"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />

              {errors.certifierName && (
                <span className={styles.formErrors}>
                  {errors.certifierName.message}
                </span>
              )}
            </div>
            <div style={{ width: '20px' }}></div>
            <div className={styles.formFieldHalf}>
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
                    required: t('manageProjects:certificationDateValidation'),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <MuiDatePicker
                      label={t('manageProjects:issueDate')}
                      renderInput={(props) => <MaterialTextField {...props} />}
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
              {errors.issueDate && (
                <span className={styles.formErrors}>
                  {errors.issueDate.message}
                </span>
              )}
            </div>
          </div>

          {errorMessage && errorMessage !== '' ? (
            <div className={styles.formFieldLarge}>
              <h4 className={styles.errorMessage}>{errorMessage}</h4>
            </div>
          ) : null}

          {errors.certifierName || errors.issueDate || certifierName === '' ? (
            <div className={styles.formFieldLarge} style={{ opacity: 0.35 }}>
              <div className={styles.fileUploadContainer}>
                <div className="primaryButton" style={{ maxWidth: '240px' }}>
                  {t('manageProjects:uploadCertificate')}
                </div>
                <p style={{ marginTop: '18px' }}>
                  {t('manageProjects:dragIn')}
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.formFieldLarge} {...getRootProps()}>
              <div className={styles.fileUploadContainer}>
                <div className="primaryButton" style={{ maxWidth: '240px' }}>
                  <input {...getInputProps()} />
                  {t('manageProjects:uploadCertificate')}
                </div>
                <p style={{ marginTop: '18px' }}>
                  {t('manageProjects:dragInPdf')}
                </p>
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
          <p className={styles.inlineLinkButton}>
            {t('manageProjects:addCertificate')}
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
}

export default ProjectCertificates;

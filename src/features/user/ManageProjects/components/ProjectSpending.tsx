import React, { ReactElement, useState } from 'react';
import styles from './../StepForm.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import { useDropzone } from 'react-dropzone';
import {
  deleteAuthenticatedRequest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import { getPDFFile } from '../../../../utils/getImageURL';
import PDFRed from '../../../../../public/assets/images/icons/manageProjects/PDFRed';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SxProps } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

const yearDialogSx: SxProps = {
  '& .PrivatePickersYear-yearButton': {
    '&:hover': {
      backgroundColor: themeProperties.primaryColor,
      color: '#fff',
    },

    '&.Mui-selected': {
      backgroundColor: `${themeProperties.primaryColor} !important`,
      color: '#fff',
    },
  },
  '.MuiDialogActions-root': {
    paddingBottom: '12px',
  },
};

interface Props {
  handleNext: Function;
  handleBack: Function;
  projectGUID: String;
  handleReset: Function;
  token: any;
  userLang: String;
}

export default function ProjectSpending({
  handleBack,
  token,
  handleNext,
  userLang,
  projectGUID,
  handleReset,
}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['manageProjects', 'common']);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const {
    register,
    handleSubmit,
    errors,
    formState,
    getValues,
    setValue,
    control,
  } = useForm({ mode: 'all' });

  const [amount, setAmount] = React.useState(0);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [showForm, setShowForm] = React.useState(true);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const { impersonatedEmail } = React.useContext(UserPropsContext);
  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset(ready ? t('manageProjects:resetMessage') : '');
    }
  });

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
        setErrorMessage(t('manageProjects:fileSizeLimit'));
      } else if (err[0].errors[0].code === 'file-invalid-type') {
        setErrorMessage(t('manageProjects:filePDFOnly'));
      }
    },
  });

  const { isDirty, isSubmitting } = formState;

  const onSubmit = (pdf: any) => {
    setIsUploadingData(true);
    const updatedAmount = getValues('amount');
    const year = getValues('year');

    const submitData = {
      year: year.getFullYear(),
      amount: updatedAmount,
      pdfFile: pdf,
    };

    postAuthenticatedRequest(
      `/app/projects/${projectGUID}/expenses`,
      submitData,
      token,
      impersonatedEmail,
      handleError
    )
      .then((res) => {
        if (!res.code) {
          const newUploadedFiles = uploadedFiles;
          newUploadedFiles.push(res);
          setUploadedFiles(newUploadedFiles);
          setAmount(0);
          setValue('amount', 0, { shouldDirty: false });
          setIsUploadingData(false);
          setShowForm(false);
          setErrorMessage('');
          handleNext();
        } else {
          if (res.code === 404) {
            setIsUploadingData(false);
            setErrorMessage(ready ? t('manageProjects:projectNotFound') : '');
          } else {
            setIsUploadingData(false);
            setErrorMessage(res.message);
          }
        }
      })
      .catch((err) => {
        setIsUploadingData(false);
        setErrorMessage(err);
      });
  };

  const deleteProjectSpending = (id: any) => {
    setIsUploadingData(true);
    deleteAuthenticatedRequest(
      `/app/projects/${projectGUID}/expenses/${id}`,
      token,
      impersonatedEmail,
      handleError
    ).then((res) => {
      if (res !== 404) {
        const uploadedFilesTemp = uploadedFiles.filter(
          (item) => item.id !== id
        );
        setUploadedFiles(uploadedFilesTemp);
        setIsUploadingData(false);
      }
    });
  };

  React.useEffect(() => {
    // Fetch spending of the project
    if (projectGUID && token)
      getAuthenticatedRequest(
        `/app/profile/projects/${projectGUID}?_scope=expenses`,
        token,
        impersonatedEmail,
        {},
        handleError,
        '/profile'
      ).then((result) => {
        if (result?.expenses && result.expenses.length > 0) {
          setShowForm(false);
        }
        setUploadedFiles(result.expenses);
      });
  }, [projectGUID]);

  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  return ready ? (
    <div className={styles.stepContainer}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {uploadedFiles && uploadedFiles.length > 0 ? (
          <div className={styles.formField}>
            {uploadedFiles.map((report) => {
              return (
                <div
                  key={report.id}
                  className={` ${styles.reportPDFContainer}`}
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={getPDFFile('projectExpense', report.pdf)}
                  >
                    <PDFRed />
                  </a>
                  <div className={styles.reportPDFDetails}>
                    <p style={{ fontWeight: 'bold' }}>€ {report.amount} </p>
                    <p>in {report.year} </p>
                  </div>
                  {/* <div className={styles.reportEditButton} style={{ marginRight: '8px' }}>
                                        <PencilIcon color={"#000"} />
                                    </div> */}
                  <button
                    id={'trashIconProjSpend'}
                    onClick={() => deleteProjectSpending(report.id)}
                    className={styles.reportEditButton}
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
        {showForm ? (
          <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
            <div className={styles.formField}>
              <div className={`${styles.formFieldHalf}`}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={
                    localeMapForDate[userLang]
                      ? localeMapForDate[userLang]
                      : localeMapForDate['en']
                  }
                >
                  <Controller
                    render={(properties) => (
                      <MuiDatePicker
                        inputRef={register({
                          required: {
                            value: true,
                            message: t('manageProjects:spendingYearValidation'),
                          },
                        })}
                        views={['year']}
                        value={properties.value}
                        onChange={properties.onChange}
                        label={t('manageProjects:spendingYear')}
                        renderInput={(props) => (
                          <MaterialTextField {...props} />
                        )}
                        disableFuture
                        minDate={fiveYearsAgo}
                        maxDate={new Date()}
                        DialogProps={{
                          sx: yearDialogSx,
                        }}
                      />
                    )}
                    defaultValue={new Date()}
                    name="year"
                    control={control}
                  />
                </LocalizationProvider>
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
                    validate: (value) => parseInt(value) > 0,
                    required: {
                      value: true,
                      message: t('manageProjects:spendingAmountValidation'),
                    },
                  })}
                  label={t('manageProjects:spendingAmount')}
                  placeholder={0}
                  type="number"
                  onBlur={(e) => e.preventDefault()}
                  variant="outlined"
                  name="amount"
                  onInput={(e) => {
                    setAmount(e.target.value);
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
                  <div className="primaryButton" style={{ maxWidth: '240px' }}>
                    {t('manageProjects:uploadReport')}
                  </div>
                  <p style={{ marginTop: '18px' }}>
                    {t('manageProjects:dragInPdf')}
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.formFieldLarge} {...getRootProps()}>
                <div className={styles.fileUploadContainer}>
                  <div className="primaryButton" style={{ maxWidth: '240px' }}>
                    <input {...getInputProps()} />
                    {t('manageProjects:uploadReport')}
                  </div>
                  <p style={{ marginTop: '18px' }}>
                    {t('manageProjects:dragInPdf')}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={styles.formFieldLarge}
            onClick={() => setShowForm(true)}
          >
            <p className={styles.inlineLinkButton}>
              {t('manageProjects:addAnotherYear')}
            </p>
          </div>
        )}

        {errorMessage && errorMessage !== '' ? (
          <div className={styles.formFieldLarge}>
            <h4 className={styles.errorMessage}>{errorMessage}</h4>
          </div>
        ) : null}

        <div className={styles.formField}>
          <div className={`${styles.formFieldHalf}`}>
            <button
              onClick={handleBack}
              className="secondaryButton"
              style={{ width: '234px', height: '46px' }}
            >
              <BackArrow />
              <p>{t('manageProjects:backToSites')}</p>
            </button>
          </div>

          <div style={{ width: '20px' }}></div>
          <div className={`${styles.formFieldHalf}`}>
            <button
              onClick={() => {
                if (uploadedFiles && uploadedFiles.length > 0) {
                  handleNext();
                } else {
                  setErrorMessage('Please upload  report');
                }
              }}
              className="primaryButton"
              style={{ width: '169px', height: '46px', marginRight: '20px' }}
              data-test-id="projSpendingCont"
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                t('common:continue')
              )}
            </button>
          </div>
          <div className={`${styles.formFieldHalf}`}>
            <button
              className="primaryButton"
              style={{ width: '89px', marginRight: '35px' }}
              onClick={handleNext}
            >
              {t('manageProjects:skip')}
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <></>
  );
}

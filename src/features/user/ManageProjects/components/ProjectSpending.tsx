import React, { ReactElement } from 'react';
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
import { handleError, APIError } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';

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
  const { t, ready } = useTranslation(['manageProjects', 'common']);
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const {
    formState: { errors, isDirty },
    getValues,
    setValue,
    control,
  } = useForm({ mode: 'all' });

  const [amount, setAmount] = React.useState(0);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [showForm, setShowForm] = React.useState(true);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const { logoutUser } = useUserProps();
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

  const onSubmit = async (pdf: any) => {
    setIsUploadingData(true);
    const updatedAmount = getValues('amount');
    const year = getValues('year');

    const submitData = {
      year: year.getFullYear(),
      amount: updatedAmount,
      pdfFile: pdf,
    };

    try {
      const res = await postAuthenticatedRequest(
        `/app/projects/${projectGUID}/expenses`,
        submitData,
        token,
        logoutUser
      );
      const newUploadedFiles = uploadedFiles;
      newUploadedFiles.push(res);
      setUploadedFiles(newUploadedFiles);
      setAmount(0);
      setValue('amount', 0, { shouldDirty: false });
      setIsUploadingData(false);
      setShowForm(false);
      setErrorMessage('');
      handleNext();
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const deleteProjectSpending = async (id: any) => {
    try {
      setIsUploadingData(true);
      await deleteAuthenticatedRequest(
        `/app/projects/${projectGUID}/expenses/${id}`,
        token,
        logoutUser
      );
      const uploadedFilesTemp = uploadedFiles.filter((item) => item.id !== id);
      setUploadedFiles(uploadedFilesTemp);
      setIsUploadingData(false);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const fetchProjSpending = async () => {
    try {
      // Fetch spending of the project
      if (projectGUID && token) {
        const result = await getAuthenticatedRequest(
          `/app/profile/projects/${projectGUID}?_scope=expenses`,
          token,
          logoutUser
        );
        if (result?.expenses && result.expenses.length > 0) {
          setShowForm(false);
        }
        setUploadedFiles(result.expenses);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/profile');
    }
  };

  React.useEffect(() => {
    fetchProjSpending();
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
                  adapterLocale={
                    localeMapForDate[userLang]
                      ? localeMapForDate[userLang]
                      : localeMapForDate['en']
                  }
                >
                  <Controller
                    name="year"
                    control={control}
                    defaultValue={new Date()}
                    rules={{
                      required: t('manageProjects:spendingYearValidation'),
                    }}
                    render={({ field: { onChange, value } }) => (
                      <MuiDatePicker
                        views={['year']}
                        openTo="year"
                        value={value}
                        onChange={onChange}
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
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: t('manageProjects:spendingAmountValidation'),
                    validate: (value) => parseInt(value) > 0,
                  }}
                  defaultValue=""
                  render={({ field: { onChange, value, onBlur } }) => (
                    <MaterialTextField
                      label={t('manageProjects:spendingAmount')}
                      placeholder="0"
                      type="number"
                      variant="outlined"
                      onChange={(e) => {
                        setAmount(e.target.value);
                        onChange(e.target.value);
                      }}
                      value={value}
                      onBlur={onBlur}
                      InputProps={{
                        startAdornment: (
                          <p
                            className={styles.inputStartAdornment}
                            style={{ paddingRight: '4px' }}
                          >{`€`}</p>
                        ),
                      }}
                    />
                  )}
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

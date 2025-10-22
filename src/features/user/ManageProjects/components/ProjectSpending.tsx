import type { ReactElement } from 'react';
import type { APIError, ProjectExpense } from '@planet-sdk/common';
import type {
  ProjectSpendingProps,
  ExpensesScopeProjects,
} from '../../../common/types/project';

import { useEffect, useState, useContext, useCallback } from 'react';
import styles from './../StepForm.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import { useDropzone } from 'react-dropzone';
import { getPDFFile } from '../../../../utils/getImageURL';
import PDFRed from '../../../../../public/assets/images/icons/manageProjects/PDFRed';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button, TextField, IconButton } from '@mui/material';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import StyledForm from '../../../common/Layout/StyledForm';
import InlineFormDisplayGroup from '../../../common/Layout/Forms/InlineFormDisplayGroup';
import { handleError } from '@planet-sdk/common';
import { ProjectCreationTabs } from '..';
import { useApi } from '../../../../hooks/useApi';

type ExpenseFormData = {
  year: Date;
  amount: number;
};

type ExpenseApiPayload = {
  year: number;
  amount: number;
  pdfFile: string | ArrayBuffer | null | undefined;
};

export default function ProjectSpending({
  handleBack,
  token,
  handleNext,
  userLang,
  projectGUID,
}: ProjectSpendingProps): ReactElement {
  const tManageProjects = useTranslations('ManageProjects');
  const tCommon = useTranslations('Common');
  const { redirect, setErrors } = useContext(ErrorHandlingContext);
  const {
    formState: { errors, isDirty },
    getValues,
    setValue,
    control,
  } = useForm<ExpenseFormData>({ mode: 'all' });
  const { postApiAuthenticated, deleteApiAuthenticated, getApiAuthenticated } =
    useApi();
  const [amount, setAmount] = useState<number | string>(0);
  const [isUploadingData, setIsUploadingData] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [uploadedFiles, setUploadedFiles] = useState<ProjectExpense[]>([]);

  const onSubmit = async (pdf: string | ArrayBuffer | null | undefined) => {
    setIsUploadingData(true);
    const updatedAmount = getValues('amount');
    const year = getValues('year');

    const projectExpensePayload: ExpenseApiPayload = {
      year: year.getFullYear(),
      amount: updatedAmount,
      pdfFile: pdf,
    };

    try {
      const res = await postApiAuthenticated<ProjectExpense, ExpenseApiPayload>(
        `/app/projects/${projectGUID}/expenses`,
        {
          payload: projectExpensePayload,
        }
      );
      const newUploadedFiles = uploadedFiles;
      newUploadedFiles.push(res);
      setUploadedFiles(newUploadedFiles);
      setAmount(0);
      setValue('amount', 0, { shouldDirty: false });
      setIsUploadingData(false);
      setShowForm(false);
      setErrorMessage('');
      handleNext(ProjectCreationTabs.REVIEW);
    } catch (err) {
      setIsUploadingData(false);
      setErrors(handleError(err as APIError));
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = (event) => {
          onSubmit(event?.target?.result);
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
        setErrorMessage(tManageProjects('fileSizeLimit'));
      } else if (err[0].errors[0].code === 'file-invalid-type') {
        setErrorMessage(tManageProjects('filePDFOnly'));
      }
    },
  });

  const deleteProjectSpending = async (id: string) => {
    try {
      setIsUploadingData(true);
      await deleteApiAuthenticated(
        `/app/projects/${projectGUID}/expenses/${id}`
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
        const result = await getApiAuthenticated<ExpensesScopeProjects>(
          `/app/profile/projects/${projectGUID}`,
          { queryParams: { _scope: 'expenses' } }
        );
        if (result?.expenses && result.expenses.length > 0) {
          setShowForm(false);
        }
        setUploadedFiles(result.expenses);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  useEffect(() => {
    fetchProjSpending();
  }, [projectGUID]);

  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  return (
    <CenteredContainer>
      <StyledForm>
        {uploadedFiles && uploadedFiles.length > 0 ? (
          <InlineFormDisplayGroup>
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
                  <IconButton
                    id={'trashIconProjSpend'}
                    onClick={() => deleteProjectSpending(report.id)}
                    className={styles.reportEditButton}
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
              );
            })}
          </InlineFormDisplayGroup>
        ) : null}
        {showForm ? (
          <div
            className={`${styles.expenseContainer} ${
              isUploadingData ? styles.shallowOpacity : ''
            }`}
            style={{ width: 'inherit' }}
          >
            <InlineFormDisplayGroup>
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
                    required: tManageProjects('spendingYearValidation'),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <MuiDatePicker
                      views={['year']}
                      openTo="year"
                      value={value}
                      onChange={onChange}
                      label={tManageProjects('spendingYear')}
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          error={errors.year !== undefined}
                          helperText={
                            errors.year !== undefined && errors.year.message
                          }
                        />
                      )}
                      disableFuture
                      minDate={fiveYearsAgo}
                      maxDate={new Date()}
                    />
                  )}
                />
              </LocalizationProvider>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: tManageProjects('spendingAmountValidation'),
                  validate: (value) => value > 0,
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextField
                    label={tManageProjects('spendingAmount')}
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
                    error={errors.amount !== undefined}
                    helperText={
                      errors.amount !== undefined && errors.amount.message
                    }
                  />
                )}
              />
            </InlineFormDisplayGroup>

            {errors.amount || errors.year || !isDirty || amount === 0 ? (
              <div style={{ opacity: 0.35 }}>
                <div className={styles.fileUploadContainer}>
                  <Button variant="contained">
                    {tManageProjects('uploadReport')}
                  </Button>
                  <p style={{ marginTop: '18px' }}>
                    {tManageProjects('dragInPdf')}
                  </p>
                </div>
              </div>
            ) : (
              <div {...getRootProps()}>
                <div className={styles.fileUploadContainer}>
                  <Button variant="contained">
                    <input {...getInputProps()} />
                    {tManageProjects('uploadReport')}
                  </Button>
                  <p style={{ marginTop: '18px' }}>
                    {tManageProjects('dragInPdf')}
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
              {tManageProjects('addAnotherYear')}
            </p>
          </div>
        )}

        {errorMessage && errorMessage !== '' ? (
          <div className={styles.formFieldLarge}>
            <h4 className={styles.errorMessage}>{errorMessage}</h4>
          </div>
        ) : null}

        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            onClick={() => handleBack(ProjectCreationTabs.PROJECT_SITES)}
            variant="outlined"
            className="formButton"
            startIcon={<BackArrow />}
          >
            <p>{tManageProjects('backToSites')}</p>
          </Button>

          <Button
            onClick={() => {
              if (uploadedFiles && uploadedFiles.length > 0) {
                handleNext(ProjectCreationTabs.REVIEW);
              } else {
                setErrorMessage('Please upload  report');
              }
            }}
            variant="contained"
            className="formButton"
          >
            {isUploadingData ? (
              <div className={styles.spinner}></div>
            ) : (
              tCommon('continue')
            )}
          </Button>

          <Button
            className="formButton"
            variant="contained"
            onClick={() => handleNext(ProjectCreationTabs.REVIEW)}
          >
            {tManageProjects('skip')}
          </Button>
        </div>
      </StyledForm>
    </CenteredContainer>
  );
}

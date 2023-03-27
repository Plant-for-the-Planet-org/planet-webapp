import styles from './index.module.scss';
import MuiButton from '../../../../../common/InputTypes/MuiButton';
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';
import ProjectSelectAutocomplete from '../ProjectSelectAutocomplete';
import {
  Project,
  useAnalytics,
} from '../../../../../common/Layout/AnalyticsContext';
import { useContext, useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { localeMapForDate } from '../../../../../../utils/language/getLanguageName';
import { UserPropsContext } from '../../../../../common/Layout/UserPropsContext';
import { SxProps } from '@mui/material';
import themeProperties from '../../../../../../theme/themeProperties';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useTranslation } from 'react-i18next';
import MaterialTextField from '../../../../../common/InputTypes/MaterialTextField';
import { format, subYears } from 'date-fns';
import ProjectTypeSelector, { ProjectType } from '../ProjectTypeSelector';
import { Container } from '../Container';
import { ErrorHandlingContext } from '../../../../../common/Layout/ErrorHandlingContext';

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

export const Export = () => {
  const { t, ready } = useTranslation('treemapperAnalytics');
  const { projectList, project, fromDate, toDate } = useAnalytics();
  const { userLang } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);

  const [localProject, setLocalProject] = useState<Project | null>(null);
  const [localFromDate, setLocalFromDate] = useState<Date>(fromDate);
  const [localToDate, setLocalToDate] = useState<Date>(toDate);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);

  useEffect(() => {
    setLocalFromDate(fromDate);
  }, [fromDate]);

  useEffect(() => {
    setLocalToDate(toDate);
  }, [toDate]);

  const description = [
    {
      title: 'hid',
      description: t('exportColumnHeaders.hid'),
    },
    {
      title: 'plant_date',
      description: t('exportColumnHeaders.plantDate'),
    },
    {
      title: 'species',
      description: t('exportColumnHeaders.species'),
    },
    {
      title: 'tree_count',
      description: t('exportColumnHeaders.treeCount'),
    },
    {
      title: 'geometry',
      description: t('exportColumnHeaders.geometry'),
    },
    {
      title: 'type',
      description: t('exportColumnHeaders.type'),
    },
    {
      title: 'trees_allocated',
      description: t('exportColumnHeaders.treesAllocated'),
    },
    {
      title: 'trees_planted',
      description: t('exportColumnHeaders.treesPlanted'),
    },
    {
      title: 'metadata',
      description: t('exportColumnHeaders.metadata'),
    },
    {
      title: 'description',
      description: t('exportColumnHeaders.description'),
    },
    {
      title: 'plant_project_id',
      description: t('exportColumnHeaders.plantProjectId'),
    },
    {
      title: 'sample_tree_count',
      description: t('exportColumnHeaders.sampleTreeCount'),
    },
    {
      title: 'capture_status',
      description: t('exportColumnHeaders.captureStatus'),
    },
    {
      title: 'created',
      description: t('exportColumnHeaders.createds'),
    },
  ];

  const getSheetTitle = () => {
    switch (projectType) {
      case ProjectType.INTERVENTIONS:
        return t('interventionData');

      case ProjectType.MONITORING_PLOTS:
        return t('monitoringPlotsData');
    }
  };

  const extractDataToXlsx = (data) => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();

    const descWorksheet = utils.json_to_sheet(
      description.map((d) => ({
        column_title: d.title,
        description: d.description,
      }))
    );
    utils.book_append_sheet(workbook, worksheet, getSheetTitle());
    utils.book_append_sheet(workbook, descWorksheet, t('readme'));
    const xlsxBuffer = write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([xlsxBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(
      blob,
      `${localProject?.name}__${format(localFromDate, 'dd-MMM-yy')}__${format(
        localToDate,
        'dd-MMM-yy'
      )}`
    );
  };

  const handleExport = async () => {
    if (localProject) {
      // TODO - Once error handling PR is merged refactor this fetch call with a makeNextRequest function

      const res = await fetch('/api/data-explorer/export', {
        method: 'POST',
        body: JSON.stringify({
          projectId: localProject.id,
          startDate: localFromDate,
          endDate: localToDate,
        }),
      });

      const { data } = await res.json();

      if (data.length === 0) {
        handleError({ message: t('errors.emptyExportData'), type: 'error' });
        return;
      }

      extractDataToXlsx(data);
    }
  };

  const handleProjectChange = (proj: Project | null) => {
    setLocalProject(proj);
  };

  const handleProjectTypeChange = (projType: ProjectType | null) => {
    setProjectType(projType);
  };

  return ready ? (
    <Container title={t('exportData')}>
      <div className={styles.container}>
        <ProjectTypeSelector
          handleProjectTypeChange={handleProjectTypeChange}
        />

        <ProjectSelectAutocomplete
          projectList={projectList || []}
          project={project}
          handleProjectChange={handleProjectChange}
        />

        <div className={styles.datePickerContainer}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            locale={
              localeMapForDate[userLang]
                ? localeMapForDate[userLang]
                : localeMapForDate['en']
            }
          >
            <MuiDatePicker
              label={t('treemapperAnalytics:from')}
              value={localFromDate}
              onChange={setLocalFromDate}
              renderInput={(props) => (
                <MaterialTextField variant="outlined" {...props} />
              )}
              inputFormat="MMMM d, yyyy"
              maxDate={new Date()}
              DialogProps={{
                sx: dialogSx,
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            locale={
              localeMapForDate[userLang]
                ? localeMapForDate[userLang]
                : localeMapForDate['en']
            }
          >
            <MuiDatePicker
              label={t('treemapperAnalytics:from')}
              value={localToDate}
              onChange={setLocalToDate}
              renderInput={(props) => (
                <MaterialTextField variant="outlined" {...props} />
              )}
              inputFormat="MMMM d, yyyy"
              maxDate={new Date()}
              DialogProps={{
                sx: dialogSx,
              }}
            />
          </LocalizationProvider>
        </div>

        <div className={styles.buttonContainer}>
          <MuiButton fullWidth variant="contained" onClick={handleExport}>
            {t('export')}
          </MuiButton>
        </div>
      </div>
    </Container>
  ) : null;
};

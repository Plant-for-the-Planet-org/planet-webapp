import type { IExportData } from '../../../../../common/types/dataExplorer';
import type { Project } from '../../../../../common/Layout/AnalyticsContext';

import styles from './index.module.scss';
import MuiButton from '../../../../../common/InputTypes/MuiButton';
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';
import ProjectSelectAutocomplete from '../ProjectSelectAutocomplete';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { localeMapForDate } from '../../../../../../utils/language/getLanguageName';
import { useUserProps } from '../../../../../common/Layout/UserPropsContext';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useTranslations } from 'next-intl';
import { TextField } from '@mui/material';
import { format } from 'date-fns';
import ProjectTypeSelector, { ProjectType } from '../ProjectTypeSelector';
import { Container } from '../Container';
import useNextRequest, {
  HTTP_METHOD,
} from '../../../../../../hooks/use-next-request';
import { useErrorHandlingStore } from '../../../../../../stores/errorHandlingStore';

export const Export = () => {
  const t = useTranslations('TreemapperAnalytics');
  const { projectList, project, fromDate, toDate } = useAnalytics();
  const { userLang } = useUserProps();
  // local state
  const [localProject, setLocalProject] = useState<Project | null>(null);
  const [localFromDate, setLocalFromDate] = useState<Date | null>(fromDate);
  const [localToDate, setLocalToDate] = useState<Date | null>(toDate);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const { makeRequest } = useNextRequest<{ data: IExportData[] }>({
    url: '/api/data-explorer/export',
    method: HTTP_METHOD.POST,
    body: {
      projectId: localProject?.id,
      startDate: localFromDate,
      endDate: localToDate,
    },
  });

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
      description: t('exportColumnHeaders.created'),
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

  const extractDataToXlsx = (data: IExportData[]) => {
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
      const res = await makeRequest();

      if (res) {
        const { data } = res;
        if (data.length === 0) {
          setErrors([{ message: t('errors.emptyExportData') }]);
          return;
        }
        extractDataToXlsx(data);
      }
    }
  };

  const handleProjectChange = (proj: Project | null) => {
    setLocalProject(proj);
  };

  const handleProjectTypeChange = (projType: ProjectType | null) => {
    setProjectType(projType);
  };

  return (
    <Container
      leftElement={<h3 className={styles.title}>{t('exportData')}</h3>}
    >
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
            adapterLocale={
              localeMapForDate[userLang]
                ? localeMapForDate[userLang]
                : localeMapForDate['en']
            }
          >
            <MuiDatePicker
              label={t('from')}
              value={localFromDate}
              onChange={setLocalFromDate}
              renderInput={(props) => (
                <TextField variant="outlined" {...props} />
              )}
              inputFormat="MMMM d, yyyy"
              maxDate={new Date()}
            />
          </LocalizationProvider>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={
              localeMapForDate[userLang]
                ? localeMapForDate[userLang]
                : localeMapForDate['en']
            }
          >
            <MuiDatePicker
              label={t('to')}
              value={localToDate}
              onChange={setLocalToDate}
              renderInput={(props) => (
                <TextField variant="outlined" {...props} />
              )}
              inputFormat="MMMM d, yyyy"
              maxDate={new Date()}
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
  );
};

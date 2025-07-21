import type { Project } from '../../../../../common/Layout/AnalyticsContext';

import React, { useState } from 'react';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';
import ProjectSelectAutocomplete from '../ProjectSelectAutocomplete';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Grid from '@mui/material/Grid';
import { useTranslations } from 'next-intl';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { localeMapForDate } from '../../../../../../utils/language/getLanguageName';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useUserProps } from '../../../../../common/Layout/UserPropsContext';

const ProjectFilter = () => {
  const t = useTranslations('TreemapperAnalytics');
  const {
    projectList,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    project,
    setProject,
  } = useAnalytics();
  const { userLang } = useUserProps();

  const handleProjectChange = (proj: Project | null) => {
    setProject(proj);
  };

  const [localToDate, setLocalToDate] = useState<Date | null>(toDate);
  const [localFromDate, setLocalFromDate] = useState<Date | null>(fromDate);

  return (
    <Grid alignItems="top" container spacing={2}>
      <Grid item xs={12} md={6}>
        <ProjectSelectAutocomplete
          projectList={projectList || []}
          project={project}
          handleProjectChange={handleProjectChange}
        />
      </Grid>
      <Grid container item xs={12} md={6} spacing={2}>
        <Grid item xs={6} md={6}>
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
              onChange={(e) => setLocalFromDate(e)}
              onAccept={(value) => {
                if (value) setFromDate(value);
              }}
              renderInput={(props) => (
                <TextField variant="outlined" {...props} />
              )}
              inputFormat="MMMM d, yyyy"
              // minDate={}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={6} md={6}>
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
              onChange={(e) => setLocalToDate(e)}
              onAccept={(value) => {
                if (value) setToDate(value);
              }}
              renderInput={(props) => (
                <TextField variant="outlined" {...props} />
              )}
              inputFormat="MMMM d, yyyy"
              minDate={fromDate}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProjectFilter;

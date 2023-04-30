import React from 'react';
import {
  Project,
  useAnalytics,
} from '../../../../../common/Layout/AnalyticsContext';
import ProjectSelectAutocomplete from '../ProjectSelectAutocomplete';
import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Grid from '@mui/material/Grid';
import themeProperties from '../../../../../../theme/themeProperties';
import { SxProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MaterialTextField from '../../../../../common/InputTypes/MaterialTextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { localeMapForDate } from '../../../../../../utils/language/getLanguageName';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useUserProps } from '../../../../../common/Layout/UserPropsContext';

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

const ProjectFilter = () => {
  const { t, ready } = useTranslation('treemapperAnalytics');
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

  return ready ? (
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
              label={t('treemapperAnalytics:from')}
              value={fromDate}
              onChange={setFromDate}
              renderInput={(props) => (
                <MaterialTextField variant="outlined" {...props} />
              )}
              inputFormat="MMMM d, yyyy"
              // minDate={}
              maxDate={new Date()}
              DialogProps={{
                sx: dialogSx,
              }}
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
              label={t('treemapperAnalytics:to')}
              value={toDate}
              onChange={setToDate}
              renderInput={(props) => (
                <MaterialTextField variant="outlined" {...props} />
              )}
              inputFormat="MMMM d, yyyy"
              minDate={fromDate}
              maxDate={new Date()}
              DialogProps={{
                sx: dialogSx,
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Grid>
  ) : null;
};

export default ProjectFilter;

import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
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
import { UserPropsContext } from '../../../../../common/Layout/UserPropsContext';
import MuiButton from '../../../../../common/InputTypes/MuiButton';
import styles from './index.module.scss';
import { subMonths } from 'date-fns';
import { TIME_FRAMES } from '../../../../../common/Layout/AnalyticsContext';

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
  setProgress: Dispatch<SetStateAction<number>>;
}

const allTimeFrame = [
  TIME_FRAMES.DAYS,
  TIME_FRAMES.WEEKS,
  TIME_FRAMES.MONTHS,
  TIME_FRAMES.YEARS,
];

const ProjectFilter = ({ setProgress }: Props) => {
  const { t, ready } = useTranslation('treemapperAnalytics');
  const {
    projectList,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    timeFrames,
    setTimeFrame,
    timeFrame,
    project,
    setProject,
  } = useAnalytics();
  const { userLang } = useContext(UserPropsContext);

  const handleProjectChange = (proj: Project | null) => {
    setProject(proj);
  };

  const handleClearFilter = () => {
    setToDate(new Date());
    setFromDate(subMonths(new Date(), 1));
  };

  const handleTimeFrameChange = (tf: TIME_FRAMES) => {
    setTimeFrame(tf);
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
            locale={
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
            locale={
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

        <Grid item xs={12} md={12}>
          <div className={styles.buttonContainer}>
            <MuiButton onClick={handleClearFilter} variant="outlined">
              {t('clearFilter')}
            </MuiButton>

            <div className={styles.filterButtons}>
              {allTimeFrame.map((tf, index) => {
                return (
                  <MuiButton
                    disabled={!timeFrames.includes(tf)}
                    onClick={() => handleTimeFrameChange(tf)}
                    variant={tf === timeFrame ? 'contained' : 'outlined'}
                    key={`${index}`}
                  >
                    {t(`${tf}`)}
                  </MuiButton>
                );
              })}
            </div>
          </div>
        </Grid>
      </Grid>
    </Grid>
  ) : null;
};

export default ProjectFilter;

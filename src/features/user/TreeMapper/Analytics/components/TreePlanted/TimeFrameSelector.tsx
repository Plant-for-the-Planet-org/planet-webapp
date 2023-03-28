import React, { ReactElement, useState, useEffect } from 'react';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { getTimeFrames } from '.';
import { useAnalytics } from '../../../../../common/Layout/AnalyticsContext';

/* eslint-disable no-unused-vars */
export enum TIME_FRAME {
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
  YEARS = 'years',
}
/* eslint-enable no-unused-vars */

const TimeFrameList = [
  TIME_FRAME.DAYS,
  TIME_FRAME.WEEKS,
  TIME_FRAME.MONTHS,
  TIME_FRAME.YEARS,
];

const MuiAutocomplete = styled(Autocomplete)(() => {
  return {
    '& .MuiAutocomplete-popupIndicatorOpen': {
      transform: 'none',
    },
    '& .Mui-disabled .iconFillColor': {
      fillOpacity: '38%',
    },
  };
});

interface TimeFrameSelectorProps {
  handleTimeFrameChange: (localTimeFrame: TIME_FRAME | null) => void; // eslint-disable-line no-unused-vars
  timeFrames: TIME_FRAME[];
  timeFrame: TIME_FRAME | null;
}

const TimeFrameSelector = ({
  handleTimeFrameChange,
  timeFrames,
  timeFrame,
}: TimeFrameSelectorProps): ReactElement | null => {
  const [localTimeFrame, setLocalTimeFrame] = useState<TIME_FRAME | null>(
    timeFrame
  );
  const { t, ready } = useTranslation(['treemapperAnalytics']);

  const { toDate, fromDate } = useAnalytics();

  useEffect(() => {
    if (!localTimeFrame) {
      setLocalTimeFrame(getTimeFrames(toDate, fromDate)[0]);
    } else if (!timeFrames.includes(localTimeFrame)) {
      setLocalTimeFrame(timeFrames[0]);
    }
  }, [timeFrames]);

  useEffect(() => {
    if (handleTimeFrameChange) {
      handleTimeFrameChange(localTimeFrame);
    }
  }, [localTimeFrame]);

  if (ready) {
    return (
      <MuiAutocomplete
        options={TimeFrameList}
        getOptionLabel={(option) => t(option as TIME_FRAME)}
        isOptionEqualToValue={(option, value) =>
          (option as TIME_FRAME) === (value as TIME_FRAME)
        }
        value={localTimeFrame}
        onChange={(_event, newValue: unknown) =>
          setLocalTimeFrame(newValue as TIME_FRAME | null)
        }
        getOptionDisabled={(option) =>
          !timeFrames.includes(option as TIME_FRAME)
        }
        renderOption={(props, option) => (
          <span {...props} key={option as TIME_FRAME}>
            {t(option as TIME_FRAME)}
          </span>
        )}
        style={{ width: 150 }}
        renderInput={(params) => (
          <TextField {...params} label={t('dataIntervals')} color="primary" />
        )}
      />
    );
  }

  return null;
};

export default TimeFrameSelector;

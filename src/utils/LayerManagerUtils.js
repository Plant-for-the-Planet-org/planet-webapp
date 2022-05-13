import moment from 'moment';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
export const dateDiffInDays = (startDate, endDate) => {
  const a = new Date(endDate);
  const b = new Date(startDate);
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / MS_PER_DAY);
};

export const getDayRange = (params = {}) => {
  const {
    startDate, endDate, minDate, maxDate,
  } = params || {};

  if (!startDate || !endDate || !minDate || !maxDate) return null;

  const minDateTime = new Date(minDate);
  const maxDateTime = new Date(maxDate);
  const numberOfDays = dateDiffInDays(maxDateTime, minDateTime);

  // timeline or hover effect active range
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  const activeStartDay = numberOfDays - dateDiffInDays(maxDateTime, startDateTime);
  const activeEndDay = numberOfDays - dateDiffInDays(maxDateTime, endDateTime);

  // get start and end day
  const startDayIndex = activeStartDay || 0;
  const endDayIndex = activeEndDay || numberOfDays;

  return {
    startDayIndex,
    endDayIndex,
    numberOfDays,
  };
};

export const getParams = (config = [], params = {}) => {
  const defaultParams = config.reduce((acc, v) => {
    const { key } = v;
    const value = v.default;

    return {
      ...acc,
      [key]: value,
    };
  }, {});

  const newParams = {
    ...defaultParams,
    ...params,
  };

  const {
    startDate, endDate, trimEndDate, maxAbsoluteDate,
  } = newParams;

  const start = startDate;
  const end = endDate > maxAbsoluteDate ? maxAbsoluteDate : endDate;
  const trim = trimEndDate > maxAbsoluteDate ? maxAbsoluteDate : trimEndDate;

  return {
    ...newParams,
    ...(!!start && {
      startYear: moment(start).year(),
      startMonth: moment(start).month(),
      startDay: moment(start).dayOfYear(),
    }),
    ...(!!endDate && {
      endYear: moment(end).year(),
      endMonth: moment(end).month(),
      endDay: moment(end).dayOfYear(),
    }),
    ...(!!trimEndDate && {
      trimEndYear: moment(trim).year(),
      trimEndMonth: moment(trim).month(),
      trimEndDay: moment(trim).dayOfYear(),
    }),
    ...getDayRange(newParams),
  };
};

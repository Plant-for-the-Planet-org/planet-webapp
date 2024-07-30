import getYear from 'date-fns/getYear';
import getMonth from 'date-fns/getMonth';
import getDayOfYear from 'date-fns/getDayOfYear';
import parseISO from 'date-fns/parseISO';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Calculates the difference in days between two given dates.
 * @returns {number} The difference in days between the two dates.
 */

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
  const { startDate, endDate, minDate, maxDate } = params || {};

  if (!startDate || !endDate || !minDate || !maxDate) return null;

  const minDateTime = new Date(minDate);
  const maxDateTime = new Date(maxDate);
  const numberOfDays = dateDiffInDays(maxDateTime, minDateTime);

  // timeline or hover effect active range
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  const activeStartDay =
    numberOfDays - dateDiffInDays(maxDateTime, startDateTime);
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

  let { startDate, endDate, trimEndDate, maxAbsoluteDate } = newParams;
  if (typeof startDate === 'string') startDate = parseISO(startDate);
  if (typeof endDate === 'string') endDate = parseISO(endDate);
  if (typeof trimEndDate === 'string') trimEndDate = parseISO(trimEndDate);
  if (typeof maxAbsoluteDate === 'string')
    maxAbsoluteDate = parseISO(maxAbsoluteDate);

  const start = startDate;
  const end = endDate > maxAbsoluteDate ? maxAbsoluteDate : endDate;
  const trim = trimEndDate > maxAbsoluteDate ? maxAbsoluteDate : trimEndDate;

  return {
    ...newParams,
    ...(!!start && {
      startYear: getYear(start),
      startMonth: getMonth(start),
      startDay: getDayOfYear(start),
    }),
    ...(!!endDate && {
      endYear: getYear(end),
      endMonth: getMonth(end),
      endDay: getDayOfYear(end),
    }),
    ...(!!trimEndDate && {
      trimEndYear: getYear(trim),
      trimEndMonth: getMonth(trim),
      trimEndDay: getDayOfYear(trim),
    }),
    ...getDayRange(newParams),
  };
};

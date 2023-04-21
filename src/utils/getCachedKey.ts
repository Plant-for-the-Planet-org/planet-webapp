import { format } from 'date-fns';

export const getCachedKey = (
  projectId: string,
  startDate: string,
  endDate: string,
  timeframe?: string
) => {
  if (timeframe) {
    return `${projectId}__${format(
      new Date(startDate),
      'MM-dd-yyyy'
    )}__${format(new Date(endDate), 'MM-dd-yyyy')}__${timeframe}`;
  }
  return `${projectId}__${format(new Date(startDate), 'MM-dd-yyyy')}__${format(
    new Date(endDate),
    'MM-dd-yyyy'
  )}`;
};

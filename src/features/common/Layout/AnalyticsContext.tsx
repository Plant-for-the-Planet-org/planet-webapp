import {
  useContext,
  createContext,
  useMemo,
  useState,
  FC,
  useEffect,
} from 'react';
import { differenceInDays } from 'date-fns';

import { SetState } from '../types/common';

export interface Project {
  id: string;
  name: string;
}

const ONE_YEAR_DAYS = 365;
const TWO_YEARS_DAYS = 2 * ONE_YEAR_DAYS;
const FIVE_YEARS_DAYS = 5 * ONE_YEAR_DAYS;

export enum TIME_FRAMES {
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
  YEARS = 'years',
}

interface AnalyticsContextInterface {
  projectList: Project[] | null;
  setProjectList: SetState<Project[] | null>;
  project: Project | null;
  setProject: SetState<Project | null>;
  fromDate: Date;
  setFromDate: SetState<Date>;
  toDate: Date;
  setToDate: SetState<Date>;
  timeFrames: TIME_FRAMES[];
  timeFrame: TIME_FRAMES | null;
  setTimeFrame: SetState<TIME_FRAMES | null>;
  apiCalled: boolean;
  setApiCalled: SetState<Boolean>;
}

const AnalyticsContext = createContext<AnalyticsContextInterface | null>(null);

export const AnalyticsProvider: FC = ({ children }) => {
  const [projectList, setProjectList] = useState<Project[] | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [fromDate, setFromDate] = useState<Date>(new Date('2017-04-18'));
  const [toDate, setToDate] = useState<Date>(new Date('2022-06-27'));

  const getTimeFrame = () => {
    const diffInDays = differenceInDays(toDate, fromDate);

    switch (true) {
      case diffInDays <= ONE_YEAR_DAYS:
        return [
          TIME_FRAMES.DAYS,
          TIME_FRAMES.WEEKS,
          TIME_FRAMES.MONTHS,
          TIME_FRAMES.YEARS,
        ];
      case diffInDays <= TWO_YEARS_DAYS:
        return [TIME_FRAMES.WEEKS, TIME_FRAMES.MONTHS, TIME_FRAMES.YEARS];
      case diffInDays <= FIVE_YEARS_DAYS:
        return [TIME_FRAMES.MONTHS, TIME_FRAMES.YEARS];
      default:
        return [TIME_FRAMES.YEARS];
    }
  };

  const [timeFrames, setTimeFrames] = useState<TIME_FRAMES[]>(getTimeFrame());
  const [timeFrame, setTimeFrame] = useState<TIME_FRAMES | null>(null);

  const [apiCalled, setApiCalled] = useState(false);

  useEffect(() => {
    setTimeFrames(getTimeFrame());
  }, [toDate, fromDate]);

  useEffect(() => {
    if (!timeFrame) {
      setTimeFrame(getTimeFrame()[0]);
    } else if (!timeFrames.includes(timeFrame)) {
      setTimeFrame(timeFrames[0]);
    }
  }, [timeFrames]);

  const value: AnalyticsContextInterface | null = useMemo(
    () => ({
      projectList,
      setProjectList,
      project,
      setProject,
      fromDate,
      setFromDate,
      toDate,
      setToDate,
      timeFrames,
      timeFrame,
      setTimeFrame,
      apiCalled,
      setApiCalled,
    }),
    [
      projectList,
      setProjectList,
      project,
      setProject,
      fromDate,
      setFromDate,
      toDate,
      setToDate,
      timeFrames,
      timeFrame,
      setTimeFrame,
      apiCalled,
      setApiCalled,
    ]
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextInterface => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('AnalyticsContext must be used within AnalyticsProvider');
  }
  return context;
};

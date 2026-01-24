import type { ReactNode } from 'react';
import type { SetState } from '../types/common';

import { useContext, createContext, useMemo, useState } from 'react';
import { subYears } from 'date-fns';

export interface Project {
  id: string;
  guid: string; // Added: same value as id for compatibility with ProjectSelectAutocomplete
  name: string;
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
}

const AnalyticsContext = createContext<AnalyticsContextInterface | null>(null);

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [projectList, setProjectList] = useState<Project[] | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [fromDate, setFromDate] = useState<Date>(subYears(new Date(), 1));
  const [toDate, setToDate] = useState<Date>(new Date());

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

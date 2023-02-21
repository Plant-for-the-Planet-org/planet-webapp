import {useContext, createContext, useMemo, useState, Dispatch, SetStateAction, FC} from 'react'

import { SetState } from '../types/common';

interface Project {
    guid: string;
    slug: string;
    name: string;
}

interface AnalyticsContextInterface {
    projectList: Project[] | null;
    setProjectList: SetState<Project[] | null>
    project: Project | null;
    setProject: SetState<Project | null>
}

const AnalyticsContext = createContext<AnalyticsContextInterface | null>(null)

export const AnalyticsProvider: FC = ({children}) => {

    const [projectList, setProjectList] = useState<Project[] | null>(null)
    const [project, setProject] = useState<Project| null>(null)

    const value: AnalyticsContextInterface | null = useMemo(() => ({
        projectList,
        setProjectList,
        project,
        setProject
    }), [projectList, setProjectList, project, setProject])

    return (<AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>)
}
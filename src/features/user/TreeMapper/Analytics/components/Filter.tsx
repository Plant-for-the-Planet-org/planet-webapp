import React, { Dispatch, SetStateAction } from 'react';
import { Project, useAnalytics } from '../../../../common/Layout/AnalyticsContext';
import ProjectSelectAutocomplete from './ProjectSelectAutocomplete';


interface Props {
  setProgress: Dispatch<SetStateAction<number>>;
}

const ProjectFilter = ({ setProgress }: Props) => {

  const {projectList} = useAnalytics();

  const handleProjectChange = (proj: Project | null) => {
    if(proj){
      console.log(proj.name)
    }
  }

  return <div >
    <ProjectSelectAutocomplete projectList={projectList || []} project={null} handleProjectChange={handleProjectChange}/>
  </div>
};

export default ProjectFilter;

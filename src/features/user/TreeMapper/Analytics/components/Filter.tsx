import React, { Dispatch, SetStateAction } from 'react';

interface Props {
  setProgress: Dispatch<SetStateAction<number>>;
}

const ProjectFilter = ({ setProgress }: Props) => {

  return <div>
    Filter
  </div>
};

export default ProjectFilter;

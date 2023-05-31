import React from 'react';
import NaturalRegenerationIcon from '../../../../public/assets/images/icons/project/NaturalRegenerationIcon';
interface Props {
  projectType: string;
}
const ProjectTypeIcon = ({ projectType }: Props) => {
  switch (projectType) {
    case 'natural-regeneration':
      return <NaturalRegenerationIcon />;
    default:
      return null;
  }
};

export default ProjectTypeIcon;

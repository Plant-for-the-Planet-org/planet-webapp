import React from 'react';
import Agroforestry from '../../../../public/assets/images/icons/project/Agroforestry';
import Mangroves from '../../../../public/assets/images/icons/project/Mangroves';
import NaturalRegeneration from '../../../../public/assets/images/icons/project/NaturalRegeneration';
import UrbanRestoration from '../../../../public/assets/images/icons/project/UrbanRestoration';
import Conservation from '../../../../public/assets/images/icons/project/Conservation';
import ManagedRegeneration from '../../../../public/assets/images/icons/project/ManagedRegeneration';
import TreePlanting from '../../../../public/assets/images/icons/project/TreePlanting';
import OtherRestoration from '../../../../public/assets/images/icons/project/OtherRestoration';
interface Props {
  projectType: string;
}
const ProjectTypeIcon = ({ projectType }: Props) => {
  switch (projectType) {
    case 'natural-regeneration':
      return <NaturalRegeneration />;
    case 'mangroves':
      return <Mangroves />;
    case 'managed-regeneration':
      return <ManagedRegeneration />;
    case 'agroforestry':
      return <Agroforestry />;
    case 'urban-planting':
      return <UrbanRestoration />;
    case 'conservation':
      return <Conservation />;
    case 'restoration' || 'other-planting':
      return <OtherRestoration />;
    case 'large-scale-planting':
      return <TreePlanting />;
    default:
      return null;
  }
};

export default ProjectTypeIcon;

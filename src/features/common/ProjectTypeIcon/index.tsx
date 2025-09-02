import Agroforestry from '../../../../public/assets/images/icons/project/Agroforestry';
import Mangroves from '../../../../public/assets/images/icons/project/Mangroves';
import NaturalRegeneration from '../../../../public/assets/images/icons/project/NaturalRegeneration';
import UrbanRestoration from '../../../../public/assets/images/icons/project/UrbanRestoration';
import Conservation from '../../../../public/assets/images/icons/project/Conservation';
import ManagedRegeneration from '../../../../public/assets/images/icons/project/ManagedRegeneration';
import TreePlanting from '../../../../public/assets/images/icons/project/TreePlanting';
interface Props {
  projectType: string | null;
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
    case 'large-scale-planting':
    case 'other-planting':
      return <TreePlanting />;
    default:
      return null;
  }
};

export default ProjectTypeIcon;

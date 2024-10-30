import {
  Agroforestry,
  Conservation,
  ManagedRegeneration,
  Mangroves,
  NaturalRegeneration,
  OtherPlanting,
  TreePlanting,
  UrbanRestoration,
} from '../../../../../public/assets/images/icons/myForestMapIcons/PointMarkerIcons';
import { type MapProjectProperties } from '../../../common/types/projectv2';
import { getProjectCategory } from '../../../../utils/projectV2';
import themeProperties from '../../../../theme/themeProperties';

type Props = {
  projectProperties: MapProjectProperties;
};

const ProjectMarkerIcon = ({ projectProperties }: Props) => {
  const projectCategory = getProjectCategory(projectProperties);

  const getIconColor = (
    projectCategory: 'topProject' | 'regularProject' | 'nonDonatableProject'
  ) => {
    switch (projectCategory) {
      case 'topProject':
        return themeProperties.topProjectBackgroundColor;
      case 'regularProject':
        return themeProperties.greenTwo;
      case 'nonDonatableProject':
        return themeProperties.nonDonatableProjectBackgroundColor;
    }
  };

  const iconColor = getIconColor(projectCategory);

  // return the correct pin based on project classification and purpose
  if (projectProperties.purpose === 'conservation') {
    return <Conservation color={iconColor} />;
  }

  switch (projectProperties.classification) {
    case 'natural-regeneration':
      return <NaturalRegeneration color={iconColor} />;
    case 'mangroves':
      return <Mangroves color={iconColor} />;
    case 'managed-regeneration':
      return <ManagedRegeneration color={iconColor} />;
    case 'agroforestry':
      return <Agroforestry color={iconColor} />;
    case 'urban-planting':
      return <UrbanRestoration color={iconColor} />;
    case 'large-scale-planting':
      return <TreePlanting color={iconColor} />;
    case 'other-planting':
      return <OtherPlanting color={iconColor} />;
    default:
      return null;
  }
};

export default ProjectMarkerIcon;

import { useMemo } from 'react';
import NaturalRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/NaturalRegeneration';
import Mangroves from '../../../../../../public/assets/images/icons/myForestV2Icons/Mangroves';
import ManagedRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/ManagedRegeneration';
import Agroforestry from '../../../../../../public/assets/images/icons/myForestV2Icons/Agroforestry';
import UrbanRestoration from '../../../../../../public/assets/images/icons/myForestV2Icons/UrbanRestoration';
import TreePlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/TreePlanting';
import themeProperties from '../../../../../theme/themeProperties';
import Conservation from '../../../../../../public/assets/images/icons/myForestV2Icons/Conservation';
import {
  ProjectPurpose,
  TreeProjectClassification,
  UnitTypes,
} from '@planet-sdk/common';

interface ProjectTypeIconProps {
  purpose: ProjectPurpose;
  classification: TreeProjectClassification | null;
  unitType: UnitTypes;
}
const ProjectTypeIcon = ({
  purpose,
  classification,
  unitType,
}: ProjectTypeIconProps) => {
  const getMarkerColor = (purpose: ProjectPurpose, unitType: UnitTypes) => {
    switch (purpose) {
      case 'conservation':
        return themeProperties.mediumBlueColor;
      case 'trees':
        return unitType === 'm2'
          ? themeProperties.electricPurpleColor
          : themeProperties.primaryDarkColorX;
      default:
        return themeProperties.primaryDarkColorX;
    }
  };
  const pointMarkerColor = useMemo(
    () => getMarkerColor(purpose, unitType),
    [purpose, unitType]
  );
  const IconProps = {
    width: 42,
    color: pointMarkerColor,
  };

  if (purpose === 'conservation') {
    return <Conservation {...IconProps} />;
  }

  switch (classification) {
    case 'natural-regeneration':
      return <NaturalRegeneration {...IconProps} />;
    case 'mangroves':
      return <Mangroves {...IconProps} />;
    case 'managed-regeneration':
      return <ManagedRegeneration {...IconProps} />;
    case 'agroforestry':
      return <Agroforestry {...IconProps} />;
    case 'urban-planting':
      return <UrbanRestoration {...IconProps} />;
    case 'large-scale-planting':
    case 'other-planting':
      return <TreePlanting {...IconProps} />;
    default:
      return null;
  }
};
export default ProjectTypeIcon;

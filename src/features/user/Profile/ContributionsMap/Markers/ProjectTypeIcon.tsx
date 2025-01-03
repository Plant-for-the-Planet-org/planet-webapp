import type { TreeProjectClassification } from '@planet-sdk/common';

import { useMemo } from 'react';
import themeProperties from '../../../../../theme/themeProperties';
import {
  NaturalRegeneration,
  Mangroves,
  ManagedRegeneration,
  Agroforestry,
  UrbanRestoration,
  TreePlanting,
  Conservation,
  OtherPlanting,
} from '../../../../../../public/assets/images/icons/myForestMapIcons/PointMarkerIcons';

export type ProjectPurpose = 'conservation' | 'trees';
export type UnitTypes = 'tree' | 'm2';
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
          : themeProperties.primaryColorNew;
      default:
        return themeProperties.primaryColorNew;
    }
  };
  const pointMarkerColor = useMemo(
    () => getMarkerColor(purpose, unitType),
    [purpose, unitType]
  );
  const IconProps = {
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
      return <TreePlanting {...IconProps} />;
    case 'other-planting':
      return <OtherPlanting {...IconProps} />;
    default:
      return null;
  }
};
export default ProjectTypeIcon;

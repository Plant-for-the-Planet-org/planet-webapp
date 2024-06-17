import { ProjectPurpose, TreeProjectClassification } from '@planet-sdk/common';
import {
  MangrovesClusterMarker,
  NaturalRegenerationClusterMarker,
  ManagedRegenerationClusterMarker,
  AgroforestryClusterMarker,
  UrbanRestorationClusterMarker,
  TreePlantingClusterMarker,
  ConservationClusterMarker,
} from '../../../../../../public/assets/images/icons/ClusterMarkerIcons';

type ClusterIconProps = {
  classification: TreeProjectClassification | undefined;
  purpose: ProjectPurpose | undefined;
  tertiaryProjectColor: string;
  secondaryProjectColor: string;
  mainProjectColor: string;
};

const ClusterIcon = ({
  classification,
  purpose,
  tertiaryProjectColor,
  secondaryProjectColor,
  mainProjectColor,
}: ClusterIconProps) => {
  const IconProps = {
    tertiaryProjectColor,
    secondaryProjectColor,
    mainProjectColor,
    width: 55,
  };

  if (purpose === 'conservation') {
    return <ConservationClusterMarker {...IconProps} />;
  }

  switch (classification) {
    case 'natural-regeneration':
      return <NaturalRegenerationClusterMarker {...IconProps} />;
    case 'mangroves':
      return <MangrovesClusterMarker {...IconProps} />;
    case 'managed-regeneration':
      return <ManagedRegenerationClusterMarker {...IconProps} />;
    case 'agroforestry':
      return <AgroforestryClusterMarker {...IconProps} />;
    case 'urban-planting':
      return <UrbanRestorationClusterMarker {...IconProps} />;
    case 'large-scale-planting':
    case 'other-planting':
      return <TreePlantingClusterMarker {...IconProps} />;
    default:
      return null;
  }
};

export default ClusterIcon;

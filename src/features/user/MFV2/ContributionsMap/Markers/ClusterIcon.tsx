import {
  Mangroves,
  NaturalRegeneration,
  ManagedRegeneration,
  Agroforestry,
  UrbanRestoration,
  TreePlanting,
  Conservation,
} from '../../../../../../public/assets/images/icons/ClusterMarkerIcons';

const ClusterIcon = ({
  classification,
  purpose,
  tertiaryProjectColor,
  secondaryProjectColor,
  mainProjectColor,
}) => {
  const IconProps = {
    tertiaryProjectColor,
    secondaryProjectColor,
    mainProjectColor,
    width: 55,
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

export default ClusterIcon;

import { Marker } from 'react-map-gl-v7';
import { useMemo } from 'react';
import RegisteredTreeIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/RegisteredTreeIcon';
import NaturalRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/NaturalRegeneration';
import Mangroves from '../../../../../../public/assets/images/icons/myForestV2Icons/Mangroves';
import ManagedRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/ManagedRegeneration';
import Agroforestry from '../../../../../../public/assets/images/icons/myForestV2Icons/Agroforestry';
import UrbanRestoration from '../../../../../../public/assets/images/icons/myForestV2Icons/UrbanRestoration';
import Conservation from '../../../../../../public/assets/images/icons/myForestV2Icons/Conservation';
import TreePlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/TreePlanting';
import OtherPlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/OtherPlanting';
import { contributionLocation } from '../../../../../utils/myForestV2Utils';
import themeProperties from '../../../../../theme/themeProperties';

type Classification =
  | 'natural-regeneration'
  | 'mangroves'
  | 'managed-regeneration'
  | 'agroforestry'
  | 'urban-planting'
  | 'conservation'
  | 'large-scale-planting'
  | 'other-planting';
interface ProjectTypeIconProps {
  projectType: string;
  classification: Classification;
}

const ProjectTypeIcon = ({
  projectType,
  classification,
}: ProjectTypeIconProps) => {
  const getMarkerColor = (projectType: string) => {
    switch (projectType) {
      case 'conservation':
        return `${themeProperties.mediumBlue}`;
      case 'restoration':
        return `${themeProperties.electricPurple}`;
      default:
        return `${themeProperties.primaryDarkColorX}`;
    }
  };
  const Markercolor = useMemo(() => getMarkerColor(projectType), [projectType]);
  const IconProps = {
    width: 68,
    color: Markercolor,
  };

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
    case 'conservation':
      return <Conservation {...IconProps} />;
    case 'large-scale-planting':
      return <TreePlanting {...IconProps} />;
    case 'other-planting':
      return <OtherPlanting {...IconProps} />;
    default:
      return null;
  }
};
const renderIcons = (properties: any) => {
  if (!properties.isTreeRegistered) {
    return (
      <ProjectTypeIcon
        projectType={properties?.projectType}
        classification={properties?.classification}
      />
    );
  } else {
    return <RegisteredTreeIcon />;
  }
};

const SinglePointMarkers = () => {
  return (
    <>
      {contributionLocation.map((singleLocation, key) => {
        return (
          <Marker
            longitude={singleLocation?.geometry.coordinates[0]}
            latitude={singleLocation?.geometry.coordinates[1]}
            key={key}
          >
            {renderIcons(singleLocation.properties)}
          </Marker>
        );
      })}
    </>
  );
};

export default SinglePointMarkers;

import { Marker } from 'react-map-gl-v7';
import { useMemo } from 'react';
import RegisteredTreeIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/markerIcon/RegisteredTreeIcon';
import NaturalRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/markerIcon/NaturalRegeneration';
import Mangroves from '../../../../../../public/assets/images/icons/myForestV2Icons/markerIcon/Mangroves';
import ManagedRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/markerIcon/ManagedRegeneration';
import Agroforestry from '../../../../../../public/assets/images/icons/myForestV2Icons/markerIcon/Agroforestry';
import UrbanRestoration from '../../../../../../public/assets/images/icons/myForestV2Icons/markerIcon/UrbanRestoration';
import Conservation from '../../../../../../public/assets/images/icons/myForestV2Icons/markerIcon/Conservation';
import TreePlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/markerIcon/TreePlanting';
import OtherPlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/markerIcon/OtherPlanting';
import { contributions } from '../../../../../utils/myForestV2Utils';
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
  purpose: string;
  classification: Classification;
}

const ProjectTypeIcon = ({ purpose, classification }: ProjectTypeIconProps) => {
  const getMarkerColor = (purpose: string) => {
    switch (purpose) {
      case 'conservation':
        return `${themeProperties.mediumBlue}`;
      case 'restoration':
        return `${themeProperties.electricPurple}`;
      default:
        return `${themeProperties.primaryDarkColorX}`;
    }
  };
  const Markercolor = useMemo(() => getMarkerColor(purpose), [purpose]);
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
  if (properties.type !== 'registration') {
    return (
      <ProjectTypeIcon
        purpose={properties.project.purpose}
        classification={properties.project.classification}
      />
    );
  } else {
    return <RegisteredTreeIcon />;
  }
};

const SinglePointMarkers = () => {
  return (
    <>
      {contributions.map((singleLocation, key) => {
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

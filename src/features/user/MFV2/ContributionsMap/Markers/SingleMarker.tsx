import { Marker } from 'react-map-gl-v7';
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

interface ProjectTypeIconProps {
  projectType: string;
  classification: string;
}

const ProjectTypeIcon = ({
  projectType,
  classification,
}: ProjectTypeIconProps) => {
  const chooseColorForMarkerIcon = (classification: string) => {
    switch (classification) {
      case 'treePlantation':
        return `${themeProperties.primaryDarkColorX}`;
      case 'conservation':
        return `${themeProperties.mediumBlue}`;
      case 'restoration':
        return `${themeProperties.electricPurple}`;
      default:
        return null;
    }
  };

  switch (projectType) {
    case 'natural-regeneration':
      return <NaturalRegeneration />;
    case 'mangroves':
      return (
        <Mangroves
          width={68}
          height={75}
          color={chooseColorForMarkerIcon(classification)}
        />
      );
    case 'managed-regeneration':
      return (
        <ManagedRegeneration
          width={68}
          height={75}
          color={chooseColorForMarkerIcon(classification)}
        />
      );
    case 'agroforestry':
      return (
        <Agroforestry
          width={68}
          height={75}
          color={chooseColorForMarkerIcon(classification)}
        />
      );
    case 'urban-planting':
      return (
        <UrbanRestoration
          width={68}
          height={75}
          color={chooseColorForMarkerIcon(classification)}
        />
      );
    case 'conservation':
      return (
        <Conservation
          width={68}
          height={75}
          color={chooseColorForMarkerIcon(classification)}
        />
      );
    case 'large-scale-planting':
      return (
        <TreePlanting
          width={68}
          height={75}
          color={chooseColorForMarkerIcon(classification)}
        />
      );
    case 'other-planting':
      return (
        <OtherPlanting
          width={68}
          height={75}
          color={chooseColorForMarkerIcon(classification)}
        />
      );
    default:
      return null;
  }
};
export const renderIcons = (properties: any) => {
  if (!properties.isTreeRegistered) {
    return <>{ProjectTypeIcon(properties)}</>;
  } else {
    return <RegisteredTreeIcon />;
  }
};

const SingleMarker = () => {
  return (
    <>
      {contributionLocation.map((singleLocation, key) => {
        return (
          <Marker
            key={key}
            longitude={singleLocation?.geometry.coordinates[0]}
            latitude={singleLocation?.geometry.coordinates[1]}
          >
            {renderIcons(singleLocation.properties)}
          </Marker>
        );
      })}
    </>
  );
};

export default SingleMarker;

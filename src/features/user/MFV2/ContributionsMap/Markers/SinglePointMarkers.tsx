import { useMemo } from 'react';
import { Marker } from 'react-map-gl-v7';
import themeProperties from '../../../../../theme/themeProperties';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import style from '.././Common/common.module.scss';
import {
  UnitTypes,
  ProjectPurpose,
  TreeProjectClassification,
} from '@planet-sdk/common';
import {
  Conservation,
  NaturalRegeneration,
  ManagedRegeneration,
  Mangroves,
  Agroforestry,
  UrbanRestoration,
  TreePlanting,
  OtherPlanting,
  RegisteredTreeIcon,
} from '../../../../../../public/assets/images/icons/MyForestMapIcons';

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
        return themeProperties.mediumBlue;
      case 'trees':
        return unitType === 'm2'
          ? themeProperties.electricPurple
          : themeProperties.primaryDarkColorX;
      default:
        return themeProperties.primaryDarkColorX;
    }
  };
  const markerColor = useMemo(
    () => getMarkerColor(purpose, unitType),
    [purpose, unitType]
  );
  const IconProps = {
    width: 42,
    color: markerColor,
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

const SinglePointMarkers = () => {
  const { registrationGeojson, donationGeojson } = useMyForestV2();
  return registrationGeojson ? (
    <>
      {registrationGeojson.map((singleLocation, key) => {
        if (singleLocation.geometry !== undefined) {
          return (
            <Marker
              longitude={singleLocation?.geometry.coordinates[0]}
              latitude={singleLocation?.geometry.coordinates[1]}
              anchor="bottom"
              offset={[0, 0]}
              key={key}
            >
              <div className={style.registeredTreeMarkerContainer}>
                <RegisteredTreeIcon />
              </div>
            </Marker>
          );
        } else {
          return <></>;
        }
      })}
      {donationGeojson.map((singleLocation, key) => {
        return (
          <Marker
            longitude={singleLocation?.geometry.coordinates[0]}
            latitude={singleLocation?.geometry.coordinates[1]}
            anchor="bottom"
            offset={[0, 0]}
            key={key}
          >
            <ProjectTypeIcon
              purpose={singleLocation.properties.projectInfo.purpose}
              classification={
                singleLocation.properties.projectInfo.classification
              }
              unitType={singleLocation.properties.projectInfo.unitType}
            />
          </Marker>
        );
      })}
    </>
  ) : (
    <></>
  );
};

export default SinglePointMarkers;

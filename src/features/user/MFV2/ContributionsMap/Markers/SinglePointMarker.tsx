import { useMemo, useState } from 'react';
import { Marker } from 'react-map-gl-v7';
import themeProperties from '../../../../../theme/themeProperties';
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
import ContributionPopup from '../Popup/ContributionPopup';
import RegisterTreePopup from '../Popup/RegistertreePopUp';
import { PointFeature } from 'supercluster';
import {
  RegistrationGeojson,
  DonationGeojson,
} from '../../../../common/Layout/MyForestContextV2';

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

interface SinglePointMarkersProps {
  superclusterResponse: PointFeature<DonationGeojson | RegistrationGeojson>;
}

const SinglePointMarkers = ({
  superclusterResponse,
}: SinglePointMarkersProps) => {
  if (!superclusterResponse) return null;
  const [showPopup, setShowPopUp] = useState(false);

  const handleMouseEnter = () => {
    setShowPopUp(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setShowPopUp(false);
    }, 3000);
  };
  const handleMouseLeaveRegisteredtreePopup = () => {
    setShowPopUp(false);
  };
  const { coordinates } = superclusterResponse.geometry;
  const isDonation = 'projectInfo' in superclusterResponse.properties;
  return (
    <>
      {isDonation ? (
        <>
          {showPopup && (
            <ContributionPopup
              superclusterResponse={
                superclusterResponse as PointFeature<DonationGeojson>
              }
              setShowPopUp={setShowPopUp}
            />
          )}
          <Marker longitude={coordinates[0]} latitude={coordinates[1]}>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <ProjectTypeIcon
                purpose={
                  (superclusterResponse.properties as DonationGeojson)
                    .projectInfo.purpose
                }
                classification={
                  (superclusterResponse.properties as DonationGeojson)
                    .projectInfo.classification
                }
                unitType={
                  (superclusterResponse.properties as DonationGeojson)
                    .projectInfo.unitType
                }
              />
            </div>
          </Marker>
        </>
      ) : (
        <>
          {showPopup && (
            <RegisterTreePopup
              superclusterResponse={
                superclusterResponse as PointFeature<RegistrationGeojson>
              }
              setShowPopUp={setShowPopUp}
            />
          )}
          <Marker longitude={coordinates[0]} latitude={coordinates[1]}>
            <div
              className={style.registeredTreeIconContainer}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeaveRegisteredtreePopup}
            >
              <RegisteredTreeIcon />
            </div>
          </Marker>
        </>
      )}
    </>
  );
};

export default SinglePointMarkers;

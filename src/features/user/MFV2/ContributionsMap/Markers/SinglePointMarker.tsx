import { useMemo, useState } from 'react';
import NaturalRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/NaturalRegeneration';
import Mangroves from '../../../../../../public/assets/images/icons/myForestV2Icons/Mangroves';
import ManagedRegeneration from '../../../../../../public/assets/images/icons/myForestV2Icons/ManagedRegeneration';
import Agroforestry from '../../../../../../public/assets/images/icons/myForestV2Icons/Agroforestry';
import UrbanRestoration from '../../../../../../public/assets/images/icons/myForestV2Icons/UrbanRestoration';
import TreePlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/TreePlanting';
import OtherPlanting from '../../../../../../public/assets/images/icons/myForestV2Icons/OtherPlanting';
import themeProperties from '../../../../../theme/themeProperties';
import { Marker } from 'react-map-gl-v7';
import RegisteredTreeIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/RegisteredTreeIcon';
import { PointFeature } from 'supercluster';
import ContributionPopup from '../Popup/ContributionPopup';
import RegisterTreePopup from '../Popup/RegistertreePopUp';
import { UnitTypes, ProjectPurpose } from '@planet-sdk/common';
import style from '../MyForestV2.module.scss';
import Conservation from '../../../../../../public/assets/images/icons/myForestV2Icons/Conservation';
import { TreeProjectClassification } from '@planet-sdk/common';
import {
  DonationGeojson,
  RegistrationGeojson,
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

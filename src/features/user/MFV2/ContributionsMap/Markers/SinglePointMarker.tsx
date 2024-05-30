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
import { AnyProps, PointFeature } from 'supercluster';
import ContributionPopup from '../Popup/ContributionPopup';
import RegisterTreePopup from '../Popup/RegistertreePopUp';
import { UnitTypes } from '@planet-sdk/common';
import style from '../MyForestV2.module.scss';

type Classification =
  | 'natural-regeneration'
  | 'mangroves'
  | 'managed-regeneration'
  | 'agroforestry'
  | 'urban-planting'
  | 'large-scale-planting'
  | 'other-planting';
interface ProjectTypeIconProps {
  purpose: 'conservation' | 'restoration' | 'trees';
  classification: Classification | null;
  unitType: UnitTypes;
}

const ProjectTypeIcon = ({
  purpose,
  classification,
  unitType,
}: ProjectTypeIconProps) => {
  const getMarkerColor = (purpose: string, unitType: UnitTypes) => {
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
  const markercolor = useMemo(
    () => getMarkerColor(purpose, unitType),
    [purpose, unitType]
  );
  const IconProps = {
    width: 42,
    color: markercolor,
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
    case 'large-scale-planting':
      return <TreePlanting {...IconProps} />;
    case 'other-planting':
      return <OtherPlanting {...IconProps} />;
    default:
      return null;
  }
};

interface SinglePointMarkersProps {
  superclusterResponse: PointFeature<AnyProps>;
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
  const { type, projectInfo } = superclusterResponse.properties;

  return (
    <>
      {type === 'registration' ? (
        <>
          {showPopup && (
            <RegisterTreePopup
              superclusterResponse={superclusterResponse}
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
      ) : (
        <>
          {showPopup && (
            <ContributionPopup
              superclusterResponse={superclusterResponse}
              setShowPopUp={setShowPopUp}
            />
          )}
          <Marker longitude={coordinates[0]} latitude={coordinates[1]}>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <ProjectTypeIcon
                purpose={projectInfo.purpose}
                classification={projectInfo.classification}
                unitType={projectInfo.unitType}
              />
            </div>
          </Marker>
        </>
      )}
    </>
  );
};

export default SinglePointMarkers;

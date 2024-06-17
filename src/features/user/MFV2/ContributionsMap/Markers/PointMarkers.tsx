import { Marker } from 'react-map-gl-v7';
import { AnyProps, PointFeature } from 'supercluster';
import style from '.././Common/common.module.scss';
import ProjectTypeIcon from './ProjectTypeIcon';
import { useState } from 'react';
import { RegisteredTreeIcon } from '../../../../../../public/assets/images/icons/myForestMapIcons/PointMarkerIcons';
import ContributionPopup from '../Popup/ContributionPopup';
import RegisterTreePopup from '../Popup/RegistertreePopUp';

interface PointMarkersProps {
  superclusterResponse: PointFeature<AnyProps>;
}

const PointMarkers = ({ superclusterResponse }: PointMarkersProps) => {
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

  return (
    <Marker
      longitude={superclusterResponse?.geometry.coordinates[0]}
      latitude={superclusterResponse?.geometry.coordinates[1]}
      offset={[0, -15]}
    >
      {superclusterResponse?.properties.type === 'registration' ? (
        <>
          {showPopup && (
            <RegisterTreePopup superclusterResponse={superclusterResponse} />
          )}
          <div
            className={style.registeredTreeMarkerContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowPopUp(false)}
          >
            <RegisteredTreeIcon />
          </div>
        </>
      ) : (
        <>
          {showPopup && (
            <ContributionPopup
              superclusterResponse={superclusterResponse}
              setShowPopUp={setShowPopUp}
            />
          )}
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <ProjectTypeIcon
              purpose={superclusterResponse.properties.projectInfo.purpose}
              classification={
                superclusterResponse.properties.projectInfo.classification
              }
              unitType={superclusterResponse.properties.projectInfo.unitType}
            />
          </div>
        </>
      )}
    </Marker>
  );
};

export default PointMarkers;

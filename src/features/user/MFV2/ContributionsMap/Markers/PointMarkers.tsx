import { Marker } from 'react-map-gl-v7';
import { PointFeature } from 'supercluster';
import style from '.././Common/common.module.scss';
import ProjectTypeIcon from './ProjectTypeIcon';
import { RegisteredTreeIcon } from '../../../../../../public/assets/images/icons/myForestMapIcons/PointMarkerIcons';
import {
  DonationProperties,
  MyContributionsSingleRegistration,
} from '../../../../common/types/myForestv2';

interface PointMarkersProps {
  superclusterResponse: PointFeature<
    DonationProperties | MyContributionsSingleRegistration
  >;
}

function isRegistration(
  properties: DonationProperties | MyContributionsSingleRegistration
): properties is MyContributionsSingleRegistration {
  return (
    (properties as MyContributionsSingleRegistration).type === 'registration'
  );
}

const PointMarkers = ({ superclusterResponse }: PointMarkersProps) => {
  const { properties, geometry } = superclusterResponse;
  return (
    <Marker
      longitude={geometry.coordinates[0]}
      latitude={geometry.coordinates[1]}
      offset={[0, -15]}
    >
      {isRegistration(properties) ? (
        <div className={style.registeredTreeMarkerContainer}>
          <RegisteredTreeIcon />
        </div>
      ) : (
        <ProjectTypeIcon
          purpose={properties.projectInfo.purpose}
          classification={properties.projectInfo.classification}
          unitType={properties.projectInfo.unitType}
        />
      )}
    </Marker>
  );
};

export default PointMarkers;

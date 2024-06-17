import { Marker } from 'react-map-gl-v7';
import { AnyProps, PointFeature } from 'supercluster';
import style from '.././Common/common.module.scss';
import ProjectTypeIcon from './ProjectTypeIcon';
import { RegisteredTreeIcon } from '../../../../../../public/assets/images/icons/myForestMapIcons/PointMarkerIcons';

interface PointMarkersProps {
  superclusterResponse: PointFeature<AnyProps>;
}

const PointMarkers = ({ superclusterResponse }: PointMarkersProps) => {
  return (
    <Marker
      longitude={superclusterResponse?.geometry.coordinates[0]}
      latitude={superclusterResponse?.geometry.coordinates[1]}
      offset={[0, -15]}
    >
      {superclusterResponse?.properties.type === 'registration' ? (
        <div className={style.registeredTreeMarkerContainer}>
          <RegisteredTreeIcon />
        </div>
      ) : (
        <ProjectTypeIcon
          purpose={superclusterResponse.properties.projectInfo.purpose}
          classification={
            superclusterResponse.properties.projectInfo.classification
          }
          unitType={superclusterResponse.properties.projectInfo.unitType}
        />
      )}
    </Marker>
  );
};

export default PointMarkers;

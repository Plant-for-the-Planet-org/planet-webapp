import { ConservAreaClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import { useEffect, useState, ReactElement } from 'react';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';
import { ClusterMarkerProps, Cluster } from '../../../../common/types/map';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';

const ConservationMarker = ({
  viewport,
  mapRef,
}: ClusterMarkerProps): ReactElement => {
  const { conservationProjects } = useProjectProps();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const { viewState } = viewport;

  useEffect(() => {
    if (conservationProjects) {
      const data = _getClusterGeojson(viewState, mapRef, conservationProjects);
      setClusters(data);
    }
  }, [viewport, conservationProjects]);

  return (
    <>
      {clusters.map((singleCluster, key) => {
        if (
          singleCluster.id ||
          singleCluster?.properties?.totalContribution > 1
        ) {
          return <ConservAreaClusterMarker key={key} geoJson={singleCluster} />;
        }
      })}

      {clusters.map((singleCluster, key) => {
        if (
          !singleCluster.id &&
          singleCluster?.properties?.totalContribution < 2
        ) {
          return <SingleMarker key={key} geoJson={singleCluster} />;
        }
      })}
    </>
  );
};

export default ConservationMarker;

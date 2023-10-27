import { ConservAreaClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';
import { useEffect, useState, ReactElement } from 'react';
import { ClusterMarkerProps, Cluster } from '../../../../common/types/map';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';

const ConservationMarker = ({
  viewport,
  mapRef,
}: ClusterMarkerProps): ReactElement => {
  const { conservationProjects } = useUserProps();
  const [clusters, setClusters] = useState<Cluster[] | undefined>(undefined);
  const { viewState } = viewport;

  useEffect(() => {
    if (conservationProjects) {
      const data = _getClusterGeojson(viewState, mapRef, conservationProjects);
      setClusters(data);
    }
  }, [viewport, conservationProjects]);

  return (
    <>
      {clusters &&
        clusters.map((singleCluster, key) => {
          if (
            singleCluster.id ||
            singleCluster?.properties?.totalContribution > 1
          ) {
            return (
              <ConservAreaClusterMarker key={key} geoJson={singleCluster} />
            );
          } else {
            return <SingleMarker key={key} geoJson={singleCluster} />;
          }
        })}
    </>
  );
};

export default ConservationMarker;

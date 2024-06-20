import { ViewportProps } from '../features/common/types/map';
import {
  TestPointProps,
  TestClusterProps,
  Bound,
} from '../features/common/types/map';
import Supercluster, { ClusterProperties, PointFeature } from 'supercluster';
import { RefObject } from 'react';
import { MapRef } from 'react-map-gl';
import { MyContributionsSingleRegistration } from '../features/common/types/myForestv2';
import { DonationProperties } from '../features/common/Layout/MyForestContextV2';

const _clusterConfig = {
  radius: 40,
  maxZoom: 3,
  map: (props: TestPointProps): TestClusterProps => ({
    totalTrees: props.quantity,
  }),
  reduce: (accumulator: any, props: any) => {
    if (props.totalTrees) {
      accumulator.totalTrees =
        Number(accumulator.totalTrees) + Number(props.totalTrees);
    }
  },
};
const _clusterConfigV2 = {
  radius: 40,
  maxZoom: 3,
};

export const _getClusterGeojson = (
  viewState: ViewportProps,
  mapRef: RefObject<MapRef>,
  geoJson: PointFeature<
    MyContributionsSingleRegistration | DonationProperties
  >[],
  clusterId: string | number | undefined
):
  | (
      | Supercluster.PointFeature<
          MyContributionsSingleRegistration | DonationProperties
        >
      | Supercluster.PointFeature<ClusterProperties>
    )[]
  | undefined => {
  const supercluster = new Supercluster<
    MyContributionsSingleRegistration | DonationProperties,
    {}
  >(_clusterConfigV2);
  supercluster.load(geoJson);
  const zoom = viewState?.zoom;
  if (mapRef && mapRef.current !== null) {
    const map = mapRef.current.getMap();
    const bounds = map.getBounds().toArray().flat() as Bound;
    if (zoom && !clusterId) {
      const _clusters = supercluster.getClusters(bounds, zoom);
      return _clusters;
    }
    if (clusterId) {
      return supercluster.getLeaves(Number(clusterId));
    }
  }
  return undefined;
};

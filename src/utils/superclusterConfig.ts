import { ViewportProps } from '../features/common/types/map';
import { Bound } from '../features/common/types/map';
import Supercluster, { ClusterProperties, PointFeature } from 'supercluster';
import { RefObject } from 'react';
import { MapRef } from 'react-map-gl';
import {
  DonationProperties,
  MyContributionsSingleRegistration,
} from '../features/common/types/myForestv2';
import {} from '../features/common/Layout/MyForestContextV2';

const _clusterConfigV2 = {
  radius: 40,
  maxZoom: 3,
};

/**
 * The getClusterGeojson function is designed to work with map clustering using the Supercluster library.
 * It takes in a view state, a map reference, a set of GeoJSON points, and an optional cluster ID.
 * It returns either the clusters within the current map bounds and zoom level or the leaves (points) of a specified cluster.
 * @param viewState
 * @param mapRef
 * @param geoJson
 * @param clusterId
 * @returns cluster, cluster children
 */ export const getClusterGeojson = (
  viewState: ViewportProps,
  mapRef: RefObject<MapRef>,
  geoJson: PointFeature<
    DonationProperties | MyContributionsSingleRegistration
  >[],
  clusterId: string | number | undefined
):
  | Supercluster.PointFeature<
      MyContributionsSingleRegistration | DonationProperties | ClusterProperties
    >[]
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
      const _clusters = supercluster?.getClusters(bounds, zoom);
      return _clusters;
    }
    if (clusterId) {
      return supercluster.getLeaves(
        Number(clusterId)
      ) as PointFeature<DonationProperties>[];
    }
  }
  return undefined;
};

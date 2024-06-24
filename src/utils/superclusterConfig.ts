import { ViewportProps } from '../features/common/types/map';
import { Bound } from '../features/common/types/map';
import Supercluster, { PointFeature } from 'supercluster';
import { RefObject } from 'react';
import { MapRef } from 'react-map-gl';
import { DonationProperties } from '../features/common/types/myForestv2';
import { MyContributionsSingleRegistration } from '../features/common/types/myForestv2';

const clusterConfigV2 = {
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
) => {
  const supercluster = new Supercluster<
    DonationProperties | MyContributionsSingleRegistration
  >(clusterConfigV2);
  supercluster.load(geoJson);
  const zoom = viewState?.zoom;
  if (mapRef && mapRef.current !== null) {
    const map = mapRef.current.getMap();
    const bounds = map.getBounds().toArray().flat();
    const bound: Bound = bounds && [bounds[0], bounds[1], bounds[2], bounds[3]];
    if (zoom && !clusterId) {
      const clusters = supercluster?.getClusters(bound, zoom);
      return clusters;
    }
    if (clusterId) {
      return supercluster.getLeaves(
        Number(clusterId)
      ) as PointFeature<DonationProperties>[];
    }
  }
};

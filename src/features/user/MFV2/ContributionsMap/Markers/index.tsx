import { AnyProps, PointFeature } from 'supercluster';
import { MutableRefObject, useEffect, useState } from 'react';
import { getClusterGeojson } from '../../../../../utils/superclusterConfig';
import ClusterMarker from './ClusterMarker';
import PointMarkers from './PointMarkers';
import RegisteredTreeClusterMarker from './RegisteredTreeClusterMarker';
import {
  DonationProperties,
  useMyForestV2,
} from '../../../../common/Layout/MyForestContextV2';
import { ViewportProps } from '../../../../common/types/map';
import { MyContributionsSingleRegistration } from '../../../../common/types/myForestv2';

interface MarkersProps {
  mapRef: MutableRefObject<null>;
  viewport: ViewportProps;
}

const Markers = ({ mapRef, viewport }: MarkersProps) => {
  const { registrationGeojson, donationGeojson } = useMyForestV2();
  const [donationSuperclusterResponse, setDonationSuperclusterResponse] =
    useState<PointFeature<DonationProperties>[]>([]);
  const [
    registrationSuperclusterResponse,
    setRegistrationSuperclusterResponse,
  ] = useState<PointFeature<MyContributionsSingleRegistration>[]>([]);

  useEffect(() => {
    if (donationGeojson && viewport) {
      const superclusterResponseForDonatedTree = getClusterGeojson(
        viewport,
        mapRef,
        donationGeojson,
        undefined
      ) as PointFeature<DonationProperties>[];
      setDonationSuperclusterResponse(superclusterResponseForDonatedTree);
    }
  }, [viewport, donationGeojson]);

  useEffect(() => {
    if (registrationGeojson && viewport) {
      const superclusterResponseForRegisteredTree = getClusterGeojson(
        viewport,
        mapRef,
        registrationGeojson,
        undefined
      ) as PointFeature<MyContributionsSingleRegistration>[];
      setRegistrationSuperclusterResponse(
        superclusterResponseForRegisteredTree
      );
    }
  }, [viewport, registrationGeojson]);

  return donationSuperclusterResponse && registrationSuperclusterResponse ? (
    <>
      {donationSuperclusterResponse.map((geoJson, key) => {
        return geoJson.properties.cluster ? (
          <ClusterMarker
            key={geoJson.id}
            superclusterResponse={geoJson}
            viewport={viewport}
            mapRef={mapRef}
          />
        ) : (
          <PointMarkers superclusterResponse={geoJson} key={key} />
        );
      })}
      {registrationSuperclusterResponse.map((geoJson, key) => {
        return geoJson.properties.cluster ? (
          <RegisteredTreeClusterMarker
            superclusterResponse={geoJson}
            key={geoJson.id}
          />
        ) : (
          <PointMarkers superclusterResponse={geoJson} key={key} />
        );
      })}
    </>
  ) : (
    <></>
  );
};

export default Markers;

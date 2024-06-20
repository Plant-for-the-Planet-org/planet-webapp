import { ClusterProperties, PointFeature } from 'supercluster';
import { MutableRefObject, useEffect, useState } from 'react';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import ClusterMarker from './ClusterMarker';
import PointMarkers from './PointMarkers';
import RegisteredTreeClusterMarker from './RegisteredTreeClusterMarker';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { ViewportProps } from '../../../../common/types/map';
import { DonationProperties } from '../../../../common/Layout/MyForestContextV2';
import { MyContributionsSingleRegistration } from '../../../../common/types/myForestv2';

interface MarkersProps {
  mapRef: MutableRefObject<null>;
  viewport: ViewportProps;
  profilePageType: 'public' | 'private';
  supportedTreecounter: string | undefined;
}

type SuperclusterResponse =
  | PointFeature<DonationProperties | ClusterProperties>
  | PointFeature<MyContributionsSingleRegistration | ClusterProperties>;

const Markers = ({
  mapRef,
  viewport,
  profilePageType,
  supportedTreecounter,
}: MarkersProps) => {
  const { registrationGeojson, donationGeojson } = useMyForestV2();
  const [donationSuperclusterResponse, setDonationSuperclusterResponse] =
    useState<SuperclusterResponse[] | undefined>([]);
  const [registrationSuperclusterResponse, setRegistrationSuperclusteResponse] =
    useState<SuperclusterResponse[] | undefined>([]);

  useEffect(() => {
    if (donationGeojson && viewport) {
      const superclusterResponseForDonatedTree = _getClusterGeojson(
        viewport,
        mapRef,
        donationGeojson,
        undefined
      ) as PointFeature<DonationProperties | ClusterProperties>[];

      setDonationSuperclusterResponse(superclusterResponseForDonatedTree);
    }
  }, [viewport, donationGeojson]);

  useEffect(() => {
    if (donationGeojson && viewport) {
      const superclusterResponseForRegisteredTree = _getClusterGeojson(
        viewport,
        mapRef,
        registrationGeojson,
        undefined
      ) as PointFeature<
        MyContributionsSingleRegistration | ClusterProperties
      >[];
      setRegistrationSuperclusteResponse(superclusterResponseForRegisteredTree);
    }
  }, [viewport, registrationGeojson]);

  return donationSuperclusterResponse && registrationSuperclusterResponse ? (
    <>
      {donationSuperclusterResponse.map((geoJson) => {
        return (geoJson as PointFeature<ClusterProperties>).properties
          .cluster ? (
          <ClusterMarker
            key={geoJson.id}
            superclusterResponse={geoJson as PointFeature<ClusterProperties>}
            viewport={viewport}
            mapRef={mapRef}
          />
        ) : (
          <PointMarkers
            superclusterResponse={geoJson as PointFeature<DonationProperties>}
            profilePageType={profilePageType}
            supportedTreecounter={supportedTreecounter}
          />
        );
      })}
      {registrationSuperclusterResponse.map((geoJson) => {
        return (geoJson as PointFeature<ClusterProperties>).properties
          .cluster ? (
          <RegisteredTreeClusterMarker
            key={geoJson.id}
            superclusterResponse={geoJson as PointFeature<ClusterProperties>}
          />
        ) : (
          <PointMarkers
            superclusterResponse={
              geoJson as PointFeature<MyContributionsSingleRegistration>
            }
            profilePageType={profilePageType}
            supportedTreecounter={supportedTreecounter}
          />
        );
      })}
    </>
  ) : (
    <></>
  );
};
export default Markers;

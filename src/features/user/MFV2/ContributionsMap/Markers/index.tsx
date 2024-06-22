import { PointFeature, ClusterProperties } from 'supercluster';
import { MutableRefObject, useEffect, useState } from 'react';
import { getClusterGeojson } from '../../../../../utils/superclusterConfig';
import DonationClusterMarker from './DonationClusterMarker';
import PointMarkers from './PointMarkers';
import RegisteredTreeClusterMarker from './RegisteredTreeClusterMarker';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { ViewportProps } from '../../../../common/types/map';
import {
  DonationProperties,
  DonationSuperclusterProperties,
  MyContributionsSingleRegistration,
  RegistrationSuperclusterProperties,
} from '../../../../common/types/myForestv2';

interface MarkersProps {
  mapRef: MutableRefObject<null>;
  viewport: ViewportProps;
}

const isCluster = (
  geoJson: PointFeature<
    | DonationSuperclusterProperties
    | RegistrationSuperclusterProperties
    | ClusterProperties
  >
): geoJson is PointFeature<ClusterProperties> => {
  return (geoJson.properties as ClusterProperties).cluster !== undefined;
};

const Markers = ({ mapRef, viewport }: MarkersProps) => {
  const { registrationGeojson, donationGeojson } = useMyForestV2();
  const [donationSuperclusterResponse, setDonationSuperclusterResponse] =
    useState<PointFeature<DonationSuperclusterProperties>[]>([]);
  const [
    registrationSuperclusterResponse,
    setRegistrationSuperclusterResponse,
  ] = useState<PointFeature<RegistrationSuperclusterProperties>[]>([]);

  useEffect(() => {
    if (donationGeojson && viewport) {
      const superclusterResponseForDonatedTree = getClusterGeojson(
        viewport,
        mapRef,
        donationGeojson,
        undefined
      ) as PointFeature<DonationSuperclusterProperties>[];
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
      ) as PointFeature<RegistrationSuperclusterProperties>[];
      setRegistrationSuperclusterResponse(
        superclusterResponseForRegisteredTree
      );
    }
  }, [viewport, registrationGeojson]);
  return donationSuperclusterResponse && registrationSuperclusterResponse ? (
    <>
      {donationSuperclusterResponse.map((geoJson, key) => {
        return isCluster(geoJson) ? (
          <DonationClusterMarker
            key={geoJson.id}
            superclusterResponse={geoJson}
            viewport={viewport}
            mapRef={mapRef}
          />
        ) : (
          <PointMarkers
            superclusterResponse={geoJson as PointFeature<DonationProperties>}
            key={key}
          />
        );
      })}
      {registrationSuperclusterResponse.map((geoJson, key) => {
        return isCluster(geoJson) ? (
          <RegisteredTreeClusterMarker
            key={geoJson.id}
            superclusterResponse={geoJson}
          />
        ) : (
          <PointMarkers
            superclusterResponse={
              geoJson as PointFeature<MyContributionsSingleRegistration>
            }
            key={key}
          />
        );
      })}
    </>
  ) : (
    <></>
  );
};

export default Markers;

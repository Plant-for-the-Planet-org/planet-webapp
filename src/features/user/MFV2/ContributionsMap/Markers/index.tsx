import { AnyProps, PointFeature } from 'supercluster';
import { MutableRefObject, useEffect, useState } from 'react';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import ClusterMarker from './ClusterMarker';
import SinglePointMarkers from './SinglePointMarkers';
import RegisteredTreeClusterMarker from './RegisteredTreeClusterMarker';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { ViewportProps } from '../../../../common/types/map';

interface MarkersProps {
  mapRef: MutableRefObject<null>;
  viewport: ViewportProps;
}

const Markers = ({ mapRef, viewport }: MarkersProps) => {
  const { registrationGeojson, donationGeojson } = useMyForestV2();
  const [donationSuperclusterResponse, setDonationSuperclusteResponse] =
    useState<PointFeature<AnyProps>[] | undefined>([]);
  const [registrationSuperclusterResponse, setRegistrationSuperclusteResponse] =
    useState<PointFeature<AnyProps>[] | undefined>([]);

  useEffect(() => {
    if (donationGeojson && viewport) {
      const superclusterResponseForDonatedTree = _getClusterGeojson(
        viewport,
        mapRef,
        donationGeojson,
        undefined
      );
      setDonationSuperclusteResponse(superclusterResponseForDonatedTree);
    }
  }, [viewport, donationGeojson]);

  useEffect(() => {
    if (donationGeojson && viewport) {
      const superclusterResponseForRegisteredTree = _getClusterGeojson(
        viewport,
        mapRef,
        registrationGeojson,
        undefined
      );
      setRegistrationSuperclusteResponse(superclusterResponseForRegisteredTree);
    }
  }, [viewport, registrationGeojson]);

  return donationSuperclusterResponse && registrationSuperclusterResponse ? (
    <>
      {donationSuperclusterResponse.map((geoJson) => {
        return geoJson.properties.cluster ? (
          <ClusterMarker
            superclusterResponse={geoJson}
            viewport={viewport}
            mapRef={mapRef}
          />
        ) : (
          <SinglePointMarkers superclusterResponse={geoJson} />
        );
      })}
      {registrationSuperclusterResponse.map((geoJson) => {
        return geoJson.properties.cluster ? (
          <RegisteredTreeClusterMarker superclusterResponse={geoJson} />
        ) : (
          <SinglePointMarkers superclusterResponse={geoJson} />
        );
      })}
    </>
  ) : (
    <></>
  );
};

export default Markers;

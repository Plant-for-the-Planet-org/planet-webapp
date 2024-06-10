import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { MutableRefObject, useEffect, useState } from 'react';
import ClusterMarker from './ClusterMarker';
import SinglePointMarkers from './SinglePointMarkers';
import RegisteredTreeClusterMarker from './RegisteredTreeClusterMarker';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { ClusterFeature, AnyProps, PointFeature } from 'supercluster';

interface MarkersProps {
  mapRef: MutableRefObject<null>;
  viewport: any;
}

const Markers = ({ mapRef, viewport }: MarkersProps) => {
  const { registrationGeojson, donationGeojson } = useMyForestV2();
  const [donatedTreeSuperclusterResponse, setDonatedTreeSuperclusteResponse] =
    useState<(ClusterFeature<AnyProps> | PointFeature<AnyProps>)[] | undefined>(
      undefined
    );
  const [
    registeredTreeSuperclusterResponse,
    setRegisteredTreeSuperclusteResponse,
  ] = useState<
    (ClusterFeature<AnyProps> | PointFeature<AnyProps>)[] | undefined
  >([]);

  useEffect(() => {
    if (donationGeojson && viewport) {
      const superclusterResponseForDonatedTree = _getClusterGeojson(
        viewport,
        mapRef,
        donationGeojson,
        undefined
      );
      setDonatedTreeSuperclusteResponse(superclusterResponseForDonatedTree);
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
      setRegisteredTreeSuperclusteResponse(
        superclusterResponseForRegisteredTree
      );
    }
  }, [viewport, registrationGeojson]);

  return donatedTreeSuperclusterResponse &&
    registeredTreeSuperclusterResponse ? (
    <>
      {donatedTreeSuperclusterResponse.map((geoJson) => {
        return geoJson.id ? (
          <ClusterMarker
            superclusterResponse={geoJson}
            viewport={viewport}
            mapRef={mapRef}
          />
        ) : (
          <SinglePointMarkers superclusterResponse={geoJson} />
        );
      })}
      {registeredTreeSuperclusterResponse.map((geoJson) => {
        return geoJson.id && geoJson.properties.cluster ? (
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

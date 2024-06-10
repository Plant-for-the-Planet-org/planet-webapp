import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { useEffect, useState } from 'react';
import ClusterMarker from './ClusterMarker';
import SinglePointMarkers from './SinglePointMarkers';
import RegisteredTreeClusterMarker from './RegisteredTreeClusterMarker';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { ClusterFeature, PointFeature } from 'supercluster';
import Supercluster from 'supercluster';

const Markers = ({ mapRef, viewport }) => {
  const { registrationGeojson, donationGeojson } = useMyForestV2();
  const [donatedTreeSuperclusterResponse, setDonatedTreeSuperclusteResponse] =
    useState<
      | (
          | ClusterFeature<Supercluster.AnyProps>
          | PointFeature<Supercluster.AnyProps>
        )[]
      | undefined
    >(undefined);
  const [
    registeredTreeSuperclusterResponse,
    setRegisteredTreeSuperclusteResponse,
  ] = useState<
    | (
        | ClusterFeature<Supercluster.AnyProps>
        | PointFeature<Supercluster.AnyProps>
      )[]
    | undefined
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
            geoJson={geoJson}
            viewport={viewport}
            mapRef={mapRef}
          />
        ) : (
          <>
            {/* {console.log(geoJson, '==1')} */}
            <SinglePointMarkers superclusterResponse={geoJson} />
          </>
        );
      })}
      {registeredTreeSuperclusterResponse.map((geoJson) => {
        return geoJson.id && geoJson.properties.cluster ? (
          <RegisteredTreeClusterMarker
            geoJson={geoJson}
            viewport={viewport}
            mapRef={mapRef}
          />
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

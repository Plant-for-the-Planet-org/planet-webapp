import type { ClusterProperties, PointFeature } from 'supercluster';
import type { MutableRefObject } from 'react';
import type {
  DonationProperties,
  DonationSuperclusterProperties,
  MyContributionsSingleRegistration,
  ProfilePageType,
  RegistrationSuperclusterProperties,
} from '../../../../common/types/myForest';
import type { SetState } from '../../../../common/types/common';
import type { ViewState } from 'react-map-gl-v7/maplibre';

import { useEffect, useRef, useState } from 'react';
import { getClusterGeojson } from '../../../../../utils/superclusterConfig';
import DonationClusterMarker from './DonationClusterMarker';
import PointMarkers from './PointMarkers';
import RegisteredTreeClusterMarker from './RegisteredTreeClusterMarker';
import center from '@turf/center';
import { useMyForestStore } from '../../../../../stores/myForestStore';

interface MarkersProps {
  mapRef: MutableRefObject<null>;
  viewState: ViewState;
  setViewState: SetState<ViewState>;
  profilePageType: ProfilePageType;
  supportedTreecounter: string | undefined;
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

const Markers = ({
  mapRef,
  viewState,
  setViewState,
  profilePageType,
  supportedTreecounter,
}: MarkersProps) => {
  const registrationGeojson = useMyForestStore(
    (state) => state.registrationGeojson
  );
  const donationGeojson = useMyForestStore((state) => state.donationGeojson);
  const [donationSuperclusterResponse, setDonationSuperclusterResponse] =
    useState<PointFeature<DonationSuperclusterProperties>[]>([]);
  const [
    registrationSuperclusterResponse,
    setRegistrationSuperclusterResponse,
  ] = useState<PointFeature<RegistrationSuperclusterProperties>[]>([]);
  const hasCentered = useRef(false);

  useEffect(() => {
    if (donationGeojson && viewState) {
      const superclusterResponseForDonatedTree = getClusterGeojson(
        viewState,
        mapRef,
        donationGeojson,
        undefined
      ) as PointFeature<DonationSuperclusterProperties>[];
      setDonationSuperclusterResponse(superclusterResponseForDonatedTree);
    }
  }, [viewState, donationGeojson]);

  useEffect(() => {
    if (registrationGeojson && viewState) {
      const superclusterResponseForRegisteredTree = getClusterGeojson(
        viewState,
        mapRef,
        registrationGeojson,
        undefined
      ) as PointFeature<RegistrationSuperclusterProperties>[];
      setRegistrationSuperclusterResponse(
        superclusterResponseForRegisteredTree
      );
    }
  }, [viewState, registrationGeojson]);

  // Centers the map after the initial data is loaded
  useEffect(() => {
    if (
      !hasCentered.current &&
      donationSuperclusterResponse.length +
        registrationSuperclusterResponse.length >
        0
    ) {
      const combinedSuperclusterResponse = [
        ...donationSuperclusterResponse,
        ...registrationSuperclusterResponse,
      ];

      const validFeatures = combinedSuperclusterResponse.filter(
        (feature) =>
          feature.geometry &&
          feature.geometry.type === 'Point' &&
          Array.isArray(feature.geometry.coordinates) &&
          feature.geometry.coordinates.length === 2
      );

      if (validFeatures.length > 0) {
        const markersGeojson = {
          type: 'FeatureCollection',
          features: validFeatures,
        };

        // Find the center
        try {
          const centerPoint = center(markersGeojson);
          setViewState((prevState) => ({
            ...prevState,
            latitude: centerPoint.geometry?.coordinates[1] || 0,
            longitude: centerPoint.geometry?.coordinates[0] || 0,
          }));
        } catch (e) {
          console.error('Error while centering the map', e);
        }
      }
      hasCentered.current = true;
    }
  }, [
    donationSuperclusterResponse,
    registrationSuperclusterResponse,
    setViewState,
  ]);

  return donationSuperclusterResponse && registrationSuperclusterResponse ? (
    <>
      {donationSuperclusterResponse.map((geoJson, key) => {
        return isCluster(geoJson) ? (
          <DonationClusterMarker
            key={geoJson.id}
            superclusterResponse={geoJson}
            viewState={viewState}
            mapRef={mapRef}
          />
        ) : (
          <PointMarkers
            superclusterResponse={geoJson as PointFeature<DonationProperties>}
            key={key}
            profilePageType={profilePageType}
            supportedTreecounter={supportedTreecounter}
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

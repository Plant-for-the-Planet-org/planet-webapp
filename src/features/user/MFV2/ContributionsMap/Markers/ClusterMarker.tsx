import { Marker } from 'react-map-gl-v7';
import { MutableRefObject, useEffect, useState } from 'react';
import ContributionClusterMarkerIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/ClusterMarker/ContributionClusterMarkerIcon';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import themeProperties from '../../../../../theme/themeProperties';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import Supercluster, {
  ClusterFeature,
  PointFeature,
  AnyProps,
} from 'supercluster';

export interface ClusterMarkerProps {
  superclusterResponse: ClusterFeature<AnyProps> | PointFeature<AnyProps>;
  viewport: any;
  mapRef: MutableRefObject<null>;
}

const ClusterMarker = ({
  superclusterResponse,
  viewport,
  mapRef,
}: ClusterMarkerProps) => {
  const [clusterChildren, setClusterChildren] = useState<
    | (
        | ClusterFeature<Supercluster.AnyProps>
        | PointFeature<Supercluster.AnyProps>
      )[]
    | undefined
  >(undefined);
  const { donationGeojson } = useMyForestV2();
  const { primaryDarkColor, electricPurple, mediumBlue } = themeProperties;
  useEffect(() => {
    if (superclusterResponse && viewport && donationGeojson) {
      const data = _getClusterGeojson(
        viewport,
        mapRef,
        donationGeojson,
        superclusterResponse.id
      );
      setClusterChildren(data);
    }
  }, [viewport, superclusterResponse]);

  const countProjectsByPurpose = (purpose: string) => {
    if (clusterChildren) {
      return clusterChildren.filter(
        (superclusterResponse) =>
          superclusterResponse?.properties?.projectInfo?.purpose === purpose
      ).length;
    }
  };

  const chooseColorForClusterMarker = () => {
    const treeCount = countProjectsByPurpose('trees') ?? 0;
    const restorationCount = countProjectsByPurpose('restoration') ?? 0;
    const conservationCount = countProjectsByPurpose('conservation') ?? 0;

    if (treeCount > 0 && restorationCount === 0 && conservationCount === 0) {
      return [
        `${primaryDarkColor}`,
        `${primaryDarkColor}`,
        `${primaryDarkColor}`,
      ];
    } else if (
      treeCount === 0 &&
      restorationCount > 0 &&
      conservationCount === 0
    ) {
      return [`${electricPurple}`, `${electricPurple}`, `${electricPurple}`];
    } else if (
      treeCount === 0 &&
      restorationCount === 0 &&
      conservationCount > 0
    ) {
      return [`${mediumBlue}`, `${mediumBlue}`, `${mediumBlue}`];
    } else if (treeCount > 0 && restorationCount > 0 && conservationCount > 0) {
      // when cluster has all type of projects{restoration,conservation,treePlantation}
      if (treeCount > restorationCount) {
        if (treeCount > conservationCount) {
          return [`${mediumBlue}`, `${electricPurple}`, `${primaryDarkColor}`];
        } else {
          return [`${primaryDarkColor}`, `${electricPurple}`, `${mediumBlue}`];
        }
      } else if (restorationCount > conservationCount) {
        return [`${mediumBlue}`, `${primaryDarkColor}`, `${electricPurple}`];
      } else {
        return [`${electricPurple}`, `${primaryDarkColor}`, `${mediumBlue}`];
      }
    } else if (
      treeCount > 0 &&
      restorationCount === 0 &&
      conservationCount > 0
    ) {
      if (treeCount > conservationCount) {
        return [`${mediumBlue}`, `${primaryDarkColor}`, `${primaryDarkColor}`];
      } else {
        return [`${primaryDarkColor}`, `${mediumBlue}`, `${mediumBlue}`];
      }
    } else if (
      treeCount === 0 &&
      restorationCount > 0 &&
      conservationCount > 0
    ) {
      if (restorationCount > conservationCount) {
        return [`${mediumBlue}`, `${electricPurple}`, `${electricPurple}`];
      } else {
        return [`${electricPurple}`, `${mediumBlue}`, `${mediumBlue}`];
      }
    } else if (
      treeCount > 0 &&
      restorationCount > 0 &&
      conservationCount === 0
    ) {
      if (treeCount > restorationCount) {
        return [
          `${electricPurple}`,
          `${primaryDarkColor}`,
          `${primaryDarkColor}`,
        ];
      } else {
        return [
          `${primaryDarkColor}`,
          `${electricPurple}`,
          `${electricPurple}`,
        ];
      }
    }
    return ['', '', ''];
  };

  const [color1, color2, color3] = chooseColorForClusterMarker();

  return (
    <Marker
      longitude={superclusterResponse?.geometry.coordinates[0]}
      latitude={superclusterResponse?.geometry.coordinates[1]}
    >
      <ContributionClusterMarkerIcon
        color1={color1}
        color2={color2}
        color3={color3}
        width={68}
      />
    </Marker>
  );
};

export default ClusterMarker;

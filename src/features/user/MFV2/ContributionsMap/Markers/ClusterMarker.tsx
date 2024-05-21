import { Marker } from 'react-map-gl-v7';
import { useEffect, useState } from 'react';
import ContributionClusterMarkerIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/ClusterMarker/ContributionClusterMarkerIcon';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import themeProperties from '../../../../../theme/themeProperties';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import { ClusterFeature, PointFeature, AnyProps } from 'supercluster';

const ClusterMarker = ({ geoJson, viewport, mapRef }) => {
  const [clusterChildren, setClusterChildren] = useState<
    (ClusterFeature<AnyProps> | PointFeature<AnyProps>)[]
  >([]);
  const { donationGeojson } = useMyForestV2();
  const { primaryDarkColor, electricPurple, mediumBlue } = themeProperties;
  useEffect(() => {
    if (geoJson && viewport && donationGeojson) {
      const data = _getClusterGeojson(
        viewport,
        mapRef,
        donationGeojson,
        geoJson.id
      );
      setClusterChildren(data);
    }
  }, [viewport, geoJson]);

  const countProjectsByPurpose = (purpose) => {
    return clusterChildren.filter(
      (geojson) => geojson?.properties.project.purpose === purpose
    ).length;
  };

  const chooseColorForClusterMarker = () => {
    const treeCount = countProjectsByPurpose('trees');
    const restorationCount = countProjectsByPurpose('restoration');
    const conservationCount = countProjectsByPurpose('conservation');

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
      longitude={geoJson?.geometry.coordinates[0]}
      latitude={geoJson?.geometry.coordinates[1]}
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

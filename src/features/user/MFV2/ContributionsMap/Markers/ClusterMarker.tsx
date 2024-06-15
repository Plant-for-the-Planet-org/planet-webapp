import { Marker } from 'react-map-gl-v7';
import { MutableRefObject, useEffect, useState } from 'react';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import themeProperties from '../../../../../theme/themeProperties';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import Supercluster, {
  ClusterFeature,
  PointFeature,
  AnyProps,
} from 'supercluster';
import {
  Mangroves,
  NaturalRegeneration,
  ManagedRegeneration,
  Agroforestry,
  UrbanRestoration,
  TreePlanting,
  Conservation,
} from '../../../../../../public/assets/images/icons/ClusterMarkerIcons';

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
  const { primaryDarkColor, electricPurpleColor, mediumBlueColor } =
    themeProperties;
  const [
    classificationWithMaxContributions,
    setClassificationWithMaxContributions,
  ] = useState('');
  const [purposeWithMaxContribution, setPurposeWithMaxContribution] =
    useState('');

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

  const GetClassificationAndProjectType = () => {
    const contributionToClassifications: any = {};
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
        return [
          `${electricPurpleColor}`,
          `${electricPurpleColor}`,
          `${electricPurpleColor}`,
        ];
      } else if (
        treeCount === 0 &&
        restorationCount === 0 &&
        conservationCount > 0
      ) {
        return [
          `${mediumBlueColor}`,
          `${mediumBlueColor}`,
          `${mediumBlueColor}`,
        ];
      } else if (
        treeCount > 0 &&
        restorationCount > 0 &&
        conservationCount > 0
      ) {
        // when cluster has all type of projects{restoration,conservation,treePlantation}
        if (treeCount > restorationCount) {
          if (treeCount > conservationCount) {
            return [
              `${mediumBlueColor}`,
              `${electricPurpleColor}`,
              `${primaryDarkColor}`,
            ];
          } else {
            return [
              `${primaryDarkColor}`,
              `${electricPurpleColor}`,
              `${mediumBlueColor}`,
            ];
          }
        } else if (restorationCount > conservationCount) {
          return [
            `${mediumBlueColor}`,
            `${primaryDarkColor}`,
            `${electricPurpleColor}`,
          ];
        } else {
          return [
            `${electricPurpleColor}`,
            `${primaryDarkColor}`,
            `${mediumBlueColor}`,
          ];
        }
      } else if (
        treeCount > 0 &&
        restorationCount === 0 &&
        conservationCount > 0
      ) {
        if (treeCount > conservationCount) {
          return [
            `${mediumBlueColor}`,
            `${primaryDarkColor}`,
            `${primaryDarkColor}`,
          ];
        } else {
          return [
            `${primaryDarkColor}`,
            `${mediumBlueColor}`,
            `${mediumBlueColor}`,
          ];
        }
      } else if (
        treeCount === 0 &&
        restorationCount > 0 &&
        conservationCount > 0
      ) {
        if (restorationCount > conservationCount) {
          return [
            `${mediumBlueColor}`,
            `${electricPurpleColor}`,
            `${electricPurpleColor}`,
          ];
        } else {
          return [
            `${electricPurpleColor}`,
            `${mediumBlueColor}`,
            `${mediumBlueColor}`,
          ];
        }
      } else if (
        treeCount > 0 &&
        restorationCount > 0 &&
        conservationCount === 0
      ) {
        if (treeCount > restorationCount) {
          return [
            `${electricPurpleColor}`,
            `${primaryDarkColor}`,
            `${primaryDarkColor}`,
          ];
        } else {
          return [
            `${primaryDarkColor}`,
            `${electricPurpleColor}`,
            `${electricPurpleColor}`,
          ];
        }
      }
      return ['', '', ''];
    };
    const [color1, color2, color3] = chooseColorForClusterMarker();

    //helper function to find out classification value which has more contribtuions
    const findMaxContributionClassification = () => {
      if (clusterChildren) {
        clusterChildren.forEach((obj) => {
          const { classification } = obj.properties.projectInfo;
          const { contributionCount } = obj.properties.contributionInfo;
          if (contributionToClassifications[classification]) {
            contributionToClassifications[classification] += contributionCount;
          } else {
            contributionToClassifications[classification] = contributionCount;
          }
        });
        let maxContribution = -Infinity;
        let _classificationWithMaxContribution = '';

        for (const classification in contributionToClassifications) {
          if (contributionToClassifications[classification] > maxContribution) {
            maxContribution = contributionToClassifications[classification];
            _classificationWithMaxContribution = classification;
          }
        }
        setClassificationWithMaxContributions(
          _classificationWithMaxContribution
        );
      }
    };

    const findMaxContributionPurpose = () => {
      if (clusterChildren) {
        let highestContribution = -Infinity;
        let _purposeWithMaxContribution = '';

        clusterChildren.forEach((feature) => {
          const contributionCount =
            feature.properties.contributionInfo.contributionCount;
          const purpose = feature.properties.projectInfo.purpose;
          if (contributionCount > highestContribution) {
            highestContribution = contributionCount;
            _purposeWithMaxContribution = purpose;
          }
        });

        setPurposeWithMaxContribution(_purposeWithMaxContribution);
      }
    };

    useEffect(() => {
      findMaxContributionClassification();
      findMaxContributionPurpose();
    }, [clusterChildren]);

    const clusterIconProps = {
      color1,
      color2,
      color3,
      width: 55,
    };
    if (purposeWithMaxContribution === 'conservation') {
      return <Conservation {...clusterIconProps} />;
    }

    switch (classificationWithMaxContributions) {
      case 'natural-regeneration':
        return <NaturalRegeneration {...clusterIconProps} />;
      case 'mangroves':
        return <Mangroves {...clusterIconProps} />;
      case 'managed-regeneration':
        return <ManagedRegeneration {...clusterIconProps} />;
      case 'agroforestry':
        return <Agroforestry {...clusterIconProps} />;
      case 'urban-planting':
        return <UrbanRestoration {...clusterIconProps} />;
      case 'large-scale-planting':
      case 'other-planting':
        return <TreePlanting {...clusterIconProps} />;
      default:
        return null;
    }
  };
  return (
    <Marker
      longitude={superclusterResponse?.geometry.coordinates[0]}
      latitude={superclusterResponse?.geometry.coordinates[1]}
    >
      <GetClassificationAndProjectType />
    </Marker>
  );
};

export default ClusterMarker;

import { Marker } from 'react-map-gl-v7';
import { MutableRefObject, useEffect, useState } from 'react';
import { PointFeature, AnyProps } from 'supercluster';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import ClusterIcon from './ClusterIcon';
import {
  ProjectPurposeTypes,
  TreeProjectClassification,
  UnitTypes,
} from '@planet-sdk/common';
import {
  getClusterMarkerColors,
  extractAndClassifyProjectData,
} from '../../../../../utils/myForestV2Utils';
import { ViewportProps } from '../../../../common/types/map';

export interface ClusterMarkerProps {
  superclusterResponse: PointFeature<AnyProps>;
  viewport: ViewportProps;
  mapRef: MutableRefObject<null>;
}

export type ExtractedData = {
  unitType: UnitTypes;
  classification: TreeProjectClassification;
  purpose: ProjectPurposeTypes;
  contributionCount: number;
};

const ClusterMarker = ({
  superclusterResponse,
  viewport,
  mapRef,
}: ClusterMarkerProps) => {
  const [clusterChildren, setClusterChildren] = useState<
    PointFeature<AnyProps>[] | undefined
  >(undefined);
  const { donationGeojson } = useMyForestV2();
  const [colors, setColors] = useState({
    tertiaryProjectColor: '',
    secondaryProjectColor: '',
    mainProjectColor: '',
  });

  const [maxContributingProject, setMaxContributingProject] =
    useState<ExtractedData | null>(null);
  const [uniqueUnitTypePurposeProjects, setUniqueUnitTypePurposeProjects] =
    useState<ExtractedData[]>([]);

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

  useEffect(() => {
    const _colors = getClusterMarkerColors(
      maxContributingProject,
      uniqueUnitTypePurposeProjects
    );
    setColors(_colors);
  }, [maxContributingProject, uniqueUnitTypePurposeProjects]);

  useEffect(() => {
    const projects = extractAndClassifyProjectData(clusterChildren);
    if (projects) {
      const { maxContributingObject, uniqueObjects } = projects;
      setMaxContributingProject(maxContributingObject);
      setUniqueUnitTypePurposeProjects(uniqueObjects);
    }
  }, [clusterChildren]);

  const { tertiaryProjectColor, secondaryProjectColor, mainProjectColor } =
    colors;

  const clusterMarkerColors = {
    tertiaryProjectColor,
    secondaryProjectColor,
    mainProjectColor,
  };
  const longitude = superclusterResponse?.geometry.coordinates[0];
  const latitude = superclusterResponse?.geometry.coordinates[1];

  return (
    <Marker longitude={longitude} latitude={latitude}>
      <ClusterIcon
        classification={maxContributingProject?.classification}
        purpose={maxContributingProject?.purpose}
        {...clusterMarkerColors}
      />
    </Marker>
  );
};

export default ClusterMarker;

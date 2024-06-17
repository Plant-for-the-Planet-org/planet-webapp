import { Marker } from 'react-map-gl-v7';
import { MutableRefObject, useEffect, useState } from 'react';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import {
  DonationGeojson,
  useMyForestV2,
} from '../../../../common/Layout/MyForestContextV2';
import { PointFeature, AnyProps } from 'supercluster';
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

export interface ClusterMarkerProps {
  superclusterResponse: PointFeature<DonationGeojson>;
  viewport: any;
  mapRef: MutableRefObject<null>;
}

export type ExtractedData = {
  unitType: UnitTypes;
  classification: TreeProjectClassification;
  purpose: ProjectPurposeTypes;
  contributionCount: number;
};

export type Accumulator = {
  maxContributionCount: number;
  maxContributingObject: ExtractedData | null;
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
  const [remainingProjects, setRemainingProjects] = useState<ExtractedData[]>(
    []
  );
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
      remainingProjects
    );
    setColors(_colors);
  }, [maxContributingProject, remainingProjects]);

  useEffect(() => {
    const projects = extractAndClassifyProjectData(clusterChildren);
    if (projects) {
      setMaxContributingProject(projects.maxContributingObject);
      setRemainingProjects(projects.uniqueObjects);
    }
  }, [clusterChildren]);

  const { tertiaryProjectColor, secondaryProjectColor, mainProjectColor } =
    colors;

  return (
    <Marker
      longitude={superclusterResponse?.geometry.coordinates[0]}
      latitude={superclusterResponse?.geometry.coordinates[1]}
    >
      <ClusterIcon
        classification={maxContributingProject?.classification}
        purpose={maxContributingProject?.purpose}
        tertiaryProjectColor={tertiaryProjectColor}
        secondaryProjectColor={secondaryProjectColor}
        mainProjectColor={mainProjectColor}
      />
    </Marker>
  );
};

export default ClusterMarker;

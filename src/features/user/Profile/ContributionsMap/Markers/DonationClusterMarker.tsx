import type { ViewState } from 'react-map-gl-v7/maplibre';
import type {
  DonationProperties,
  DonationSuperclusterProperties,
} from '../../../../common/types/myForest';
import type { ProjectPurpose } from './ProjectTypeIcon';
import type { MutableRefObject } from 'react';
import type { PointFeature } from 'supercluster';
import type { TreeProjectClassification, UnitTypes } from '@planet-sdk/common';

import { Marker } from 'react-map-gl-v7/maplibre';
import { useEffect, useState } from 'react';
import { getClusterGeojson } from '../../../../../utils/superclusterConfig';
import ClusterIcon from './ClusterIcon';
import {
  getDonationClusterMarkerColors,
  extractAndClassifyProjectData,
} from '../../../../../utils/myForestUtils';
import styles from '../Common/common.module.scss';
import { useMyForestStore } from '../../../../../stores/myForestStore';

export interface DonationClusterMarkerProps {
  superclusterResponse: PointFeature<DonationSuperclusterProperties>;
  viewState: ViewState;
  mapRef: MutableRefObject<null>;
}

export type ExtractedProjectData = {
  unitType: UnitTypes;
  classification: TreeProjectClassification | undefined | null;
  purpose: ProjectPurpose;
  contributionCount: number;
};

const DonationClusterMarker = ({
  superclusterResponse,
  viewState,
  mapRef,
}: DonationClusterMarkerProps) => {
  const donationGeojson = useMyForestStore((state) => state.donationGeojson);
  const [clusterChildren, setClusterChildren] = useState<
    PointFeature<DonationProperties>[]
  >([]);
  const [colors, setColors] = useState({
    tertiaryProjectColor: '',
    secondaryProjectColor: '',
    mainProjectColor: '',
  });

  const [maxContributingProject, setMaxContributingProject] =
    useState<ExtractedProjectData | null>(null);
  const [uniqueUnitTypePurposeProjects, setUniqueUnitTypePurposeProjects] =
    useState<ExtractedProjectData[]>([]);

  useEffect(() => {
    if (superclusterResponse && viewState && donationGeojson) {
      const data = getClusterGeojson(
        viewState,
        mapRef,
        donationGeojson,
        superclusterResponse.id
      ) as PointFeature<DonationProperties>[];

      setClusterChildren(data);
    }
  }, [viewState, superclusterResponse]);

  useEffect(() => {
    const _colors = getDonationClusterMarkerColors(
      maxContributingProject,
      uniqueUnitTypePurposeProjects
    );
    setColors(_colors);
  }, [maxContributingProject, uniqueUnitTypePurposeProjects]);

  useEffect(() => {
    const projects = extractAndClassifyProjectData(clusterChildren);
    if (projects) {
      const { maxContributingProject, uniqueProjects } = projects;
      setMaxContributingProject(maxContributingProject);
      setUniqueUnitTypePurposeProjects(uniqueProjects);
    }
  }, [clusterChildren]);

  const { tertiaryProjectColor, secondaryProjectColor, mainProjectColor } =
    colors;

  const clusterMarkerColors = {
    tertiaryProjectColor,
    secondaryProjectColor,
    mainProjectColor,
  };
  const longitude = superclusterResponse.geometry.coordinates[0];
  const latitude = superclusterResponse.geometry.coordinates[1];

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      offset={[0, 0]}
      anchor="bottom"
    >
      <div className={styles.clusterMarkerContainer}>
        <ClusterIcon
          classification={maxContributingProject?.classification}
          purpose={maxContributingProject?.purpose}
          {...clusterMarkerColors}
        />
      </div>
    </Marker>
  );
};

export default DonationClusterMarker;

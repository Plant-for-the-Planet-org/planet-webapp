import { Marker } from 'react-map-gl-v7/maplibre';
import { MutableRefObject, useEffect, useState } from 'react';
import { PointFeature } from 'supercluster';
import { getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';
import ClusterIcon from './ClusterIcon';
import { TreeProjectClassification, UnitTypes } from '@planet-sdk/common';
import {
  getClusterMarkerColors,
  extractAndClassifyProjectData,
} from '../../../../../utils/myForestV2Utils';
import { ViewportProps } from '../../../../common/types/map';
import {
  DonationProperties,
  DonationSuperclusterProperties,
} from '../../../../common/types/myForestv2';
import { ProjectPurpose } from './ProjectTypeIcon';
import style from '../Common/common.module.scss';

export interface ClusterMarkerProps {
  superclusterResponse: PointFeature<DonationSuperclusterProperties>;
  viewport: ViewportProps;
  mapRef: MutableRefObject<null>;
}

export type ExtractedProjectData = {
  unitType: UnitTypes;
  classification: TreeProjectClassification | undefined | null;
  purpose: ProjectPurpose;
  contributionCount: number;
};

const ClusterMarker = ({
  superclusterResponse,
  viewport,
  mapRef,
}: ClusterMarkerProps) => {
  const [clusterChildren, setClusterChildren] = useState<
    PointFeature<DonationProperties>[]
  >([]);
  const { donationGeojson } = useMyForestV2();
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
    if (superclusterResponse && viewport && donationGeojson) {
      const data = getClusterGeojson(
        viewport,
        mapRef,
        donationGeojson,
        superclusterResponse.id
      ) as PointFeature<DonationProperties>[];

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
      <div className={style.clusterMarkerContainer}>
        <ClusterIcon
          classification={maxContributingProject?.classification}
          purpose={maxContributingProject?.purpose}
          {...clusterMarkerColors}
        />
      </div>
    </Marker>
  );
};

export default ClusterMarker;

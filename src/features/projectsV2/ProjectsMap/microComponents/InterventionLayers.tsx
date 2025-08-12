import type {
  Intervention,
  MultiTreeRegistration,
  SingleTreeRegistration,
  SampleTreeRegistration,
} from '../../../common/types/intervention';
import type { Feature, Point, Polygon } from 'geojson';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Layer, Source, Marker } from 'react-map-gl-v7/maplibre';
import * as turf from '@turf/turf';
import styles from '../ProjectsMap.module.scss';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { useProjects } from '../../ProjectsContext';
import { useProjectsMap } from '../../ProjectsMapContext';
import { FillColor } from '../../../../utils/constants/intervention';
import themeProperties from '../../../../theme/themeProperties';
import { MAIN_MAP_LAYERS } from '../../../../utils/projectV2';

interface SampleTreeMarkerProps {
  sampleTree: SampleTreeRegistration;
  selectedSampleIntervention: SampleTreeRegistration | null;
  toggleSampleTree: (
    e: React.MouseEvent<HTMLDivElement>,
    st: SampleTreeRegistration //st sands for sample tree
  ) => void;
}

const { colors } = themeProperties.designSystem;

const SampleTreeMarker = ({
  sampleTree,
  selectedSampleIntervention,
  toggleSampleTree,
}: SampleTreeMarkerProps) => (
  <Marker
    key={`${sampleTree.id}-sample`}
    latitude={sampleTree.geometry.coordinates[1]}
    longitude={sampleTree.geometry.coordinates[0]}
    anchor="center"
  >
    <div
      key={`${sampleTree.id}-marker`}
      className={`${styles.single} ${
        sampleTree.hid === selectedSampleIntervention?.hid
          ? styles.singleSelected
          : ''
      }`}
      role="button"
      tabIndex={0}
      onClick={(e) => toggleSampleTree(e, sampleTree)}
    />
  </Marker>
);

export default function InterventionLayers(): React.ReactElement {
  const {
    interventions,
    hoveredIntervention,
    selectedIntervention,
    setSelectedIntervention,
    setSelectedSampleIntervention,
    selectedSampleIntervention,
    selectedInterventionType,
  } = useProjects();
  const { isSatelliteView, viewState } = useProjectsMap();

  const t = useTranslations('Maps');
  const locale = useLocale();

  const toggleSampleTree = (
    e: React.MouseEvent<HTMLDivElement>,
    tree: SingleTreeRegistration | SampleTreeRegistration
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (selectedSampleIntervention?.hid === tree.hid) {
      setSelectedSampleIntervention(null);
    } else {
      switch (tree.type) {
        case 'sample-tree-registration':
          setSelectedSampleIntervention(tree);
          break;
        case 'single-tree-registration':
          setSelectedIntervention(tree);
          break;
        default:
          break;
      }
    }
  };
  // mt stands for multi-tree registration
  const getTreeCount = (mt: MultiTreeRegistration) => {
    let count = 0;
    if (mt && mt.plantedSpecies) {
      for (const key in mt.plantedSpecies) {
        if (Object.prototype.hasOwnProperty.call(mt.plantedSpecies, key)) {
          const element = mt.plantedSpecies[key];
          count += element.treeCount;
        }
      }
      return count;
    } else {
      return 0;
    }
  };
  const getPlantationArea = (mt: MultiTreeRegistration) => {
    if (mt && mt.type === 'multi-tree-registration') {
      const area = turf.area(mt.geometry);
      return area / 10000;
    } else {
      return 0;
    }
  };

  const getPolygonColor = (mt: MultiTreeRegistration) => {
    const treeCount = getTreeCount(mt);
    const plantationArea = getPlantationArea(mt);
    const density = treeCount / plantationArea;
    if (density > 2500) {
      return 0.5;
    } else if (density > 2000) {
      return 0.4;
    } else if (density > 1600) {
      return 0.3;
    } else if (density > 1000) {
      return 0.2;
    } else {
      return 0.1;
    }
  };

  const getDateDiff = (intervention: Intervention) => {
    if (!intervention.interventionStartDate) {
      return null;
    }
    const today = new Date();
    const plantationDate = new Date(
      intervention.interventionStartDate?.slice(0, 10)
    );
    const differenceInTime = today.getTime() - plantationDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDays < 1) {
      return t('today');
    } else if (differenceInDays < 2) {
      return t('yesterday');
    } else if (differenceInDays <= 10) {
      return t('daysAgo', {
        days: localizedAbbreviatedNumber(locale, differenceInDays, 0),
      });
    } else {
      return null;
    }
  };

  const makeInterventionGeoJson = (
    geometry: Point | Polygon,
    id: string,
    extra?: Record<string, string | number | boolean | null>
  ): Feature<Point | Polygon> => {
    const properties = {
      id,
      ...extra,
    };

    return {
      type: 'Feature',
      properties,
      geometry,
    };
  };
  if (!interventions || interventions.length === 0) {
    return <></>;
  }
  const features = interventions
    .filter(
      (intervention) =>
        selectedInterventionType === 'all' ||
        (selectedInterventionType !== 'default' &&
          intervention.type === selectedInterventionType) ||
        (selectedInterventionType === 'default' &&
          (intervention.type === 'multi-tree-registration' ||
            intervention.type === 'single-tree-registration'))
    )
    .map((intervention) => {
      const isSelected =
        selectedIntervention && selectedIntervention.id === intervention.id;
      const isHovered =
        hoveredIntervention && hoveredIntervention.id === intervention.id;
      const GeoJSON = makeInterventionGeoJson(
        intervention.geometry,
        intervention.id,
        {
          highlightLine: isSelected || isHovered,
          opacity:
            intervention.type === 'multi-tree-registration'
              ? getPolygonColor(intervention)
              : 0.5,
          dateDiff: getDateDiff(intervention),
          type: intervention.type,
        }
      );
      return GeoJSON;
    });

  const isValidInterventionType = [
    'multi-tree-registration',
    'enrichment-planting',
    'all',
    'default',
  ].includes(selectedInterventionType);

  const shouldRenderMarkers =
    selectedIntervention &&
    selectedIntervention.type !== 'single-tree-registration' &&
    isValidInterventionType &&
    viewState.zoom > 14 &&
    selectedIntervention.sampleInterventions;

  return (
    <>
      <Source
        id={'display-source'}
        type="geojson"
        data={{
          type: 'FeatureCollection',
          features: [...features],
        }}
      >
        <Layer
          id={MAIN_MAP_LAYERS.PLANT_POLYGON}
          type="fill"
          paint={{
            'fill-color': FillColor,
            'fill-opacity': ['get', 'opacity'],
          }}
          filter={['==', ['geometry-type'], 'Polygon']}
        />
        <Layer
          id={MAIN_MAP_LAYERS.PLANT_POINT}
          type="circle"
          paint={{
            'circle-color': FillColor,
            'circle-opacity': [
              'case',
              [
                '==',
                ['get', 'id'],
                (selectedIntervention?.id || hoveredIntervention?.id) ?? 0,
              ],
              1,
              0.5,
            ],
          }}
          filter={['==', ['geometry-type'], 'Point']}
        />
        <Layer
          id={MAIN_MAP_LAYERS.SELECTED_LINE}
          type="line"
          paint={{
            'line-color': isSatelliteView ? colors.white : FillColor,
            'line-width': 4,
          }}
          filter={['==', ['get', 'highlightLine'], true]}
        />
        <Layer
          id={MAIN_MAP_LAYERS.DATE_DIFF_LABEL}
          type="symbol"
          layout={{
            'text-field': ['get', 'dateDiff'],
            'text-anchor': 'center',
            'text-font': ['Ubuntu Regular'],
          }}
          paint={{
            'text-color': isSatelliteView ? colors.white : colors.coreText,
          }}
          filter={['!=', ['get', 'dateDiff'], '']}
        />
        {shouldRenderMarkers
          ? selectedIntervention.sampleInterventions.map((sampleTree) => (
              <SampleTreeMarker
                key={sampleTree.id}
                sampleTree={sampleTree}
                selectedSampleIntervention={selectedSampleIntervention}
                toggleSampleTree={toggleSampleTree}
              />
            ))
          : null}
      </Source>
    </>
  );
}

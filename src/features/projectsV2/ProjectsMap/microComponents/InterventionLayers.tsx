import type { ReactElement, MouseEvent } from 'react';
import type {
  Intervention,
  MultiTreeRegistration,
  SampleTreeRegistration,
} from '@planet-sdk/common';
import type {
  InterventionFeature,
  InterventionGeometryType,
  InterventionProperties,
} from '../../../common/types/map';

import { memo, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Layer, Source, Marker } from 'react-map-gl/maplibre';
import area from '@turf/area';
import styles from '../ProjectsMap.module.scss';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { FillColor } from '../../../../utils/constants/intervention';
import themeProperties from '../../../../theme/themeProperties';
import { MAIN_MAP_LAYERS } from '../../../../utils/projectV2';
import { clsx } from 'clsx';
import { useProjectMapStore, useInterventionStore } from '../../../../stores';

interface SampleInterventionMarkerProps {
  sampleIntervention: SampleTreeRegistration;
  selectedSampleIntervention: SampleTreeRegistration | null;
  togglePointIntervention: (
    e: MouseEvent<HTMLDivElement>,
    sampleIntervention: SampleTreeRegistration
  ) => void;
}

const { colors } = themeProperties.designSystem;
/**
 * Guards against a single corrupt record poisoning the whole map. Maplibre
 * validates the entire FeatureCollection as one unit, so one feature with a
 * null/invalid geometry makes it reject every feature ("Input data is not a
 * valid GeoJSON object"). We drop interventions whose geometry is not a
 * structurally usable Point/Polygon before building features.
 */
const hasRenderableGeometry = (intervention: Intervention): boolean => {
  const geometry = intervention.geometry;
  if (!geometry || typeof geometry !== 'object') return false;
  if (typeof geometry.type !== 'string') return false;
  return Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0;
};

const getTreeCount = (multiTree: MultiTreeRegistration) => {
  let count = 0;
  if (multiTree && multiTree.plantedSpecies) {
    for (const key in multiTree.plantedSpecies) {
      if (Object.prototype.hasOwnProperty.call(multiTree.plantedSpecies, key)) {
        const element = multiTree.plantedSpecies[key];
        count += element.treeCount;
      }
    }
    return count;
  } else {
    return 0;
  }
};

const getPlantationArea = (multiTree: MultiTreeRegistration) => {
  if (multiTree && multiTree.type === 'multi-tree-registration') {
    const polygonAreaSqMeters = area(multiTree.geometry);
    return typeof polygonAreaSqMeters === 'number'
      ? polygonAreaSqMeters / 10000
      : 0;
  } else {
    return 0;
  }
};

const getPolygonColor = (multiTree: MultiTreeRegistration) => {
  const treeCount = getTreeCount(multiTree);
  const plantationArea = getPlantationArea(multiTree);
  const density = plantationArea > 0 ? treeCount / plantationArea : 0;
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

const getDateDiff = (
  intervention: Intervention,
  t: ReturnType<typeof useTranslations<'Maps'>>,
  locale: string
) => {
  const plantDate =
    intervention.interventionStartDate ?? intervention.plantDate;
  if (!plantDate) return '';

  const today = new Date();
  const plantationDate = new Date(plantDate.slice(0, 10));
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
    return '';
  }
};

const makeInterventionGeoJson = (
  geometry: InterventionGeometryType,
  id: string,
  extra?: Partial<Omit<InterventionProperties, 'id'>>
): InterventionFeature => {
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

const SampleInterventionMarker = ({
  sampleIntervention,
  selectedSampleIntervention,
  togglePointIntervention,
}: SampleInterventionMarkerProps) => (
  <Marker
    key={`${sampleIntervention.id}-sample`}
    latitude={sampleIntervention.geometry.coordinates[1]}
    longitude={sampleIntervention.geometry.coordinates[0]}
    anchor="center"
  >
    <div
      key={`${sampleIntervention.id}-marker`}
      className={clsx(styles.single, {
        [styles.singleSelected]:
          sampleIntervention.hid === selectedSampleIntervention?.hid,
      })}
      role="button"
      tabIndex={0}
      onClick={(e) => togglePointIntervention(e, sampleIntervention)}
    />
  </Marker>
);

function InterventionLayers(): ReactElement {
  // store: state
  const interventions = useInterventionStore((state) => state.interventions);
  const hoveredIntervention = useInterventionStore(
    (state) => state.hoveredIntervention
  );
  const selectedIntervention = useInterventionStore(
    (state) => state.selectedIntervention
  );
  const selectedInterventionType = useInterventionStore(
    (state) => state.selectedInterventionType
  );
  const selectedSampleIntervention = useInterventionStore(
    (state) => state.selectedSampleIntervention
  );
  const isSatelliteView = useProjectMapStore((state) => state.isSatelliteView);
  // A boolean, so panning and zooming only re-render this when the zoom crosses 14.
  const isZoomedIn = useProjectMapStore((state) => state.viewState.zoom > 14);
  // store: action
  const setSelectedSampleIntervention = useInterventionStore(
    (state) => state.setSelectedSampleIntervention
  );

  const t = useTranslations('Maps');
  const locale = useLocale();

  const togglePointIntervention = (
    e: MouseEvent<HTMLDivElement>,
    tree: SampleTreeRegistration
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
        default:
          break;
      }
    }
  };

  // Depends only on the data, so area() and the date diff do not run again when the type filter changes.
  const renderableFeatures = useMemo(
    () =>
      (interventions ?? []).filter(hasRenderableGeometry).map((intervention) =>
        makeInterventionGeoJson(intervention.geometry, intervention.id, {
          opacity:
            intervention.type === 'multi-tree-registration'
              ? getPolygonColor(intervention)
              : 0.5,
          dateDiff: getDateDiff(intervention, t, locale),
          type: intervention.type,
        })
      ),
    [interventions, t, locale]
  );

  // Passing the same object lets react-map-gl skip its deep compare of `data`.
  const featureCollection = useMemo(() => {
    const features = renderableFeatures.filter(
      ({ properties: { type } }) =>
        selectedInterventionType === 'all' ||
        (selectedInterventionType !== 'default' &&
          type === selectedInterventionType) ||
        (selectedInterventionType === 'default' &&
          (type === 'multi-tree-registration' ||
            type === 'single-tree-registration'))
    );
    return { type: 'FeatureCollection' as const, features };
  }, [renderableFeatures, selectedInterventionType]);

  // Kept in its own small source so a hover change only resends these features, not the whole project.
  const highlightCollection = useMemo(() => {
    const highlightedIds = [selectedIntervention?.id, hoveredIntervention?.id];
    const features = featureCollection.features.filter((feature) =>
      highlightedIds.includes(feature.properties.id)
    );
    return { type: 'FeatureCollection' as const, features };
  }, [featureCollection, selectedIntervention, hoveredIntervention]);

  if (!interventions || interventions.length === 0) {
    return <></>;
  }

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
    isZoomedIn &&
    selectedIntervention.sampleInterventions;

  return (
    <>
      <Source id={'display-source'} type="geojson" data={featureCollection}>
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
      </Source>
      <Source id={'highlight-source'} type="geojson" data={highlightCollection}>
        <Layer
          id={MAIN_MAP_LAYERS.SELECTED_LINE}
          type="line"
          paint={{
            'line-color': isSatelliteView ? colors.white : FillColor,
            'line-width': 4,
          }}
        />
      </Source>
      {/* Placed after the highlight source so the label stays drawn above the highlight line, as before. */}
      <Layer
        id={MAIN_MAP_LAYERS.DATE_DIFF_LABEL}
        source="display-source"
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
        ? selectedIntervention.sampleInterventions.map((sampleIntervention) => (
            <SampleInterventionMarker
              key={sampleIntervention.id}
              sampleIntervention={sampleIntervention}
              selectedSampleIntervention={selectedSampleIntervention}
              togglePointIntervention={togglePointIntervention}
            />
          ))
        : null}
    </>
  );
}

export default memo(InterventionLayers);

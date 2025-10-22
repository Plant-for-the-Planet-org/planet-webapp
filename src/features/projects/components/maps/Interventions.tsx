import type { ReactElement } from 'react';
import type {
  Intervention,
  MultiTreeRegistration,
  SampleTreeRegistration,
  SingleTreeRegistration,
} from '@planet-sdk/common';
import type {
  InterventionFeature,
  InterventionGeometryType,
  InterventionProperties,
} from '../../../common/types/map';

import { Layer, Marker } from 'react-map-gl';
import { Source } from 'react-map-gl';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import styles from '../../styles/Intervention.module.scss';
import area from '@turf/area';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { useLocale, useTranslations } from 'next-intl';

export default function Interventions(): ReactElement {
  const {
    interventions,
    hoveredPl,
    selectedPl,
    setSelectedPl,
    setHoveredPl,
    viewport,
    satellite,
    setSampleIntervention,
    sampleIntervention,
  } = useProjectProps();

  const t = useTranslations('Maps');
  const locale = useLocale();

  const openPl = (pl: SingleTreeRegistration | SampleTreeRegistration) => {
    switch (pl.type) {
      case 'sample-tree-registration':
        setSampleIntervention(pl);
        break;
      case 'single-tree-registration':
        setSelectedPl(pl);
        break;
      default:
        break;
    }
  };

  const onHover = (pl: SingleTreeRegistration | SampleTreeRegistration) => {
    setHoveredPl(pl);
  };

  const onHoverEnd = () => {
    if (
      hoveredPl &&
      (hoveredPl.type === 'single-tree-registration' ||
        hoveredPl.type === 'sample-tree-registration')
    )
      setHoveredPl(null);
  };

  const getPlTreeCount = (pl: MultiTreeRegistration) => {
    let count = 0;
    if (pl && pl.plantedSpecies) {
      for (const key in pl.plantedSpecies) {
        if (Object.prototype.hasOwnProperty.call(pl.plantedSpecies, key)) {
          const element = pl.plantedSpecies[key];
          count += element.treeCount;
        }
      }
      return count;
    } else {
      return 0;
    }
  };

  const getPlArea = (pl: MultiTreeRegistration) => {
    if (pl && pl.type === 'multi-tree-registration') {
      const calculatedArea = area(pl.geometry);
      return calculatedArea > 0 ? calculatedArea / 10000 : 0;
    } else {
      return 0;
    }
  };

  const getPolygonColor = (pl: MultiTreeRegistration) => {
    const treeCount = getPlTreeCount(pl);
    const plantationArea = getPlArea(pl);
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

  const getDateDiff = (pl: Intervention) => {
    const today = new Date();
    const plantationDate = new Date(pl.plantDate?.substr(0, 10));
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

  if (!interventions) {
    return <></>;
  }

  const features = interventions.map((el) => {
    const isSelected = selectedPl !== null && selectedPl.id === el.id;
    const isHovered = hoveredPl !== null && hoveredPl.id === el.id;
    const GeoJSON = makeInterventionGeoJson(el.geometry, el.id, {
      highlightLine: isSelected || isHovered,
      opacity:
        el.type === 'multi-tree-registration' ? getPolygonColor(el) : 0.5,
      dateDiff: getDateDiff(el) ?? '',
    });
    return GeoJSON;
  });

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
          id={`polygon-layer`}
          type="fill"
          paint={{
            'fill-color': satellite ? '#ffffff' : '#007A49',
            'fill-opacity': ['get', 'opacity'],
          }}
          filter={['==', ['geometry-type'], 'Polygon']}
        />
        <Layer
          id={`point-layer`}
          type="circle"
          paint={{
            'circle-color': satellite ? '#ffffff' : '#007A49',
            'circle-opacity': 0.5,
          }}
          filter={['==', ['geometry-type'], 'Point']}
        />
        <Layer
          id={`line-selected`}
          type="line"
          paint={{
            'line-color': satellite ? '#ffffff' : '#007A49',
            'line-width': 4,
          }}
          filter={['==', ['get', 'highlightLine'], true]}
        />
        <Layer
          id={`datediff-label`}
          type="symbol"
          layout={{
            'text-field': ['get', 'dateDiff'],
            'text-anchor': 'center',
            'text-font': ['Ubuntu Regular'],
          }}
          paint={{
            'text-color': satellite ? '#ffffff' : '#2f3336',
          }}
          filter={['!=', ['get', 'dateDiff'], null]}
        />
        {selectedPl &&
        selectedPl.type === 'multi-tree-registration' &&
        selectedPl.sampleInterventions
          ? selectedPl.sampleInterventions.map((spl) => {
              return (
                <Marker
                  key={`${spl.id}-sample`}
                  latitude={spl.geometry.coordinates[1]}
                  longitude={spl.geometry.coordinates[0]}
                >
                  {viewport.zoom > 14 && (
                    <div
                      key={`${spl.id}-marker`}
                      className={`${styles.single} ${
                        spl.hid === sampleIntervention?.hid
                          ? styles.singleSelected
                          : ''
                      }`}
                      role="button"
                      tabIndex={0}
                      onClick={() => openPl(spl)}
                      onMouseEnter={() => onHover(spl)}
                      onMouseLeave={onHoverEnd}
                    />
                  )}
                </Marker>
              );
            })
          : null}
      </Source>
    </>
  );
}

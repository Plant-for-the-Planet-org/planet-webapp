import type { ReactElement } from 'react';
import type { TimeTravelConfig } from '../../../../utils/mapsV2/timeTravel';
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import type { ProjectSite } from '@planet-sdk/common/build/types/project';

import { useEffect, useRef, useState } from 'react';
import MaplibreCompare from '@maplibre/maplibre-gl-compare';
import '@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css';
import { Map } from 'maplibre-gl';
import { useProjectsMap } from '../../ProjectsMapContext';
import { getTimeTravelConfig } from '../../../../utils/mapsV2/timeTravel';
import styles from './TimeTravel.module.scss';

const EMPTY_STYLE = {
  version: 8 as const,
  sources: {},
  layers: [],
};

interface Props {
  sitesGeoJson: FeatureCollection<Polygon | MultiPolygon, ProjectSite>;
}

export default function TimeTravel({ sitesGeoJson }: Props): ReactElement {
  const { viewState: mainMapViewState } = useProjectsMap();
  console.log('mainMapViewState');
  console.log('latitude: ', mainMapViewState.latitude);
  console.log('longitude: ', mainMapViewState.longitude);
  console.log('zoom: ', mainMapViewState.zoom);
  const comparisonContainer = useRef<HTMLDivElement>(null);
  const beforeContainer = useRef<HTMLDivElement>(null);
  const afterContainer = useRef<HTMLDivElement>(null);

  const beforeMapRef = useRef<Map | null>(null);
  const afterMapRef = useRef<Map | null>(null);
  const compareRef = useRef<MaplibreCompare | null>(null);

  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);

  // Currently hardcoded to ESRI and 2014/2021
  const [selectedSource1, _setSelectedSource1] =
    useState<keyof TimeTravelConfig>('esri');
  const [selectedSource2, _setSelectedSource2] =
    useState<keyof TimeTravelConfig>('esri');
  const [selectedYear1, _setSelectedYear1] = useState('2017');
  const [selectedYear2, _setSelectedYear2] = useState('2019');

  // Initialize the side by side comparison map
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const before = new Map({
        container: beforeContainer.current || '',
        style: EMPTY_STYLE,
        center: [mainMapViewState.longitude, mainMapViewState.latitude],
        zoom: mainMapViewState.zoom,
        dragPan: true,
        scrollZoom: false,
        attributionControl: false,
      });

      before.on('load', () => {
        beforeMapRef.current = before;
        setBeforeLoaded(true);
      });

      const after = new Map({
        container: afterContainer.current || '',
        style: EMPTY_STYLE,
        center: [mainMapViewState.longitude, mainMapViewState.latitude],
        zoom: mainMapViewState.zoom,
        dragPan: true,
        scrollZoom: false,
        attributionControl: false,
      });

      after.on('load', () => {
        afterMapRef.current = after;
        setAfterLoaded(true);
      });
    }

    // Cleanup function
    return () => {
      if (beforeMapRef.current) {
        beforeMapRef.current.remove();
      }
      if (afterMapRef.current) {
        afterMapRef.current.remove();
      }
      if (compareRef.current) {
        compareRef.current.remove();
      }
    };
  }, []);

  // Initialize comparison only when both maps are loaded
  useEffect(() => {
    if (
      beforeLoaded &&
      afterLoaded &&
      beforeMapRef.current &&
      afterMapRef.current
    ) {
      compareRef.current = new MaplibreCompare(
        beforeMapRef.current,
        afterMapRef.current,
        comparisonContainer.current || '',
        {
          mousemove: false,
          orientation: 'vertical',
        }
      );
    }
  }, [beforeLoaded, afterLoaded]);

  // load map layers
  useEffect(() => {
    function loadLayers() {
      const data = getTimeTravelConfig();
      const before = beforeMapRef.current;
      const after = afterMapRef.current;

      // ESRI
      if (data.esri !== undefined && before && after) {
        if (selectedSource1 === 'esri') {
          data.esri.map((year) => {
            if (year.year === selectedYear1) {
              if (!before.getSource(`before-imagery-esri-${year.year}`)) {
                before.addSource(`before-imagery-esri-${year.year}`, {
                  type: 'raster',
                  tiles: [`${year.raster}`],
                  tileSize: 256,
                  attribution: 'layer attribution',
                });
              }
              if (!before.getLayer(`before-imagery-esri-${year.year}-layer`)) {
                before.addLayer({
                  id: `before-imagery-esri-${year.year}-layer`,
                  type: 'raster',
                  source: `before-imagery-esri-${year.year}`,
                });
              }

              if (!before.getSource(`project-polygon-esri-${year.year}`)) {
                before.addSource(`project-polygon-esri-${year.year}`, {
                  type: 'geojson',
                  data: sitesGeoJson || undefined,
                });
              }

              if (!before.getLayer(`project-polygon-layer-esri-${year.year}`)) {
                before.addLayer({
                  id: `project-polygon-layer-esri-${year.year}`,
                  type: 'line',
                  source: `project-polygon-esri-${year.year}`,
                  layout: {},
                  paint: {
                    'line-color': '#fff',
                    'line-width': 4,
                  },
                });
              }
            } else {
              if (before.getLayer(`project-polygon-layer-esri-${year.year}`)) {
                before.removeLayer(`project-polygon-layer-esri-${year.year}`);
              }
              if (before.getLayer(`before-imagery-esri-${year.year}-layer`)) {
                before.removeLayer(`before-imagery-esri-${year.year}-layer`);
              }
            }
          });
        } else {
          data.esri.map((year) => {
            if (before.getLayer(`project-polygon-layer-esri-${year.year}`)) {
              before.removeLayer(`project-polygon-layer-esri-${year.year}`);
            }
            if (before.getLayer(`before-imagery-esri-${year.year}-layer`)) {
              before.removeLayer(`before-imagery-esri-${year.year}-layer`);
            }
          });
        }

        if (selectedSource2 === 'esri') {
          data.esri.map((year) => {
            if (year.year === selectedYear2) {
              if (!after.getSource(`after-imagery-esri-${year.year}`)) {
                after.addSource(`after-imagery-esri-${year.year}`, {
                  type: 'raster',
                  tiles: [`${year.raster}`],
                  tileSize: 256,
                  attribution: 'layer attribution',
                });
              }
              if (!after.getLayer(`after-imagery-esri-${year.year}-layer`)) {
                after.addLayer({
                  id: `after-imagery-esri-${year.year}-layer`,
                  type: 'raster',
                  source: `after-imagery-esri-${year.year}`,
                });
              }

              if (!after.getSource(`project-polygon-esri-${year.year}`)) {
                after.addSource(`project-polygon-esri-${year.year}`, {
                  type: 'geojson',
                  data: sitesGeoJson || undefined,
                });
              }

              if (!after.getLayer(`project-polygon-layer-esri-${year.year}`)) {
                after.addLayer({
                  id: `project-polygon-layer-esri-${year.year}`,
                  type: 'line',
                  source: `project-polygon-esri-${year.year}`,
                  layout: {},
                  paint: {
                    'line-color': '#fff',
                    'line-width': 4,
                  },
                });
              }
            } else {
              if (after.getLayer(`project-polygon-layer-esri-${year.year}`)) {
                after.removeLayer(`project-polygon-layer-esri-${year.year}`);
              }
              if (after.getLayer(`after-imagery-esri-${year.year}-layer`)) {
                after.removeLayer(`after-imagery-esri-${year.year}-layer`);
              }
            }
          });
        } else {
          data.esri.map((year) => {
            if (after.getLayer(`project-polygon-layer-esri-${year.year}`)) {
              after.removeLayer(`project-polygon-layer-esri-${year.year}`);
            }
            if (after.getLayer(`after-imagery-esri-${year.year}-layer`)) {
              after.removeLayer(`after-imagery-esri-${year.year}-layer`);
            }
          });
        }
      }
    }

    if (beforeMapRef.current && afterMapRef.current) {
      try {
        setTimeout(function () {
          loadLayers();
        }, 1000);
      } catch (e) {
        console.log('Error adding layer', e);
      }
    }
  }, [
    beforeLoaded,
    afterLoaded,
    selectedSource1,
    selectedSource2,
    selectedYear1,
    selectedYear2,
    sitesGeoJson,
  ]);

  return (
    <div
      id="comparison-container"
      ref={comparisonContainer}
      className={styles.comparisonContainer}
    >
      <div
        id="before"
        ref={beforeContainer}
        className={styles.comparisonMap}
      ></div>
      <div
        id="after"
        ref={afterContainer}
        className={styles.comparisonMap}
      ></div>
    </div>
  );
}

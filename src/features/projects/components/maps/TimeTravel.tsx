import type { ReactElement } from 'react';
import type { Map } from 'mapbox-gl';
import type { Imagery } from '../../../common/types/ProjectPropsContextInterface';

import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxCompare from 'mapbox-gl-compare';
import ImageDropdown from './ImageDropdown';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import ZoomButtons from './ZoomButtons';

export default function TimeTravel(): ReactElement {
  const { mapRef, geoJson, rasterData, isMobile, siteViewPort, selectedMode } =
    useProjectProps();

  const [before, setBefore] = useState<Map>();
  const [after, setAfter] = useState<Map>();
  const [selectedSource1, setSelectedSource1] = useState<keyof Imagery>('esri');
  const [selectedSource2, setSelectedSource2] = useState<keyof Imagery>('esri');
  const [selectedYear1, setSelectedYear1] = useState('2014');
  const [selectedYear2, setSelectedYear2] = useState('2021');

  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      const center = mapRef.current.getMap().getCenter();
      const zoom = mapRef.current.getMap().getZoom();
      const before = new mapboxgl.Map({
        container: 'before', // Container ID
        style: EMPTY_STYLE,
        center: center,
        zoom: zoom,
        dragPan: true,
        scrollZoom: false,
      });

      before.on('load', () => {
        setBefore(before);
      });

      const after = new mapboxgl.Map({
        container: 'after', // Container ID
        style: EMPTY_STYLE,
        center: center,
        zoom: zoom,
        dragPan: true,
        scrollZoom: false,
      });

      after.on('load', () => {
        setAfter(after);
      });

      // Add zoom and rotation controls to the map.
      // before.addControl(
      //   new mapboxgl.NavigationControl({ showCompass: false }),
      //   'bottom-right'
      // );
      // after.addControl(
      //   new mapboxgl.NavigationControl({ showCompass: false }),
      //   'bottom-right'
      // );

      // A selector or reference to HTML element
      const container = '#comparison-container';

      const _compare = new MapboxCompare(before, after, container, {
        mousemove: false, // Optional. Set to true to enable swiping during cursor movement.
        orientation: 'vertical', // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
      });

      // syncMove(before, mapRef?.current?.getMap());
    }
  }, []);

  useEffect(() => {
    if (before && siteViewPort) {
      before.setCenter(siteViewPort.center);
      before.setZoom(siteViewPort.zoom);
    }
  }, [selectedMode, geoJson]);

  useEffect(() => {
    function loadLayers() {
      // Planet Labs
      if (before && after) {
        if (rasterData.imagery.planetLabs !== undefined) {
          if (selectedSource1 === 'planetLabs') {
            rasterData.imagery.planetLabs.map((year) => {
              if (year.year === selectedYear1) {
                if (!before.getSource(`before-imagery-planet-${year.year}`)) {
                  before.addSource(`before-imagery-planet-${year.year}`, {
                    type: 'raster',
                    tiles: [`${year.raster}`],
                    tileSize: 256,
                    attribution: 'layer attribution',
                  });
                }
                if (
                  !before.getLayer(`before-imagery-planet-${year.year}-layer`)
                ) {
                  before.addLayer({
                    id: `before-imagery-planet-${year.year}-layer`,
                    type: 'raster',
                    source: `before-imagery-planet-${year.year}`,
                  });
                }

                if (!before.getSource(`project-polygon-planet-${year.year}`)) {
                  before.addSource(`project-polygon-planet-${year.year}`, {
                    type: 'geojson',
                    data: geoJson || undefined || undefined,
                  });
                }

                if (
                  !before.getLayer(`project-polygon-layer-planet-${year.year}`)
                ) {
                  before.addLayer({
                    id: `project-polygon-layer-planet-${year.year}`,
                    type: 'line',
                    source: `project-polygon-planet-${year.year}`,
                    layout: {},
                    paint: {
                      'line-color': '#fff',
                      'line-width': 4,
                    },
                  });
                }
              } else {
                if (
                  before.getLayer(`project-polygon-layer-planet-${year.year}`)
                ) {
                  before.removeLayer(
                    `project-polygon-layer-planet-${year.year}`
                  );
                }
                if (
                  before.getLayer(`before-imagery-planet-${year.year}-layer`)
                ) {
                  before.removeLayer(
                    `before-imagery-planet-${year.year}-layer`
                  );
                }
              }
            });
          } else {
            rasterData.imagery.planetLabs.map((year) => {
              if (
                before.getLayer(`project-polygon-layer-planet-${year.year}`)
              ) {
                before.removeLayer(`project-polygon-layer-planet-${year.year}`);
              }
              if (before.getLayer(`before-imagery-planet-${year.year}-layer`)) {
                before.removeLayer(`before-imagery-planet-${year.year}-layer`);
              }
            });
          }

          if (selectedSource2 === 'planetLabs') {
            rasterData.imagery.planetLabs.map((year) => {
              if (year.year === selectedYear2) {
                if (!after.getSource(`after-imagery-planet-${year.year}`)) {
                  after.addSource(`after-imagery-planet-${year.year}`, {
                    type: 'raster',
                    tiles: [`${year.raster}`],
                    tileSize: 256,
                    attribution: 'layer attribution',
                  });
                }
                if (
                  !after.getLayer(`after-imagery-planet-${year.year}-layer`)
                ) {
                  after.addLayer({
                    id: `after-imagery-planet-${year.year}-layer`,
                    type: 'raster',
                    source: `after-imagery-planet-${year.year}`,
                  });
                }

                if (!after.getSource(`project-polygon-planet-${year.year}`)) {
                  after.addSource(`project-polygon-planet-${year.year}`, {
                    type: 'geojson',
                    data: geoJson || undefined,
                  });
                }

                if (
                  !after.getLayer(`project-polygon-layer-planet-${year.year}`)
                ) {
                  after.addLayer({
                    id: `project-polygon-layer-planet-${year.year}`,
                    type: 'line',
                    source: `project-polygon-planet-${year.year}`,
                    layout: {},
                    paint: {
                      'line-color': '#fff',
                      'line-width': 4,
                    },
                  });
                }
              } else {
                if (
                  after.getLayer(`project-polygon-layer-planet-${year.year}`)
                ) {
                  after.removeLayer(
                    `project-polygon-layer-planet-${year.year}`
                  );
                }
                if (after.getLayer(`after-imagery-planet-${year.year}-layer`)) {
                  after.removeLayer(`after-imagery-planet-${year.year}-layer`);
                }
              }
            });
          } else {
            rasterData.imagery.planetLabs.map((year) => {
              if (after.getLayer(`project-polygon-layer-planet-${year.year}`)) {
                after.removeLayer(`project-polygon-layer-planet-${year.year}`);
              }
              if (after.getLayer(`after-imagery-planet-${year.year}-layer`)) {
                after.removeLayer(`after-imagery-planet-${year.year}-layer`);
              }
            });
          }
        }

        // Sentinel
        if (rasterData.imagery.sentinel !== undefined) {
          if (selectedSource1 === 'sentinel') {
            rasterData.imagery.sentinel.map((year) => {
              if (year.year === selectedYear1) {
                if (!before.getSource(`before-imagery-sentinel-${year.year}`)) {
                  before.addSource(`before-imagery-sentinel-${year.year}`, {
                    type: 'raster',
                    tiles: [`${year.raster}`],
                    tileSize: 256,
                    attribution: 'layer attribution',
                  });
                }
                if (
                  !before.getLayer(`before-imagery-sentinel-${year.year}-layer`)
                ) {
                  before.addLayer({
                    id: `before-imagery-sentinel-${year.year}-layer`,
                    type: 'raster',
                    source: `before-imagery-sentinel-${year.year}`,
                  });
                }

                if (
                  !before.getSource(`project-polygon-sentinel-${year.year}`)
                ) {
                  before.addSource(`project-polygon-sentinel-${year.year}`, {
                    type: 'geojson',
                    data: geoJson || undefined,
                  });
                }

                if (
                  !before.getLayer(
                    `project-polygon-layer-sentinel-${year.year}`
                  )
                ) {
                  before.addLayer({
                    id: `project-polygon-layer-sentinel-${year.year}`,
                    type: 'line',
                    source: `project-polygon-sentinel-${year.year}`,
                    layout: {},
                    paint: {
                      'line-color': '#fff',
                      'line-width': 4,
                    },
                  });
                }
              } else {
                if (
                  before.getLayer(`project-polygon-layer-sentinel-${year.year}`)
                ) {
                  before.removeLayer(
                    `project-polygon-layer-sentinel-${year.year}`
                  );
                }
                if (
                  before.getLayer(`before-imagery-sentinel-${year.year}-layer`)
                ) {
                  before.removeLayer(
                    `before-imagery-sentinel-${year.year}-layer`
                  );
                }
              }
            });
          } else {
            rasterData.imagery.sentinel.map((year) => {
              if (
                before.getLayer(`project-polygon-layer-sentinel-${year.year}`)
              ) {
                before.removeLayer(
                  `project-polygon-layer-sentinel-${year.year}`
                );
              }
              if (
                before.getLayer(`before-imagery-sentinel-${year.year}-layer`)
              ) {
                before.removeLayer(
                  `before-imagery-sentinel-${year.year}-layer`
                );
              }
            });
          }

          if (selectedSource2 === 'sentinel') {
            rasterData.imagery.sentinel.map((year) => {
              if (year.year === selectedYear2) {
                if (!after.getSource(`after-imagery-sentinel-${year.year}`)) {
                  after.addSource(`after-imagery-sentinel-${year.year}`, {
                    type: 'raster',
                    tiles: [`${year.raster}`],
                    tileSize: 256,
                    attribution: 'layer attribution',
                  });
                }
                if (
                  !after.getLayer(`after-imagery-sentinel-${year.year}-layer`)
                ) {
                  after.addLayer({
                    id: `after-imagery-sentinel-${year.year}-layer`,
                    type: 'raster',
                    source: `after-imagery-sentinel-${year.year}`,
                  });
                }

                if (!after.getSource(`project-polygon-sentinel-${year.year}`)) {
                  after.addSource(`project-polygon-sentinel-${year.year}`, {
                    type: 'geojson',
                    data: geoJson || undefined,
                  });
                }

                if (
                  !after.getLayer(`project-polygon-layer-sentinel-${year.year}`)
                ) {
                  after.addLayer({
                    id: `project-polygon-layer-sentinel-${year.year}`,
                    type: 'line',
                    source: `project-polygon-sentinel-${year.year}`,
                    layout: {},
                    paint: {
                      'line-color': '#fff',
                      'line-width': 4,
                    },
                  });
                }
              } else {
                if (
                  after.getLayer(`project-polygon-layer-sentinel-${year.year}`)
                ) {
                  after.removeLayer(
                    `project-polygon-layer-sentinel-${year.year}`
                  );
                }
                if (
                  after.getLayer(`after-imagery-sentinel-${year.year}-layer`)
                ) {
                  after.removeLayer(
                    `after-imagery-sentinel-${year.year}-layer`
                  );
                }
              }
            });
          } else {
            rasterData.imagery.sentinel.map((year) => {
              if (
                after.getLayer(`project-polygon-layer-sentinel-${year.year}`)
              ) {
                after.removeLayer(
                  `project-polygon-layer-sentinel-${year.year}`
                );
              }
              if (after.getLayer(`after-imagery-sentinel-${year.year}-layer`)) {
                after.removeLayer(`after-imagery-sentinel-${year.year}-layer`);
              }
            });
          }
        }

        // Landsat
        if (rasterData.imagery.landsat !== undefined) {
          if (selectedSource1 === 'landsat') {
            rasterData.imagery.landsat.map((year) => {
              if (year.year === selectedYear1) {
                if (!before.getSource(`before-imagery-landsat-${year.year}`)) {
                  before.addSource(`before-imagery-landsat-${year.year}`, {
                    type: 'raster',
                    tiles: [`${year.raster}`],
                    tileSize: 256,
                    attribution: 'layer attribution',
                  });
                }
                if (
                  !before.getLayer(`before-imagery-landsat-${year.year}-layer`)
                ) {
                  before.addLayer({
                    id: `before-imagery-landsat-${year.year}-layer`,
                    type: 'raster',
                    source: `before-imagery-landsat-${year.year}`,
                  });
                }

                if (!before.getSource(`project-polygon-landsat-${year.year}`)) {
                  before.addSource(`project-polygon-landsat-${year.year}`, {
                    type: 'geojson',
                    data: geoJson || undefined,
                  });
                }

                if (
                  !before.getLayer(`project-polygon-layer-landsat-${year.year}`)
                ) {
                  before.addLayer({
                    id: `project-polygon-layer-landsat-${year.year}`,
                    type: 'line',
                    source: `project-polygon-landsat-${year.year}`,
                    layout: {},
                    paint: {
                      'line-color': '#fff',
                      'line-width': 4,
                    },
                  });
                }
              } else {
                if (
                  before.getLayer(`project-polygon-layer-landsat-${year.year}`)
                ) {
                  before.removeLayer(
                    `project-polygon-layer-landsat-${year.year}`
                  );
                }
                if (
                  before.getLayer(`before-imagery-landsat-${year.year}-layer`)
                ) {
                  before.removeLayer(
                    `before-imagery-landsat-${year.year}-layer`
                  );
                }
              }
            });
          } else {
            rasterData.imagery.landsat.map((year) => {
              if (
                before.getLayer(`project-polygon-layer-landsat-${year.year}`)
              ) {
                before.removeLayer(
                  `project-polygon-layer-landsat-${year.year}`
                );
              }
              if (
                before.getLayer(`before-imagery-landsat-${year.year}-layer`)
              ) {
                before.removeLayer(`before-imagery-landsat-${year.year}-layer`);
              }
            });
          }

          if (selectedSource2 === 'landsat') {
            rasterData.imagery.landsat.map((year) => {
              if (year.year === selectedYear2) {
                if (!after.getSource(`after-imagery-${year.year}`)) {
                  after.addSource(`after-imagery-${year.year}`, {
                    type: 'raster',
                    tiles: [`${year.raster}`],
                    tileSize: 256,
                    attribution: 'layer attribution',
                  });
                }
                if (!after.getLayer(`after-imagery-${year.year}-layer`)) {
                  after.addLayer({
                    id: `after-imagery-${year.year}-layer`,
                    type: 'raster',
                    source: `after-imagery-${year.year}`,
                  });
                }

                if (!after.getSource(`project-polygon-${year.year}`)) {
                  after.addSource(`project-polygon-${year.year}`, {
                    type: 'geojson',
                    data: geoJson || undefined,
                  });
                }

                if (!after.getLayer(`project-polygon-layer-${year.year}`)) {
                  after.addLayer({
                    id: `project-polygon-layer-${year.year}`,
                    type: 'line',
                    source: `project-polygon-${year.year}`,
                    layout: {},
                    paint: {
                      'line-color': '#fff',
                      'line-width': 4,
                    },
                  });
                }
              } else {
                if (after.getLayer(`project-polygon-layer-${year.year}`)) {
                  after.removeLayer(`project-polygon-layer-${year.year}`);
                }
                if (after.getLayer(`after-imagery-${year.year}-layer`)) {
                  after.removeLayer(`after-imagery-${year.year}-layer`);
                }
              }
            });
          } else {
            rasterData.imagery.landsat.map((year) => {
              if (
                after.getLayer(`project-polygon-layer-landsat-${year.year}`)
              ) {
                after.removeLayer(`project-polygon-layer-landsat-${year.year}`);
              }
              if (after.getLayer(`after-imagery-landsat-${year.year}-layer`)) {
                after.removeLayer(`after-imagery-landsat-${year.year}-layer`);
              }
            });
          }
        }

        // ESRI
        if (rasterData.imagery.esri !== undefined) {
          if (selectedSource1 === 'esri') {
            rasterData.imagery.esri.map((year) => {
              if (year.year === selectedYear1) {
                if (!before.getSource(`before-imagery-esri-${year.year}`)) {
                  before.addSource(`before-imagery-esri-${year.year}`, {
                    type: 'raster',
                    tiles: [`${year.raster}`],
                    tileSize: 256,
                    attribution: 'layer attribution',
                  });
                }
                if (
                  !before.getLayer(`before-imagery-esri-${year.year}-layer`)
                ) {
                  before.addLayer({
                    id: `before-imagery-esri-${year.year}-layer`,
                    type: 'raster',
                    source: `before-imagery-esri-${year.year}`,
                  });
                }

                if (!before.getSource(`project-polygon-esri-${year.year}`)) {
                  before.addSource(`project-polygon-esri-${year.year}`, {
                    type: 'geojson',
                    data: geoJson || undefined,
                  });
                }

                if (
                  !before.getLayer(`project-polygon-layer-esri-${year.year}`)
                ) {
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
                if (
                  before.getLayer(`project-polygon-layer-esri-${year.year}`)
                ) {
                  before.removeLayer(`project-polygon-layer-esri-${year.year}`);
                }
                if (before.getLayer(`before-imagery-esri-${year.year}-layer`)) {
                  before.removeLayer(`before-imagery-esri-${year.year}-layer`);
                }
              }
            });
          } else {
            rasterData.imagery.esri.map((year) => {
              if (before.getLayer(`project-polygon-layer-esri-${year.year}`)) {
                before.removeLayer(`project-polygon-layer-esri-${year.year}`);
              }
              if (before.getLayer(`before-imagery-esri-${year.year}-layer`)) {
                before.removeLayer(`before-imagery-esri-${year.year}-layer`);
              }
            });
          }

          if (selectedSource2 === 'esri') {
            rasterData.imagery.esri.map((year) => {
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
                    data: geoJson || undefined,
                  });
                }

                if (
                  !after.getLayer(`project-polygon-layer-esri-${year.year}`)
                ) {
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
            rasterData.imagery.esri.map((year) => {
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
    }
    if (before && after) {
      try {
        setTimeout(function () {
          loadLayers();
        }, 1000);
      } catch (e) {
        console.log('Error adding layer', e);
      }
    }
  }, [
    before,
    after,
    selectedYear1,
    selectedYear2,
    selectedSource1,
    selectedSource2,
  ]);

  const imageDropdownProps = {
    selectedYear1,
    selectedYear2,
    setSelectedYear1,
    setSelectedYear2,
    rasterData,
    selectedSource1,
    setSelectedSource1,
    selectedSource2,
    setSelectedSource2,
    isMobile,
  };
  return (
    <>
      {selectedMode === 'imagery' && <ImageDropdown {...imageDropdownProps} />}
      <div
        style={
          selectedMode === 'imagery'
            ? { visibility: 'visible' }
            : { visibility: 'hidden' }
        }
        id="comparison-container"
      >
        <div className="comparison-map" id="before"></div>
        <div className="comparison-map" id="after"></div>
      </div>
      {selectedMode === 'imagery' && <ZoomButtons map={before} />}
    </>
  );
}

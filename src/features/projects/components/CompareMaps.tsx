import React, { ReactElement } from 'react';
import mapboxgl from 'mapbox-gl';
import syncMove from '@mapbox/mapbox-gl-sync-move';
import MapboxCompare from 'mapbox-gl-compare';

interface Props {
  mapRef: any;
  siteImagery: any;
  projectZoom: any;
  projectCenter: any;
  selectedYear1: any;
  selectedYear2: any;
  style: any;
  isMapDataLoading: any;
  selectedOption: any;
  setIsMapDataLoading: Function;
  geoJson: any;
  nicfiDataExists: any;
}

export default function MapCompare({
  mapRef,
  siteImagery,
  projectCenter,
  projectZoom,
  selectedYear1,
  selectedYear2,
  style,
  isMapDataLoading,
  selectedOption,
  setIsMapDataLoading,
  geoJson,
  nicfiDataExists
}: Props): ReactElement {

  const [before, setBefore] = React.useState();
  const [after, setAfter] = React.useState();
  const [firstRun, setFirstRun] = React.useState(true);

  const nicfi_data = [
    {
      year: '2017',
      raster: 'planet_medres_normalized_analytic_2017-06_2017-11_mosaic',
    },
    {
      year: '2018',
      raster: 'planet_medres_normalized_analytic_2018-06_2018-11_mosaic',
    },
    {
      year: '2019',
      raster: 'planet_medres_normalized_analytic_2019-06_2019-11_mosaic',
    },
    {
      year: '2020',
      raster: 'planet_medres_normalized_analytic_2020-06_2020-08_mosaic',
    }
  ]

  React.useEffect(() => {
    if (selectedOption === 'imagery' && firstRun) {
      if (nicfiDataExists) {
        setIsMapDataLoading(true);
      }
      console.log('here');
      var before = new mapboxgl.Map({
        container: 'before', // Container ID
        style: style,
        center: projectCenter,
        zoom: projectZoom,
        // interactive: false
      });

      setBefore(before);

      var after = new mapboxgl.Map({
        container: 'after', // Container ID
        style: style,
        center: projectCenter,
        zoom: projectZoom,
        // interactive: false
      });

      setAfter(after);

      // Add zoom and rotation controls to the map.
      after.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

      // A selector or reference to HTML element
      var container = '#comparison-container';

      new MapboxCompare(before, after, container, {
        mousemove: false, // Optional. Set to true to enable swiping during cursor movement.
        orientation: 'vertical', // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
      });

      syncMove(before, mapRef.current.getMap());
      if (nicfiDataExists) {
        setTimeout(() => { setIsMapDataLoading(false); }, 2000);
      }

      setFirstRun(false);
    }
  }, [selectedOption, siteImagery]);

  React.useEffect(() => {
    if (before && after) {
      try {
        nicfi_data.map((year: any) => {
          if (year.year === selectedYear1) {
            if (!before.getSource(`before-imagery-${year.year}`)) {
              before.addSource(`before-imagery-${year.year}`, {
                type: 'raster',
                tiles: [`https://tile-s1.plant-for-the-planet.org/basemaps/v1/planet-tiles/${year.raster}/gmap/{z}/{x}/{y}.png`],
                tileSize: 256,
                attribution: 'layer attribution',
              });
            }
            if (!before.getLayer(`before-imagery-${year.year}-layer`)) {
              before.addLayer({
                id: `before-imagery-${year.year}-layer`,
                type: 'raster',
                source: `before-imagery-${year.year}`,
              });
            }

            if (!before.getSource(`project-polygon-${year.year}`)) {
              before.addSource(`project-polygon-${year.year}`, {
                'type': 'geojson',
                'data': geoJson
              });
            }

            if (!before.getLayer(`project-polygon-layer-${year.year}`)) {
              before.addLayer({
                'id': `project-polygon-layer-${year.year}`,
                'type': 'line',
                'source': `project-polygon-${year.year}`,
                'layout': {},
                'paint': {
                  'line-color': '#fff',
                  'line-width': 4,
                }
              });
            }

          } else {
            if (before.getLayer(`project-polygon-layer-${year.year}`)) {
              before.removeLayer(`project-polygon-layer-${year.year}`);
            }
            if (before.getLayer(`before-imagery-${year.year}-layer`)) {
              before.removeLayer(`before-imagery-${year.year}-layer`);
            }
          }

          if (year.year === selectedYear2) {
            if (!after.getSource(`after-imagery-${year.year}`)) {
              after.addSource(`after-imagery-${year.year}`, {
                type: 'raster',
                tiles: [`https://tile-s1.plant-for-the-planet.org/basemaps/v1/planet-tiles/${year.raster}/gmap/{z}/{x}/{y}.png`],
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
                'type': 'geojson',
                'data': geoJson
              });
            }

            if (!after.getLayer(`project-polygon-layer-${year.year}`)) {
              after.addLayer({
                'id': `project-polygon-layer-${year.year}`,
                'type': 'line',
                'source': `project-polygon-${year.year}`,
                'layout': {},
                'paint': {
                  'line-color': '#fff',
                  'line-width': 4,
                }
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
        })
        if (!nicfiDataExists) {
          siteImagery.map((year: any) => {
            if (year.year === selectedYear1) {
              if (!before.getSource(`before-imagery-${year.year}-sentinel`)) {
                before.addSource(`before-imagery-${year.year}-sentinel`, {
                  type: 'raster',
                  tiles: [`${year.layer}`],
                  tileSize: 256,
                  attribution: 'layer attribution',
                });
              }
              if (!before.getLayer(`before-imagery-${year.year}-sentinel-layer`)) {
                before.addLayer({
                  id: `before-imagery-${year.year}-sentinel-layer`,
                  type: 'raster',
                  source: `before-imagery-${year.year}-sentinel`,
                });
              }

              if (!before.getSource(`project-polygon-${year.year}-sentinel`)) {
                before.addSource(`project-polygon-${year.year}-sentinel`, {
                  'type': 'geojson',
                  'data': geoJson
                });
              }

              if (!before.getLayer(`project-polygon-layer-${year.year}-sentinel`)) {
                before.addLayer({
                  'id': `project-polygon-layer-${year.year}-sentinel`,
                  'type': 'line',
                  'source': `project-polygon-${year.year}-sentinel`,
                  'layout': {},
                  'paint': {
                    'line-color': '#fff',
                    'line-width': 4,
                  }
                });
              }

            } else {
              if (before.getLayer(`project-polygon-layer-${year.year}-sentinel`)) {
                before.removeLayer(`project-polygon-layer-${year.year}-sentinel`);
              }
              if (before.getLayer(`before-imagery-${year.year}-sentinel-layer`)) {
                before.removeLayer(`before-imagery-${year.year}-sentinel-layer`);
              }
            }

            if (year.year === selectedYear2) {
              if (!after.getSource(`after-imagery-${year.year}-sentinel`)) {
                after.addSource(`after-imagery-${year.year}-sentinel`, {
                  type: 'raster',
                  tiles: [`${year.layer}`],
                  tileSize: 256,
                  attribution: 'layer attribution',
                });
              }
              if (!after.getLayer(`after-imagery-${year.year}-sentinel-layer`)) {
                after.addLayer({
                  id: `after-imagery-${year.year}-sentinel-layer`,
                  type: 'raster',
                  source: `after-imagery-${year.year}-sentinel`,
                });
              }

              if (!after.getSource(`project-polygon-${year.year}-sentinel`)) {
                after.addSource(`project-polygon-${year.year}-sentinel`, {
                  'type': 'geojson',
                  'data': geoJson
                });
              }

              if (!after.getLayer(`project-polygon-layer-${year.year}-sentinel`)) {
                after.addLayer({
                  'id': `project-polygon-layer-${year.year}-sentinel`,
                  'type': 'line',
                  'source': `project-polygon-${year.year}-sentinel`,
                  'layout': {},
                  'paint': {
                    'line-color': '#fff',
                    'line-width': 4,
                  }
                });
              }
            } else {
              if (after.getLayer(`project-polygon-layer-${year.year}-sentinel`)) {
                after.removeLayer(`project-polygon-layer-${year.year}-sentinel`);
              }
              if (after.getLayer(`after-imagery-${year.year}-sentinel-layer`)) {
                after.removeLayer(`after-imagery-${year.year}-sentinel-layer`);
              }
            }
          })
        }
      } catch (e: any) {
        console.log('Error: ', e);
      }
    }
  }, [selectedYear1, selectedYear2, isMapDataLoading, selectedOption, nicfiDataExists]);
  return (
    <>
      {
        // selectedOption === 'imagery' &&
        //   siteImagery !== [] ? (
        <div style={selectedOption === 'imagery' ? { userSelect: 'none' } : { display: 'none' }} id="comparison-container">
          <div className="comparison-map" id="before"></div>
          <div className="comparison-map" id="after"></div>
        </div>
        // ) : null
      }
    </>
  );
}

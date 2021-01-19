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
      // setIsMapDataLoading(true);
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

      // A selector or reference to HTML element
      var container = '#comparison-container';

      new MapboxCompare(before, after, container, {
        mousemove: false, // Optional. Set to true to enable swiping during cursor movement.
        orientation: 'vertical', // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
      });

      syncMove(before, mapRef.current.getMap());
      // setTimeout(() => { setIsMapDataLoading(false); }, 2000);

      setFirstRun(false);
    }
  }, [selectedOption, siteImagery]);

  React.useEffect(() => {
    if (before && after) {
      console.log('map loaded');
      try {
        nicfi_data.map((year: any) => {
          console.log('inside map');
          if (year.year === selectedYear1) {
            console.log('year exists');
            if (before.isSourceLoaded(`before-imagery-${year.year}`)) {
              console.log('source already loaded');
              before.addLayer({
                id: `before-imagery-${year.year}-layer`,
                type: 'raster',
                source: `before-imagery-${year.year}`,
              });
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

            } else {
              before.addSource(`before-imagery-${year.year}`, {
                type: 'raster',
                tiles: [`https://planet-tiles.planetapp.workers.dev/basemaps/v1/planet-tiles/${year.raster}/gmap/{z}/{x}/{y}.png`],
                tileSize: 256,
                attribution: 'layer attribution',
              });
              console.log('create source');
              before.addLayer({
                id: `before-imagery-${year.year}-layer`,
                type: 'raster',
                source: `before-imagery-${year.year}`,
              });
              before.addSource(`project-polygon-${year.year}`, {
                'type': 'geojson',
                'data': geoJson
              });
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

              console.log('create layer');
            }
          } else {
            before.removeLayer(`before-imagery-${year.year}-layer`);
          }

          if (year.year === selectedYear2) {
            if (after.isSourceLoaded(`after-imagery-${year.year}`)) {
              after.addLayer({
                id: `after-imagery-${year.year}-layer`,
                type: 'raster',
                source: `after-imagery-${year.year}`,
              });
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
            } else {
              after.addSource(`after-imagery-${year.year}`, {
                type: 'raster',
                tiles: [`https://planet-tiles.planetapp.workers.dev/basemaps/v1/planet-tiles/${year.raster}/gmap/{z}/{x}/{y}.png`],
                tileSize: 256,
                attribution: 'layer attribution',
              });
              after.addLayer({
                id: `after-imagery-${year.year}-layer`,
                type: 'raster',
                source: `after-imagery-${year.year}`,
              });
              after.addSource(`project-polygon-${year.year}`, {
                'type': 'geojson',
                'data': geoJson
              });
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
            // after.removeLayer(`after-imagery-${year.year}-layer`);
          }
        })
        if (!nicfiDataExists) {
          siteImagery.map((year: any) => {
            console.log('inside map');
            if (year.year === selectedYear1) {
              console.log('year exists');
              if (before.isSourceLoaded(`before-imagery-${year.year}-sentinel`)) {
                console.log('source already loaded');
                before.addLayer({
                  id: `before-imagery-${year.year}-sentinel-layer`,
                  type: 'raster',
                  source: `before-imagery-${year.year}-sentinel`,
                });
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
              } else {
                before.addSource(`before-imagery-${year.year}-sentinel`, {
                  type: 'raster',
                  tiles: [`${year.layer}`],
                  tileSize: 256,
                  attribution: 'layer attribution',
                });
                console.log('create source');
                before.addLayer({
                  id: `before-imagery-${year.year}-sentinel-layer`,
                  type: 'raster',
                  source: `before-imagery-${year.year}-sentinel`,
                });
                console.log('create layer');
                before.addSource(`project-polygon-${year.year}`, {
                  'type': 'geojson',
                  'data': geoJson
                });
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
              before.removeLayer(`before-imagery-${year.year}-sentinel-layer`);
            }

            if (year.year === selectedYear2) {
              if (after.isSourceLoaded(`after-imagery-${year.year}-sentinel`)) {
                after.addLayer({
                  id: `after-imagery-${year.year}-sentinel-layer`,
                  type: 'raster',
                  source: `after-imagery-${year.year}-sentinel`,
                });
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
              } else {
                after.addSource(`after-imagery-${year.year}-sentinel`, {
                  type: 'raster',
                  tiles: [`${year.layer}`],
                  tileSize: 256,
                  attribution: 'layer attribution',
                });
                after.addLayer({
                  id: `after-imagery-${year.year}-sentinel-layer`,
                  type: 'raster',
                  source: `after-imagery-${year.year}-sentinel`,
                });
                after.addSource(`project-polygon-${year.year}`, {
                  'type': 'geojson',
                  'data': geoJson
                });
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
              after.removeLayer(`after-imagery-${year.year}-sentinel-layer`);
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

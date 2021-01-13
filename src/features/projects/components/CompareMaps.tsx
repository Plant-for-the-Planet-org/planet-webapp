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
  selectedOption
}: Props): ReactElement {

  const [before, setBefore] = React.useState();
  const [after, setAfter] = React.useState();
  const [firstRun, setFirstRun] = React.useState(true);

  React.useEffect(() => {
    if (selectedOption === 'imagery' && firstRun) {
      console.log('here');
      var before = new mapboxgl.Map({
        container: 'before', // Container ID
        style: style,
        center: projectCenter,
        zoom: projectZoom,
        interactive: false
      });

      setBefore(before);

      var after = new mapboxgl.Map({
        container: 'after', // Container ID
        style: style,
        center: projectCenter,
        zoom: projectZoom,
        interactive: false
      });

      setAfter(after);

      // A selector or reference to HTML element
      var container = '#comparison-container';

      new MapboxCompare(before, after, container, {
        mousemove: true, // Optional. Set to true to enable swiping during cursor movement.
        orientation: 'vertical', // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
      });

      syncMove(before, mapRef.current.getMap());
      setFirstRun(false);
    }
  }, [selectedOption, siteImagery]);

  React.useEffect(() => {
    if (before && after) {
      console.log('map loaded');
      try {
        siteImagery.map((year: any) => {
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
            } else {
              before.addSource(`before-imagery-${year.year}`, {
                type: 'raster',
                tiles: [`${year.layer}`],
                tileSize: 256,
                attribution: 'layer attribution',
              });
              console.log('create source');
              before.addLayer({
                id: `before-imagery-${year.year}-layer`,
                type: 'raster',
                source: `before-imagery-${year.year}`,
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
            } else {
              after.addSource(`after-imagery-${year.year}`, {
                type: 'raster',
                tiles: [`${year.layer}`],
                tileSize: 256,
                attribution: 'layer attribution',
              });
              after.addLayer({
                id: `after-imagery-${year.year}-layer`,
                type: 'raster',
                source: `after-imagery-${year.year}`,
              });
            }
          } else {
            after.removeLayer(`after-imagery-${year.year}-layer`);
          }
        })
      } catch (e: any) {
        console.log('Error: ', e);
      }
    }
  }, [selectedYear1, selectedYear2, isMapDataLoading, selectedOption]);
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

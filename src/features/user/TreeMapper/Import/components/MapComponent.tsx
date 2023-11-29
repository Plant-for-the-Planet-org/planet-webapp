import React, { ReactElement } from 'react';
import * as turf from '@turf/turf';
import ReactMapboxGl, { ZoomControl, GeoJSONLayer } from 'react-mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import WebMercatorViewport from '@math.gl/web-mercator';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import { GeoJSON } from 'geojson';
import { RequiredMapStyle } from '../../../../common/types/map';

interface Props {
  geoJson: GeoJSON | null;
}

interface viewportProps {
  height: string;
  width: string;
  center: [number, number];
  zoom: [number];
}

const Map = ReactMapboxGl({ maxZoom: 15, accessToken: '' });

export default function MapComponent({ geoJson }: Props): ReactElement {
  const defaultMapCenter: [number, number] = [0, 0];
  const defaultZoom = 1.4;

  const [viewport, setViewPort] = React.useState<viewportProps>({
    height: '100%',
    width: '100%',
    center: defaultMapCenter,
    zoom: [defaultZoom],
  });

  const _viewport2 = {
    height: 1000,
    width: 500,
    center: defaultMapCenter,
    zoom: defaultZoom,
  };

  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });
  React.useEffect(() => {
    const promise = getMapStyle('openStreetMap');
    promise.then((style: RequiredMapStyle) => {
      if (style) {
        setStyle(style);
      }
    });
  }, []);

  React.useEffect(() => {
    if (geoJson) {
      const geo = turf.featureCollection([
        { type: 'Feature', geometry: geoJson, properties: {} },
      ]);
      const bbox = turf.bbox(geo);
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        _viewport2
      ).fitBounds([
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ]);
      const newViewport: viewportProps = {
        ...viewport,
        center: [longitude, latitude],
        zoom: [zoom],
      };
      setViewPort(newViewport);
    } else {
      setViewPort({
        ...viewport,
        center: defaultMapCenter,
        zoom: [defaultZoom],
      });
    }
  }, [geoJson]);

  return (
    <>
      <Map
        {...viewport}
        style={style} // eslint-disable-line
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        // onClick={() => setActiveMethod('draw')}
      >
        <>
          {geoJson ? (
            <GeoJSONLayer
              data={geoJson}
              fillPaint={{
                'fill-color': '#fff',
                'fill-opacity': 0.2,
              }}
              linePaint={{
                'line-color': '#68B030',
                'line-width': 2,
              }}
            />
          ) : null}
          <ZoomControl position="bottom-right" />
        </>
      </Map>
    </>
  );
}

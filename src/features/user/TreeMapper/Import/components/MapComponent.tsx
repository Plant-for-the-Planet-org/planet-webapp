import type { ReactElement } from 'react';
import type { GeoJSON } from 'geojson';
import type { RequiredMapStyle } from '../../../../common/types/map';

import React from 'react';
import { featureCollection } from '@turf/helpers';
import bbox from '@turf/bbox';
import ReactMapboxGl, { ZoomControl, GeoJSONLayer } from 'react-mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import WebMercatorViewport from '@math.gl/web-mercator';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import themeProperties from '../../../../../theme/themeProperties';

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
  const { white, warmGreen } = themeProperties.designSystem.colors;

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
      const geo = featureCollection([
        { type: 'Feature', geometry: geoJson, properties: {} },
      ]);
      const bounds = bbox(geo);
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        _viewport2
      ).fitBounds([
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
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
                'fill-color': `${white}`,
                'fill-opacity': 0.2,
              }}
              linePaint={{
                'line-color': `${warmGreen}`,
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

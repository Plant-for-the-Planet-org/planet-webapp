import React, { ReactElement } from 'react';
import styles from '../../TreeMapper.module.scss';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import MapGL, { NavigationControl } from 'react-map-gl';
import LayerIcon from '../../../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../../../public/assets/images/icons/LayerDisabled';
import SatelliteLayer from '../../../../projects/components/maps/SatelliteLayer';
import { RequiredMapStyle } from '../../../../common/types/map';
import { ViewPort } from '../../../../common/types/project';

export default function MyTreesMap(): ReactElement {
  const [satellite, setSatellite] = React.useState(false);

  const defaultMapCenter = [-28.5, 36.96];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });

  React.useEffect(() => {
    const promise = getMapStyle('default');
    promise.then((style: RequiredMapStyle) => {
      if (style) {
        setStyle(style);
      }
    });
  }, []);

  const _onViewportChange = (view: ViewPort) => setViewPort({ ...view });

  return (
    <MapGL
      {...viewport}
      mapStyle={style}
      scrollZoom={false}
      onViewportChange={_onViewportChange}
      attributionControl={true}
      mapOptions={{
        customAttribution:
          'Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA FSA, Aerogrid, IGN, IGP, and the GIS User Community',
      }}
    >
      {satellite && <SatelliteLayer />}
      <div
        onClick={() => setSatellite(!satellite)}
        className={styles.layerToggle}
      >
        {satellite ? <LayerIcon /> : <LayerDisabled />}
      </div>
      <div className={styles.mapNavigation}>
        <NavigationControl showCompass={false} />
      </div>
    </MapGL>
  );
}

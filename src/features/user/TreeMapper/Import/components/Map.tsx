import React, { ReactElement } from 'react';
import styles from '../../TreeMapper.module.scss';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import { useTranslation } from 'next-i18next';
import * as turf from '@turf/turf';
import MapGL, {
  FlyToInterpolator,
  Layer,
  MapEvent,
  Marker,
  NavigationControl,
  Source,
  WebMercatorViewport,
} from 'react-map-gl';
import { localizedAbbreviatedNumber } from '../../../../../utils/getFormattedNumber';
import LayerIcon from '../../../../../../public/assets/images/icons/LayerIcon';
import LayerDisabled from '../../../../../../public/assets/images/icons/LayerDisabled';
import { ProjectPropsContext } from '../../../../common/Layout/ProjectPropsContext';
import * as d3 from 'd3-ease';
import { useRouter } from 'next/router';
import SatelliteLayer from '../../../../projects/components/maps/SatelliteLayer';

interface Props {}

export default function MyTreesMap({}: Props): ReactElement {
  const router = useRouter();

  const { i18n, t } = useTranslation('me');

  const { isMobile } = React.useContext(ProjectPropsContext);
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
    promise.then((style: any) => {
      if (style) {
        setStyle(style);
      }
    });
  }, []);

  const _onViewportChange = (view: any) => setViewPort({ ...view });

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

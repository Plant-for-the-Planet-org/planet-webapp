import React, { ReactElement } from 'react';
import styles from '../../styles/MyTrees.module.scss';
import ReactMapboxGl, {
  Cluster,
  GeoJSONLayer,
  Marker,
  ZoomControl,
} from 'react-mapbox-gl';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import {
  getFormattedNumber,
  getFormattedRoundedNumber,
} from '../../../../../utils/getFormattedNumber';
import { useTranslation } from 'next-i18next';
import TreesIcon from '../../../../../../public/assets/images/icons/TreesIcon';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import TreeIcon from '../../../../../../public/assets/images/icons/TreeIcon';
import themeProperties from '../../../../../theme/themeProperties';
import { ThemeContext } from '../../../../../theme/themeContext';
import { PlantedTreesGreenSvg } from '../../../../../../public/assets/images/ProfilePageIcons';

const Map = ReactMapboxGl({
  // customAttribution:
  //   '<a>Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS</a>',
  maxZoom: 16,
});

interface Props {
  authenticatedType: string;
  contributions: any;
}

export default function MyTreesMap({
  contributions,
  authenticatedType,
}): ReactElement {
  const { i18n, t } = useTranslation('me');
  const defaultMapCenter = [-28.5, 36.96];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    height: '100%',
    width: '100%',
    center: defaultMapCenter,
    zoom: [defaultZoom],
  });
  const [geoJson, setGeoJson] = React.useState();
  const { theme } = React.useContext(ThemeContext);

  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });

  const [contributionInfo, setContributionInfo] = React.useState(null);
  const [clusterInfo, setClusterInfo] = React.useState(null);
  let timer1: NodeJS.Timeout;
  let timer2: NodeJS.Timeout;

  React.useEffect(() => {
    const promise = getMapStyle('default');
    promise.then((style: any) => {
      if (style) {
        setStyle(style);
      }
    });
  }, []);
  console.log(contributions, authenticatedType, '==>');
  const clusterMarker = (coordinates: any, pointCount: any, getLeaves: any) => {
    const nodes = getLeaves(Infinity);
    let sum = 0;
    let key = '';
    nodes.map((node: any) => {
      const item = contributions.find((i: any) => {
        if (i?.properties?.id === node.key) return true;
      });
      sum += Number(item ? item.properties.treeCount : 0);
      key = item?.properties?.id;
    });
    return (
      <Marker key={key} coordinates={coordinates} anchor="bottom">
        <div
          onMouseOver={() => {
            setContributionInfo(null);
            clearTimeout(timer2);
            setClusterInfo({ pointCount, sum });
          }}
          onMouseLeave={() => {
            timer2 = setTimeout(() => setClusterInfo(null), 3000);
          }}
          className={styles.bigMarkerContainer}
        >
          <div className={styles.bigMarker}>
            <div className={styles.treeSvg}>
              <PlantedTreesGreenSvg />
            </div>
          </div>
          <div className={styles.label}>
            {t('me:noOfTress', {
              noOfTrees: `${getFormattedRoundedNumber(i18n.language, sum, 2)}`,
            })}
          </div>
        </div>
      </Marker>
    );
  };

  return (
    <div className={styles.mapContainer}>
      <Map
        {...viewport}
        style={style}
        containerStyle={{
          height: '560px',
          width: '100%',
        }}
      >
        {contributions && (
          <Cluster
            ClusterMarkerFactory={clusterMarker}
            zoomOnClick={true}
            zoomOnClickPadding={50}
            maxZoom={24}
          >
            {Array.isArray(contributions) && contributions.length !== 0
              ? contributions
                  .filter((feature: any) => {
                    return feature.geometry?.type === 'Point';
                  })
                  .map((point: any, index: number) => (
                    <Marker
                      key={point.properties.id}
                      coordinates={point.geometry.coordinates}
                      anchor="bottom"
                    >
                      <div
                        key={index}
                        style={{
                          height: '26px',
                          width: '56px',
                          backgroundColor: '#68B03033',
                          borderRadius: '40px',
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                        }}
                        onMouseOver={() => {
                          setClusterInfo(null);
                          clearTimeout(timer1);
                          setContributionInfo(point);
                        }}
                        onMouseLeave={() => {
                          // timer1 = setTimeout(
                          //   () => setContributionInfo(null),
                          //   3000
                          // );
                        }}
                      >
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '50%',
                            margin: '2px',
                            display: ' flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ marginTop: '6px' }}>
                            <PlantedTreesGreenSvg />
                          </div>
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          4
                        </div>
                      </div>
                    </Marker>
                  ))
              : null}
          </Cluster>
        )}
        <ZoomControl position="bottom-right" />
      </Map>
    </div>
  );
}

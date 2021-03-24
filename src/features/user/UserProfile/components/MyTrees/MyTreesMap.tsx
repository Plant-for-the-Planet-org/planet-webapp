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
import i18next from '../../../../../../i18n';
import { getCountryDataBy } from '../../../../../utils/countryCurrency/countryUtils';
import TreesIcon from '../../../../../../public/assets/images/icons/TreesIcon';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import TreeIcon from '../../../../../../public/assets/images/icons/TreeIcon';

const Map = ReactMapboxGl({
  customAttribution:
    '<a>Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS</a>',
  maxZoom: 16,
});

interface Props {
  authenticatedType: string;
  contributions: any;
}

export default function MyTreesMap({
  contributions,
  authenticatedType,
}: Props): ReactElement {
  const { useTranslation } = i18next;
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

  React.useEffect(() => {
    if (
      contributions &&
      Array.isArray(contributions) &&
      contributions.length !== 0
    ) {
      setGeoJson({
        type: 'FeatureCollection',
        features: contributions,
      });
    }
    console.log(contributions);
  }, [contributions]);

  const clusterMarker = (coordinates: any, pointCount: any, getLeaves: any) => {
    const nodes = getLeaves(Infinity);
    let sum = 0;
    nodes.map((node: any) => {
      const item = contributions.find((i: any) => {
        if (i.properties.id === node.key) return true;
      });
      sum += Number(item ? item.properties.treeCount : 0);
    });
    return (
      <Marker coordinates={coordinates} anchor="bottom">
        <div
          onMouseOver={() => {
            setContributionInfo(null);
            clearTimeout(timer2);
            setClusterInfo({ pointCount, sum });
          }}
          onMouseLeave={() => {
            timer2 = setTimeout(() => setClusterInfo(null), 3000);
          }}
          className={styles.bigMarker}
        >
          {getFormattedRoundedNumber(i18n.language, sum, 2)}
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
          height: '100%',
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
                        style={
                          point.properties.type === 'registration'
                            ? { background: '#3D67B1' }
                            : {}
                        }
                        onMouseOver={() => {
                          setClusterInfo(null);
                          clearTimeout(timer1);
                          setContributionInfo(point);
                        }}
                        onMouseLeave={() => {
                          timer1 = setTimeout(
                            () => setContributionInfo(null),
                            3000
                          );
                        }}
                        className={styles.marker}
                      />
                    </Marker>
                  ))
              : null}
          </Cluster>
        )}
        {geoJson ? (
          <GeoJSONLayer
            data={geoJson}
            fillPaint={{
              'fill-color': '#fff',
              'fill-opacity': 0.2,
            }}
            linePaint={{
              'line-color': '#3D67B1',
              'line-width': 2,
            }}
          />
        ) : null}
        {contributionInfo ? (
          <>
            <div className={styles.contributionInfo}>
              <div key={contributionInfo.properties.id} className={styles.tree}>
                <div className={styles.dateRow}>
                  {formatDate(contributionInfo.properties.plantDate)}
                </div>
                <div className={styles.treeRow}>
                  <div className={styles.textCol}>
                    <div className={styles.title}>
                      {contributionInfo.properties.type === 'registration'
                        ? t('me:registered')
                        : contributionInfo.properties.project?.name}
                    </div>
                    <div className={styles.country}>
                      {contributionInfo.properties.country
                        ? t(
                            'country:' +
                              contributionInfo.properties.country.toLowerCase()
                          )
                        : null}
                    </div>
                    {contributionInfo.properties.type === 'gift' ? (
                      <div className={styles.source}>
                        {contributionInfo.properties.giver.name
                          ? t('me:receivedFrom', {
                              name: contributionInfo.properties.giver.name,
                            })
                          : t('me:receivedTrees')}
                      </div>
                    ) : null}
                    {contributionInfo.properties.type === 'redeem' ? (
                      <div className={styles.source}>
                        {t('me:redeemedTrees')}
                      </div>
                    ) : null}
                    {contributionInfo.properties.type === 'donation' ? (
                      <div className={styles.source}>
                        {contributionInfo.properties.recipient
                          ? t('me:giftToGiftee', {
                              gifteeName:
                                contributionInfo.properties.recipient.name,
                            })
                          : null}
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.numberCol}>
                    <div className={styles.treeIcon}>
                      <div
                        style={
                          contributionInfo.properties.type === 'registration'
                            ? { color: '#3D67B1' }
                            : {}
                        }
                        className={styles.number}
                      >
                        {getFormattedNumber(
                          i18n.language,
                          Number(contributionInfo.properties.treeCount)
                        )}
                      </div>
                      <div className={styles.icon}>
                        {contributionInfo.properties.treeCount > 1 ? (
                          <TreesIcon
                            color={
                              contributionInfo.properties.type ===
                              'registration'
                                ? '#3D67B1'
                                : null
                            }
                          />
                        ) : (
                          <TreeIcon
                            color={
                              contributionInfo.properties.type ===
                              'registration'
                                ? '#3D67B1'
                                : null
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {clusterInfo ? (
          <>
            <div className={styles.contributionInfo}>
              <div className={styles.tree}>
                <div className={styles.treeRow}>
                  <div className={styles.textCol}>
                    <div className={styles.title}>
                      {`${clusterInfo.pointCount} ${t('contributions')}`}
                    </div>
                  </div>
                  <div className={styles.numberCol}>
                    <div className={styles.treeIcon}>
                      <div className={styles.number}>
                        {getFormattedNumber(
                          i18n.language,
                          Number(clusterInfo.sum)
                        )}
                      </div>
                      <div className={styles.icon}>
                        {clusterInfo.sum > 1 ? <TreesIcon /> : <TreeIcon />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
        <ZoomControl position="bottom-right" />
      </Map>
    </div>
  );
}

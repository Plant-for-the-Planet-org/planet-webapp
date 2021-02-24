import React, { ReactElement } from 'react';
import styles from '../../styles/MyTrees.module.scss';
import ReactMapboxGl, { Cluster, GeoJSONLayer, Marker } from 'react-mapbox-gl';
import getMapStyle from '../../../../../utils/getMapStyle';
import { getFormattedRoundedNumber } from '../../../../../utils/getFormattedNumber';
import i18next from '../../../../../../i18n';
import { getCountryDataBy } from '../../../../../utils/countryCurrency/countryUtils';

const Map = ReactMapboxGl({
  customAttribution:
    '<a>Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS</a>',
});

interface Props {
  contributions: any;
}

export default function MyTreesMap({ contributions }: Props): ReactElement {
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
  }, [contributions]);

  const clusterMarker = (coordinates: any, pointCount: any, getLeaves: any) => (
    <Marker
      coordinates={coordinates}
      anchor="bottom"
    // onClick={() => {
    //   console.log('point Count ', pointCount);
    //   console.log('Leaves ', getLeaves(Infinity));
    // }}
    >
      <div
        onMouseOver={() => {
          const nodes = getLeaves(Infinity);
          let sum = 0;
          nodes.map((node: any) => {
            sum += Number(contributions[node.key].properties.treeCount);
          })
          console.log(sum);
          setContributionInfo({ treeCount: sum, country: contributions[nodes[0].key].properties.country });
        }}
        className={styles.bigMarker}
      />
    </Marker>
  );

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
        <Cluster ClusterMarkerFactory={clusterMarker}>
          {
            contributions &&
              Array.isArray(contributions) &&
              contributions.length !== 0
              ? contributions.filter((feature: any) => {
                return feature.geometry?.type === 'Point';
              }).map((point: any, key: any) =>
                <Marker
                  key={key}
                  coordinates={point.geometry.coordinates}
                  anchor="bottom">
                  <div
                    style={
                      point.properties.type === 'registration'
                        ? { background: '#3D67B1' }
                        : {}
                    }
                    onMouseOver={() => {
                      console.log(point.properties.treeCount);
                      setContributionInfo({ treeCount: point.properties.treeCount, country: point.properties.country, project: point.properties.project.name, type: point.properties.type });
                    }}
                    className={styles.marker}
                  />
                </Marker>
              ) : null
          }
        </Cluster>
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
        {contributionInfo ?
          <div className={styles.contributionInfo}>
            <p className={styles.treeCount}>{`${getFormattedRoundedNumber(i18n.language, contributionInfo.treeCount, 1)} Trees ${contributionInfo.country ? `• ${getCountryDataBy('countryCode', contributionInfo.country).countryName}` : ''}`}</p>
            <p className={styles.moreInfo}>{contributionInfo.project ? contributionInfo.project : null}</p>
            <p className={styles.moreInfo}>{contributionInfo.type && contributionInfo.type === 'registration' ? t('registeredTrees') : null}</p>
          </div>
          : null}
      </Map>
    </div>
  );
}

import { Marker } from 'react-map-gl';
import { useTranslation } from 'next-i18next';
import { ReactElement, useEffect, useState } from 'react';
import {
  ConservationTreeSvg,
  PlantedTreesSvg,
  RestoredSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { MarkerProps } from '../../../../common/types/map';
import CustomPopupMarker from './CustomPopupMarker';
import theme from '../../../../../theme/themeProperties';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';

export const TreePlantedClusterMarker = ({
  geoJson,
  mapRef,
}: MarkerProps): ReactElement => {
  const { primaryDarkColorX } = theme;
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);

  return ready ? (
    <>
      <CustomPopupMarker
        geoJson={geoJson}
        showPopUp={showPopUp}
        mapRef={mapRef}
      />

      <Marker
        latitude={Number(geoJson.geometry.coordinates[1])}
        longitude={Number(geoJson.geometry.coordinates[0])}
      >
        <div
          className={MyForestMapStyle.clusterMarkerContainer}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            {geoJson?.properties?.plantProject?.unitType === 'm2' &&
            geoJson?.properties?.purpose === 'trees' ? (
              <RestoredSvg color={`${primaryDarkColorX}`} />
            ) : (
              <PlantedTreesSvg color={`${primaryDarkColorX}`} />
            )}
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {geoJson?.properties?.plantProject?.unitType === 'm2' &&
            geoJson?.properties?.purpose === 'trees'
              ? t('me:area', {
                  areaConserved: `${
                    geoJson.properties.totalTrees || geoJson.properties.quantity
                  }`,
                })
              : t('me:plantedTrees', {
                  count:
                    geoJson.properties.totalTrees ||
                    parseInt(geoJson.properties.quantity) ||
                    0,
                })}
          </div>
        </div>
      </Marker>
    </>
  ) : (
    <></>
  );
};

export const ConservAreaClusterMarker = ({
  geoJson,
  mapRef,
}: MarkerProps): ReactElement => {
  const { lightBlueColor } = theme;
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  return ready ? (
    <div>
      <CustomPopupMarker
        geoJson={geoJson}
        mapRef={mapRef}
        showPopUp={showPopUp}
      />

      <Marker
        latitude={Number(geoJson.geometry.coordinates[1])}
        longitude={Number(geoJson.geometry.coordinates[0])}
      >
        <div
          className={MyForestMapStyle.conservationClusterMarkerContainer}
          style={{ backgroundColor: `${lightBlueColor}` }}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            <ConservationTreeSvg color={`${lightBlueColor}`} />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {t('me:area', {
              areaConserved: `${
                geoJson.properties.totalTrees || geoJson.properties.quantity
              }`,
            })}
          </div>
        </div>
      </Marker>
    </div>
  ) : (
    <></>
  );
};

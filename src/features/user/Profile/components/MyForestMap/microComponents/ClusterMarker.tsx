import { Marker } from 'react-map-gl';
import { useTranslations } from 'next-intl';
import { ReactElement, useState } from 'react';
import {
  ConservationTreeSvg,
  PlantedTreesSvg,
  RestoredSvg,
} from '../../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../../styles/MyForestMap.module.scss';
import { MarkerProps } from '../../../../../common/types/map';
import CustomPopupMarker from './CustomPopupMarker';
import theme from '../../../../../../theme/themeProperties';
import { _getClusterGeojson } from '../../../../../../utils/superclusterConfig';

export const TreePlantedClusterMarker = ({
  geoJson,
  mapRef,
}: MarkerProps): ReactElement => {
  const { primaryDarkColorX } = theme;
  const t = useTranslations('Profile');
  const [showPopUp, setShowPopUp] = useState(false);

  const _totalTrees =
    geoJson.properties.totalTrees ||
    parseInt(geoJson.properties.quantity) ||
    parseFloat(geoJson.properties.quantity);

  const _unitArea =
    geoJson.properties.totalTrees || geoJson.properties.quantity;

  const _isRestoredArea =
    geoJson?.properties?.plantProject?.unitType === 'm2' &&
    geoJson?.properties?.purpose === 'trees';

  return (
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
            {_isRestoredArea ? (
              <RestoredSvg color={`${primaryDarkColorX}`} />
            ) : (
              <PlantedTreesSvg color={`${primaryDarkColorX}`} />
            )}
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {_isRestoredArea
              ? t('myForestMap.area', {
                  areaConserved: `${_unitArea}`,
                })
              : t('myForestMap.plantedTree', {
                  count: Number(_totalTrees.toFixed(2)) || 0,
                })}
          </div>
        </div>
      </Marker>
    </>
  );
};

export const ConservAreaClusterMarker = ({
  geoJson,
  mapRef,
}: MarkerProps): ReactElement => {
  const _unitArea =
    geoJson.properties.totalTrees || geoJson.properties.quantity;
  const { lightBlueColor } = theme;
  const t = useTranslations('Profile');
  const [showPopUp, setShowPopUp] = useState(false);
  return (
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
            {t('myForestMap.area', {
              areaConserved: `${_unitArea}`,
            })}
          </div>
        </div>
      </Marker>
    </div>
  );
};

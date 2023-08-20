import { Marker } from 'react-map-gl';
import { useTranslation } from 'next-i18next';
import { ReactElement, useState } from 'react';
import {
  ConservationBlueTreeSvg,
  PlantedTreesGreenSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { MarkerProps } from '../../../../common/types/map';
import CustomPopupMarker from './CustomPopupMarker';

export const TreePlantedClusterMarker = ({
  geoJson,
}: MarkerProps): ReactElement => {
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  return ready ? (
    <>
      {geoJson.id === undefined && (
        <CustomPopupMarker geoJson={geoJson} showPopUp={showPopUp} />
      )}

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
            <PlantedTreesGreenSvg />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {t('me:plantedTrees', {
              noOfTrees: `${
                geoJson.properties.totalTrees || geoJson.properties.quantity
              }`,
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
}: MarkerProps): ReactElement => {
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  return ready ? (
    <div>
      {geoJson.id === undefined && (
        <CustomPopupMarker geoJson={geoJson} showPopUp={showPopUp} />
      )}

      <Marker
        latitude={Number(geoJson.geometry.coordinates[1])}
        longitude={Number(geoJson.geometry.coordinates[0])}
      >
        <div
          className={MyForestMapStyle.conservationClusterMarkerContainer}
          style={{ backgroundColor: '#48AADD' }}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div
            className={MyForestMapStyle.svgContainer}
            style={{ paddingLeft: '4px' }}
          >
            <ConservationBlueTreeSvg />
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

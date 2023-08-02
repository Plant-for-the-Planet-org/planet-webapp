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
  totalTrees,
  coordinates,
}: MarkerProps): ReactElement => {
  const { t, ready } = useTranslation(['me']);
  return ready ? (
    <Marker latitude={coordinates[1]} longitude={coordinates[0]}>
      <div className={MyForestMapStyle.clusterMarkerContainer}>
        <div className={MyForestMapStyle.svgContainer}>
          <PlantedTreesGreenSvg />
        </div>
        <div className={MyForestMapStyle.totalTreeCount}>
          {t('me:plantedTrees', { noOfTrees: `${totalTrees}` })}
        </div>
      </div>
    </Marker>
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
      {geoJson?.properties?.totalContribution && (
        <CustomPopupMarker geoJson={geoJson} showPopUp={showPopUp} />
      )}

      <Marker
        latitude={geoJson.geometry.coordinates[1]}
        longitude={geoJson.geometry.coordinates[0]}
      >
        <div
          className={MyForestMapStyle.conservationClusterMarkerContainer}
          style={{ backgroundColor: '#48AADD' }}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div
            className={MyForestMapStyle.svgContainer}
            style={{ paddingTop: '3px', paddingLeft: '4px' }}
          >
            <ConservationBlueTreeSvg />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {t('me:area', {
              areaConserved: `${geoJson.properties.quantity}`,
            })}
          </div>
        </div>
      </Marker>
    </div>
  ) : (
    <></>
  );
};

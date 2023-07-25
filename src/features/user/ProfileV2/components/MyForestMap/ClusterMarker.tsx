import { Marker } from 'react-map-gl';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import {
  ConservationBlueTreeSvg,
  PlantedTreesGreenSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { MarkerProps } from '../../../../common/types/map';

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
  totalTrees,
  coordinates,
}: MarkerProps): ReactElement => {
  const { t, ready } = useTranslation(['me']);
  return ready ? (
    <div>
      <Marker latitude={coordinates[1]} longitude={coordinates[0]}>
        <div
          className={MyForestMapStyle.conservationClusterMarkerContainer}
          style={{ backgroundColor: '#48AADD' }}
        >
          <div
            className={MyForestMapStyle.svgContainer}
            style={{ paddingTop: '3px', paddingLeft: '4px' }}
          >
            <ConservationBlueTreeSvg />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {t('me:area', { areaConserved: `${totalTrees}` })}
          </div>
        </div>
      </Marker>
    </div>
  ) : (
    <></>
  );
};

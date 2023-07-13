import { Marker } from 'react-map-gl';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  ConservationBlueTreeSvg,
  PlantedTreesGreenSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import CustomPopUp from './CustomPopUp';

const TreePlantedClusterMarker = ({ totalTrees, coordinates }) => {
  const { t, ready } = useTranslation(['me']);
  return (
    ready &&
    totalTrees && (
      <>
        <Marker latitude={coordinates[0]} longitude={coordinates[1]}>
          <div className={MyForestMapStyle.clusterMarkerContainer}>
            <div className={MyForestMapStyle.svgContainer}>
              <PlantedTreesGreenSvg />
            </div>
            <div className={MyForestMapStyle.totalTreeCount}>
              {t('me:plantedTrees', { noOfTrees: `${totalTrees}` })}
            </div>
          </div>
        </Marker>
      </>
    )
  );
};

const ConservAreaClusterMarker = ({ latitude, longitude }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  return (
    <>
      {showPopUp && <CustomPopUp latitude={latitude} longitude={longitude} />}
      <Marker latitude={latitude} longitude={longitude}>
        <div
          className={MyForestMapStyle.conservationClusterMarkerContainer}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
          style={{ backgroundColor: '#48AADD' }}
        >
          <div
            className={MyForestMapStyle.svgContainer}
            style={{ paddingTop: '3px', paddingLeft: '4px' }}
          >
            <ConservationBlueTreeSvg />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>4 trees</div>
        </div>
      </Marker>
    </>
  );
};

export { TreePlantedClusterMarker, ConservAreaClusterMarker };

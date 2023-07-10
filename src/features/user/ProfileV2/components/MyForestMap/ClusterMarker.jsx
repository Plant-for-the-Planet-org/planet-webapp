import { Marker } from 'react-map-gl';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import {
  ConservationBlueTreeSvg,
  PlantedTreesGreenSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import CustomPopUp from './CustomPopUp';

const TreePlantedClusterMarker = ({ project, treesInfo }) => {
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  const [totalTreesAnCluster, setTotalTreesAnCluster] = useState(undefined);

  useEffect(() => {
    if (treesInfo) {
      const _result = treesInfo.filter((unit) => {
        if (unit.clusterId === project?.properties?.cluster_id) {
          return unit;
        }
      });
      setTotalTreesAnCluster(_result[0].totalTrees, _result);
    }
  }, [project, treesInfo]);

  return (
    ready &&
    project && (
      <>
        {showPopUp && <CustomPopUp projectInfo={project} />}
        <Marker
          latitude={project?.geometry?.coordinates[1]}
          longitude={project?.geometry?.coordinates[0]}
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
              {t('me:plantedTrees', { noOfTrees: `${totalTreesAnCluster}` })}
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

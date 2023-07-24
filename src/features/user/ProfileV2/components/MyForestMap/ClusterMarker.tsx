import { Marker } from 'react-map-gl';
import { useTranslation } from 'next-i18next';
import {
  ConservationBlueTreeSvg,
  PlantedTreesGreenSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';

// interface MarkerProps {
//   totalTrees: {

//   }
// }
const TreePlantedClusterMarker = ({ totalTrees, coordinates }) => {
  console.log(totalTrees, '==');
  const { t, ready } = useTranslation(['me']);
  return (
    ready &&
    totalTrees && (
      <>
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
      </>
    )
  );
};

const ConservAreaClusterMarker = ({ totalTrees, coordinates }) => {
  const { t, ready } = useTranslation(['me']);
  return (
    ready && (
      <>
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
      </>
    )
  );
};

export { TreePlantedClusterMarker, ConservAreaClusterMarker };

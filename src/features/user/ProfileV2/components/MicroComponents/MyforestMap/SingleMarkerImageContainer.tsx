import {
  PlantedTreesSvg,
  RestoredSvg,
  ConservationTreeSvg,
} from '../../../../../../../public/assets/images/ProfilePageIcons';
import theme from '../../../../../../theme/themeProperties';
import MyForestMapStyle from '../../../styles/MyForestMap.module.scss';
import { SingleMarkerUnitsProps } from './SingleMarkerUnits';

type SingleMarkerImageContainerProps = Omit<SingleMarkerUnitsProps, 'units'>;

const SingleMarkerImageContainer = ({
  isNormalTreeDonation,
  isRegisteredTree,
  isRestorationTreePlantation,
  isConservation,
  isGiftContribution,
  isMergeContribution,
}: SingleMarkerImageContainerProps) => {
  const { primaryDarkColorX, lightBlueColor } = theme;
  const _renderTreeIcon = () => {
    switch (true) {
      case isNormalTreeDonation ||
        isRegisteredTree ||
        isMergeContribution ||
        isGiftContribution:
        return <PlantedTreesSvg color={`${primaryDarkColorX}`} />;
      case isRestorationTreePlantation:
        return <RestoredSvg color={`${primaryDarkColorX}`} />;
      case isConservation:
        return <ConservationTreeSvg color={`${lightBlueColor}`} />;
      default:
        return <></>;
    }
  };
  //The condition for using the isMergeContribution scenario arises when a profile has two contributions,
  //one categorized as a gift and the other as a regular tree donation with the same coordinates.
  //In such a scenario, to prevent the overlap of a single marker on the map, the contributions are merged.
  //This merging occurs when both contributions share the same projectId and are subsequently rendered using a cluster marker.
  return (
    <div className={MyForestMapStyle.svgContainer}>{_renderTreeIcon()}</div>
  );
};

export default SingleMarkerImageContainer;

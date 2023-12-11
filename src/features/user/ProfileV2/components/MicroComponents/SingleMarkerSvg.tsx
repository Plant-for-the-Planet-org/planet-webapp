import {
  PlantedTreesSvg,
  RestoredSvg,
  ConservationTreeSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import theme from '../../../../../theme/themeProperties';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { SingleMarkerUnitsProps } from './SingleMarkerUnits';

type SingleMarkerSvgProps = Omit<SingleMarkerUnitsProps, 'units'>;

const SingleMarkerSvg = ({
  isNormalTreeDonation,
  isRegisteredTree,
  isRestorationTreePlantation,
  isConservation,
  isGiftContribution,
}: SingleMarkerSvgProps) => {
  const { primaryDarkColorX, lightBlueColor } = theme;
  return (
    <div className={MyForestMapStyle.svgContainer}>
      {(isNormalTreeDonation || isRegisteredTree || isGiftContribution) && (
        <PlantedTreesSvg color={`${primaryDarkColorX}`} />
      )}
      {isRestorationTreePlantation && (
        <RestoredSvg color={`${primaryDarkColorX}`} />
      )}
      {isConservation && <ConservationTreeSvg color={`${lightBlueColor}`} />}
    </div>
  );
};

export default SingleMarkerSvg;

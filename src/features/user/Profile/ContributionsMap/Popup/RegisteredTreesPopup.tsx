import React from 'react';
import { useTranslations } from 'next-intl';
import { Popup } from 'react-map-gl-v7';
import { PointFeature } from 'supercluster';
import RegisteredTreePopupIcon from '../../../../../../public/assets/images/icons/myForestMapIcons/RegisteredTreePopupIcon';
import style from '../ContributionsMap.module.scss';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import {
  MyContributionsSingleRegistration,
  SingleRegistration,
} from '../../../../common/types/myForest';
import { SetState } from '../../../../common/types/common';

type RegisteredTreesInfoProps = {
  contributions: SingleRegistration[];
};
const RegisteredTreesInfo = ({ contributions }: RegisteredTreesInfoProps) => {
  const tProfile = useTranslations('Profile.myForestMap');
  return (
    <>
      {contributions.map((singleContribution) => {
        const { plantDate, quantity } = singleContribution;

        return (
          <>
            <div className={style.registeredTrees}>
              {tProfile('plantedTree', {
                count: quantity,
              })}
            </div>
            <div className={style.registeredTreeLabel}>
              {tProfile('registered')}
            </div>
            <div className={style.registeredTreeDate}>
              {formatDate(plantDate)}
            </div>
          </>
        );
      })}
    </>
  );
};
interface RegisteredTreesPopupProps {
  superclusterResponse: PointFeature<MyContributionsSingleRegistration>;
  setIsCursorOnPopup: SetState<boolean>;
}
const RegisteredTreesPopup = ({
  superclusterResponse,
  setIsCursorOnPopup,
}: RegisteredTreesPopupProps) => {
  const { coordinates } = superclusterResponse.geometry;
  const contributions = superclusterResponse.properties.contributions;
  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      className={style.registeredTreePopup}
      closeButton={false}
    >
      <div
        className={style.registeredTreesPopupContainer}
        onMouseEnter={() => setIsCursorOnPopup(true)}
        onMouseLeave={() => setIsCursorOnPopup(false)}
      >
        <RegisteredTreePopupIcon />
        <RegisteredTreesInfo contributions={contributions} />
      </div>
    </Popup>
  );
};

export default RegisteredTreesPopup;

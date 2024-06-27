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
} from '../../../../common/types/myForestv2';

type RegisteredTreeInfoProp = {
  contributions: SingleRegistration[];
};
const RegisteredTreeInfo = ({ contributions }: RegisteredTreeInfoProp) => {
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
interface RegisterTreePopupProp {
  superclusterResponse: PointFeature<MyContributionsSingleRegistration>;
}
const RegisterTreePopup = ({ superclusterResponse }: RegisterTreePopupProp) => {
  const { coordinates } = superclusterResponse.geometry;
  const contributions = superclusterResponse.properties.contributions;
  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      offset={40}
      className={style.registeredTreePopup}
      closeButton={false}
    >
      <div className={style.registeredTreePopupContainer}>
        <RegisteredTreePopupIcon />
        <RegisteredTreeInfo contributions={contributions} />
      </div>
    </Popup>
  );
};

export default RegisterTreePopup;

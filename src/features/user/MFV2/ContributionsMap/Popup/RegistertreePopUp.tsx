import React from 'react';
import { useTranslations } from 'next-intl';
import { Popup } from 'react-map-gl-v7';
import RegisteredTreePopupIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/RegisteredTreePopupIcon';
import style from '../MyForestV2.module.scss';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';

const RegisteredTreeInfo = ({ contributions }: any) => {
  const tProfile = useTranslations('Profile');
  return (
    <>
      {contributions.map((singleContribution: any) => {
        const { plantDate, quantity } = singleContribution;

        return (
          <>
            <div className={style.registeredTrees}>
              {tProfile('myForestMapV.plantedTree', {
                count: quantity,
              })}
            </div>
            <div className={style.registeredTreeLabel}>
              {tProfile('myForestMapV.registered')}
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

const RegisterTreePopup = ({ superclusterResponse }: any) => {
  const { coordinates } = superclusterResponse.geometry;
  const { contributions } = superclusterResponse.properties;
  return (
    <Popup
      latitude={coordinates[1]}
      longitude={coordinates[0]}
      offset={34}
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

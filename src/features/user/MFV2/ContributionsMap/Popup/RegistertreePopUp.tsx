import React from 'react';
import { Popup } from 'react-map-gl-v7';
import RegisteredTreePopupIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/RegisteredTreePopupIcon';
import style from '../MyForestV2.module.scss';

const RegisteredTreeInfo = () => {
  return (
    <>
      <div className={style.registeredTrees}>{'12 trees'}</div>
      <div className={style.registeredTreeLabel}>{'Registered'}</div>
      <div className={style.registeredTreeDate}>{'April 4, 2024'}</div>
    </>
  );
};

const RegisterTreePopup = ({ singleLocation }) => {
  return (
    <Popup
      latitude={singleLocation?.geometry?.coordinates[1]}
      longitude={singleLocation?.geometry?.coordinates[0]}
      offset={34}
      className={style.registeredTreePopup}
      closeButton={false}
    >
      <div className={style.registeredTreePopupContainer}>
        <RegisteredTreePopupIcon />
        <RegisteredTreeInfo />
      </div>
    </Popup>
  );
};

export default RegisterTreePopup;

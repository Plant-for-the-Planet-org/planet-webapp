import React, { ReactElement } from 'react';
import styles from './ProfileCard.module.scss';

interface Props {
  icon: ReactElement;
  text: string;
}

const ProfileCardButton = ({ icon, text }: Props) => {
  return (
    <button className={styles.profileCardButton}>
      <div className={styles.icon}>{icon}</div>
      <label>{text}</label>
    </button>
  );
};

export default ProfileCardButton;

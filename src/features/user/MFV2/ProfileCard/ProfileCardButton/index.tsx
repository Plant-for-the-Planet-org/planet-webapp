import React, { ReactElement } from 'react';
import styles from './ProfileCardButton.module.scss';

interface Props {
  icon: ReactElement;
  text: string;
  type?: string;
}

const ProfileCardButton = ({ icon, text, type = 'secondary' }: Props) => {
  return (
    <button
      className={`${styles.profileCardButton} ${
        type === 'primary' ? styles.primaryProfileCardButton : ''
      }`}
    >
      <div className={styles.icon}>{icon}</div>
      <label>{text}</label>
    </button>
  );
};

export default ProfileCardButton;

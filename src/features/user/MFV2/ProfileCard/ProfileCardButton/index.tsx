import React, { ReactElement } from 'react';
import styles from './ProfileCardButton.module.scss';

interface Props {
  icon?: ReactElement;
  text?: string;
  type?: 'primary' | 'secondary';
  onClick: () => void;
}

const ProfileCardButton = ({
  icon,
  text,
  type = 'secondary',
  onClick,
}: Props) => {
  return (
    <button
      className={`${styles.profileCardButton} ${
        type === 'primary' ? styles.primaryProfileCardButton : ''
      }`}
      onClick={onClick}
    >
      <div className={styles.icon}>{icon}</div>
      <label>{text}</label>
    </button>
  );
};

export default ProfileCardButton;

import React, { ReactElement } from 'react';
import styles from './ProfileCardButton.module.scss';
import Link from 'next/link';

interface CommonProps {
  icon?: ReactElement;
  text?: string;
  color?: 'primary' | 'secondary';
}

interface LinkProps extends CommonProps {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  elementType: 'link';
}

interface ButtonProps extends CommonProps {
  onClick: () => void;
  elementType: 'button';
}

type ProfileCardButtonProps = LinkProps | ButtonProps;

function ProfileCardButton(props: ProfileCardButtonProps): React.JSX.Element {
  if (props.elementType === 'link') {
    return (
      <Link href={props.href} target={props.target}>
        <button
          className={`${styles.profileCardButton} ${
            props.color === 'primary' ? styles.primaryProfileCardButton : ''
          }`}
        >
          <div className={styles.profileCardButtonIcon}>{props.icon}</div>
          <label className={styles.profileCardButtonLabel}>{props.text}</label>
        </button>
      </Link>
    );
  } else {
    return (
      <button
        className={`${styles.profileCardButton} ${
          props.color === 'primary' ? styles.primaryProfileCardButton : ''
        }`}
        onClick={props.onClick}
      >
        <div className={styles.profileCardButtonIcon}>{props.icon}</div>
        <label className={styles.profileCardButtonLabel}>{props.text}</label>
      </button>
    );
  }
}

export default ProfileCardButton;

import React, { ReactElement } from 'react';
import styles from './ProfileCardButton.module.scss';
import Link from 'next/link';

interface LinkProps {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  isLink: true;
}

interface ButtonProps {
  icon?: ReactElement;
  text?: string;
  type?: 'primary' | 'secondary';
  onClick: () => void;
  isLink: false;
}

type ProfileCardButtonProps = LinkProps | ButtonProps;

function ProfileCardButton({
  icon,
  text,
  type = 'secondary',
  onClick,
  isLink,
  href,
  target = '_self',
}: ProfileCardButtonProps): React.JSX.Element {
  return (
    <button
      className={`${styles.profileCardButton} ${
        type === 'primary' ? styles.primaryProfileCardButton : ''
      }`}
      onClick={onClick}
    >
      {isLink ? (
        <Link href={href} target={target}>
          <div className={styles.profileCardButtonIcon}>{icon}</div>
          <label className={styles.profileCardButtonLabel}>{text}</label>
        </Link>
      ) : (
        <>
          <div className={styles.profileCardButtonIcon}>{icon}</div>
          <label className={styles.profileCardButtonLabel}>{text}</label>
        </>
      )}
    </button>
  );
}

export default ProfileCardButton;

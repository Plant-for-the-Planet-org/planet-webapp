import React, { ReactElement } from 'react';
import styles from './WebappButton.module.scss';
import Link from 'next/link';

interface CommonProps {
  icon?: ReactElement;
  text?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Modifications to the default button styles */
  buttonClasses?: string;
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

type WebappButtonProps = LinkProps | ButtonProps;

function WebappButton({
  variant = 'secondary',
  ...otherProps
}: WebappButtonProps): React.JSX.Element {
  const buttonVariantClasses = styles[`${variant}WebappButton`];

  if (otherProps.elementType === 'link') {
    return (
      <Link
        href={otherProps.href}
        target={otherProps.target || '_self'}
        className={styles.webappButtonLink}
      >
        <button
          className={`${styles.webappButton} ${buttonVariantClasses} ${otherProps.buttonClasses}`}
        >
          {otherProps.icon !== undefined && (
            <div className={styles.webappButtonIcon}>{otherProps.icon}</div>
          )}
          <div className={styles.webappButtonLabel}>{otherProps.text}</div>
        </button>
      </Link>
    );
  } else {
    return (
      <button
        className={`${styles.webappButton} ${buttonVariantClasses} ${otherProps.buttonClasses}`}
        onClick={(e) => {
          e.preventDefault(); //ignores href if provided without elementType='link'
          otherProps.onClick();
        }}
      >
        {otherProps.icon !== undefined && (
          <div className={styles.webappButtonIcon}>{otherProps.icon}</div>
        )}
        <div className={styles.webappButtonLabel}>{otherProps.text}</div>
      </button>
    );
  }
}

export default WebappButton;

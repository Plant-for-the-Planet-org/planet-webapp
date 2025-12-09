import type { ReactElement } from 'react';

import { useCallback } from 'react';
import Link from 'next/link';
import { prefetchManager } from '../../../utils/prefetchManager';
import styles from './WebappButton.module.scss';
import useLocalizedPath from '../../../hooks/useLocalizedPath';
import { clsx } from 'clsx';

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
  prefetch?: boolean;
}

interface ButtonProps extends CommonProps {
  onClick: () => void;
  elementType: 'button';
  loading?: boolean;
  disabled?: boolean;
}

type WebappButtonProps = LinkProps | ButtonProps;

function WebappButton({
  variant = 'secondary',
  ...otherProps
}: WebappButtonProps): ReactElement {
  const buttonVariantClasses = styles[`${variant}WebappButton`];
  const buttonClasses = clsx(
    styles.webappButton,
    buttonVariantClasses,
    otherProps.buttonClasses
  );
  const { localizedPath } = useLocalizedPath();
  const isExternalURL = (url: string) => {
    try {
      if (url.match(/^https?:\/\//)) {
        const urlObj = new URL(url);
        return urlObj.host !== window.location.host;
      }
      return url.startsWith('//') || url.includes(':');
    } catch {
      return false;
    }
  };

  if (otherProps.elementType === 'link') {
    const isExternal = isExternalURL(otherProps.href);

    if (isExternal) {
      const handleMouseEnter = useCallback(() => {
        if (otherProps.prefetch && !prefetchManager.has(otherProps.href)) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = otherProps.href;
          document.head.appendChild(link);
          prefetchManager.add(otherProps.href);
        }
      }, [otherProps.href, otherProps.prefetch]);

      return (
        <a
          href={otherProps.href}
          target={otherProps.target || '_self'}
          className={styles.webappButtonLink}
          onClick={(e) => e.stopPropagation()}
          rel={
            otherProps.target === '_blank' ? 'noopener noreferrer' : undefined
          }
          onMouseEnter={handleMouseEnter}
        >
          <button className={buttonClasses}>
            {otherProps.icon !== undefined && (
              <div className={styles.webappButtonIcon}>{otherProps.icon}</div>
            )}
            <div className={styles.webappButtonLabel}>{otherProps.text}</div>
          </button>
        </a>
      );
    }

    return (
      <Link
        href={localizedPath(otherProps.href)}
        target={otherProps.target || '_self'}
        className={styles.webappButtonLink}
        onClick={(e) => e.stopPropagation()}
        {...(otherProps.prefetch !== undefined && {
          prefetch: otherProps.prefetch,
        })}
      >
        <button className={buttonClasses}>
          {otherProps.icon !== undefined && (
            <div className={styles.webappButtonIcon}>{otherProps.icon}</div>
          )}
          <div className={styles.webappButtonLabel}>{otherProps.text}</div>
        </button>
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      onClick={(e) => {
        e.preventDefault(); //ignores href if provided without elementType='link'
        otherProps.onClick();
      }}
      disabled={otherProps.loading || otherProps.disabled}
    >
      {otherProps.icon !== undefined && (
        <div className={styles.webappButtonIcon}>{otherProps.icon}</div>
      )}
      <div className={styles.webappButtonLabelContainer}>
        <span
          className={clsx(styles.webappButtonLabel, {
            [styles.visuallyHidden]: otherProps.loading,
          })}
        >
          {otherProps.text}
        </span>
        {otherProps.loading && <div className="spinner" aria-hidden="true" />}
      </div>
    </button>
  );
}

export default WebappButton;

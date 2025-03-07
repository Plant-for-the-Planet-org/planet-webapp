import type { ReactElement } from 'react';

import { useCallback } from 'react';
import Link from 'next/link';
import { prefetchManager } from '../../../utils/prefetchManager';
import styles from './WebappButton.module.scss';

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
}

type WebappButtonProps = LinkProps | ButtonProps;

function WebappButton({
  variant = 'secondary',
  ...otherProps
}: WebappButtonProps): ReactElement {
  const buttonVariantClasses = styles[`${variant}WebappButton`];

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
          <button
            className={`${styles.webappButton} ${buttonVariantClasses} ${otherProps.buttonClasses}`}
          >
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
        href={otherProps.href}
        target={otherProps.target || '_self'}
        className={styles.webappButtonLink}
        onClick={(e) => e.stopPropagation()}
        {...(otherProps.prefetch !== undefined && {
          prefetch: otherProps.prefetch,
        })}
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
  }

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

export default WebappButton;

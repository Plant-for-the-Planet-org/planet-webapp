import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import { forwardRef } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import styles from './IconButton.module.scss';
import useLocalizedPath from '../../../hooks/useLocalizedPath';

interface CommonProps {
  /** Accessible name announced by screen readers. Applied as `aria-label`. */
  label: string;

  /** Icon content. Hidden from screen readers so only the label is announced. */
  children: ReactNode;

  /** Additional CSS classes. */
  className?: string;
}

export interface IconButtonAsButtonProps
  extends CommonProps,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      'aria-label' | 'children' | 'className'
    > {
  elementType?: 'button';
}

export interface IconButtonAsLinkProps
  extends CommonProps,
    Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      'aria-label' | 'children' | 'className'
    > {
  elementType: 'link';
  href: string;
}

export type IconButtonProps = IconButtonAsButtonProps | IconButtonAsLinkProps;

const isExternalUrl = (url: string): boolean =>
  /^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith('//');

/**
 * Accessible icon-only button or link.
 * Requires an accessible label, hides the icon from screen readers,
 * and forwards all native button/link props.
 */
const IconButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IconButtonProps
>(function IconButton(props, ref): ReactElement {
  const { localizedPath } = useLocalizedPath();

  const hiddenIcon = (
    <span aria-hidden="true" style={{ display: 'contents' }}>
      {props.children}
    </span>
  );

  if (props.elementType === 'link') {
    const {
      label,
      className,
      href,
      target,
      rel,
      children: _children,
      elementType: _elementType,
      ...rest
    } = props;

    const computedRel =
      rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined);

    const sharedProps = {
      target,
      rel: computedRel,
      'aria-label': label,
      className: clsx(styles.iconButton, className),
      ...rest,
    };

    if (isExternalUrl(href)) {
      return (
        <a ref={ref as Ref<HTMLAnchorElement>} href={href} {...sharedProps}>
          {hiddenIcon}
        </a>
      );
    }

    return (
      <Link
        ref={ref as Ref<HTMLAnchorElement>}
        href={localizedPath(href)}
        {...sharedProps}
      >
        {hiddenIcon}
      </Link>
    );
  }

  const {
    label,
    className,
    type,
    children: _children,
    elementType: _elementType,
    ...rest
  } = props;

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type ?? 'button'}
      aria-label={label}
      className={clsx(styles.iconButton, className)}
      {...rest}
    >
      {hiddenIcon}
    </button>
  );
});

export default IconButton;

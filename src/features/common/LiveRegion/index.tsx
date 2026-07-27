import type { ReactElement, ReactNode } from 'react';

import { clsx } from 'clsx';
import styles from './LiveRegion.module.scss';

/**
 * How urgently an update should reach a screen reader.
 *
 * - `assertive` → `role="alert"`. Interrupts whatever is being read. Use for
 *   errors and failed actions the user must hear right away.
 * - `polite` → `role="status"`. Queued until the reader is idle. Use for
 *   result counts, empty states, upload/save progress and success messages.
 */
export type LiveRegionPoliteness = 'assertive' | 'polite';

/** Elements a live region may render as. Kept to text-level containers. */
export type LiveRegionElement = 'div' | 'p' | 'span';

export interface LiveRegionProps {
  /** Announcement urgency. Maps to `role="alert"` / `role="status"`. */
  politeness: LiveRegionPoliteness;

  /** The message. May be empty while there is nothing to announce. */
  children?: ReactNode;

  /** Element to render. Defaults to `div`. */
  as?: LiveRegionElement;

  /** Additional CSS classes. Existing message styling is preserved. */
  className?: string;

  /**
   * Announce the message without showing it. Use when the visual cue is a
   * spinner or skeleton that carries no text.
   */
  isVisuallyHidden?: boolean;

  /** Forwarded so the region can still be referenced by `aria-describedby`. */
  id?: string;
}

/**
 * Announces messages that appear or change after the page loads.
 *
 * Screen readers don't automatically read updates in a normal element.
 * Wrapping the content in a live region makes those updates get announced
 * without moving the user's focus.
 *
 * Keep the live region on the page and only update its content instead of
 * adding a new one. This is more reliable for screen readers.
 *
 * This is especially important for `polite` messages. Some screen readers only
 * announce changes inside a live region that is already on the page, so adding
 * the region together with its message may not be announced. `assertive`
 * (`role="alert"`) messages are usually announced even when the region is
 * added with the message.
 *
 * If keeping a visible live region on the page would affect the layout, keep a
 * hidden live region (`isVisuallyHidden`) on the page and render the visible
 * message separately:
 *
 * ```tsx
 * <LiveRegion politeness="polite" isVisuallyHidden>
 *   {isSaving ? t('saving') : ''}
 * </LiveRegion>
 * {isSaving && <div className={styles.spinner} />}
 * ```
 *
 * Don't place a live region inside an element with `aria-busy={true}`.
 * Screen readers wait until the busy element has finished updating, so
 * messages inside it may not be announced. Render the live region next to the
 * busy element instead.
 */
function LiveRegion({
  politeness,
  children,
  as: Element = 'div',
  className,
  isVisuallyHidden = false,
  id,
}: LiveRegionProps): ReactElement {
  return (
    <Element
      id={id}
      role={politeness === 'assertive' ? 'alert' : 'status'}
      // Both roles already imply these values, but some older
      // screen-reader/browser pairs only act on the explicit attributes.
      aria-live={politeness}
      aria-atomic="true"
      className={clsx(isVisuallyHidden && styles.visuallyHidden, className)}
    >
      {children}
    </Element>
  );
}

export default LiveRegion;

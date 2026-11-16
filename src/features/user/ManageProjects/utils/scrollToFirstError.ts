import type { FieldErrors } from 'react-hook-form';

import { fieldAnchorId } from './completeness';

/**
 * Brings the first field react-hook-form rejected into view.
 *
 * Both forms are long enough that the offending field is often off-screen, so a
 * refused save would otherwise look like nothing happened.
 */
export function scrollToFirstError(errors: FieldErrors): void {
  const first = Object.keys(errors)[0];
  if (!first) return;
  document
    .getElementById(fieldAnchorId(first))
    ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

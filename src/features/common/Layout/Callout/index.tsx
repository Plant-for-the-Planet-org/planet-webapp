import type { ReactElement, ReactNode } from 'react';

import styles from './Callout.module.scss';

interface Props {
  children: ReactNode;
}

/**
 * Standing guidance beside a form, as opposed to a notice about the current state, which is what an Alert is for.
 * One component so the two pages that carry this block cannot drift, and so replacing it later is one edit.
 */
export default function Callout({ children }: Props): ReactElement {
  return <aside className={styles.callout}>{children}</aside>;
}

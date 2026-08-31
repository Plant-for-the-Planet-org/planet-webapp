import type { ReactElement, ReactNode } from 'react';

import DashboardView from '../../common/Layout/DashboardView';
import SingleColumnView from '../../common/Layout/SingleColumnView';
import CenteredContainer from '../../common/Layout/CenteredContainer';
import { SkeletonBlock } from '../../common/ContentLoaders/Skeleton';
import styles from './SettingsFormSkeleton.module.scss';

interface SettingsFormSkeletonProps {
  /** Real, already-translated page title, shown via the real DashboardView header. */
  title?: string;
  /**
   * How the page frames its content: `dashboard` (DashboardView header, the
   * shape most of these routes use), `section` (a back-button + heading,
   * e.g. donor contact management), or `none` (no header at all, e.g. the
   * widgets route, which is just an embed).
   */
  variant?: 'dashboard' | 'section' | 'none';
  /** Number of placeholder lines under the title, `dashboard` variant only. */
  subtitleLines?: number;
  /** Number of stacked field groups the form has (e.g. edit profile also has a separate address section). */
  sections?: number;
  /** Number of label+input rows per field group. */
  fieldsPerSection?: number;
}

const FieldGroup = ({ fieldCount }: { fieldCount: number }): ReactElement => (
  <div className={styles.section} aria-hidden="true">
    {Array.from({ length: fieldCount }).map((_, index) => (
      <div key={index} className={styles.field}>
        <SkeletonBlock height={14} width={120} />
        <SkeletonBlock height={40} />
      </div>
    ))}
    <SkeletonBlock height={40} width={140} borderRadius={8} />
  </div>
);

/**
 * Shared loading shape for the settings/single-form routes: api key, edit
 * profile, delete account, donation link, gift funds, impersonate user,
 * widgets, and donor contact management. Their forms share the same basic
 * shape (a header, one or more stacked field groups), so one component
 * covers all of them via props rather than duplicating a near-identical
 * skeleton per route.
 */
export default function SettingsFormSkeleton({
  title,
  variant = 'dashboard',
  subtitleLines = 1,
  sections = 1,
  fieldsPerSection = 3,
}: SettingsFormSkeletonProps): ReactElement {
  const content: ReactNode = (
    <>
      {Array.from({ length: sections }).map((_, index) => (
        <FieldGroup key={index} fieldCount={fieldsPerSection} />
      ))}
    </>
  );

  if (variant === 'none') {
    return (
      <div className={styles.plainContent} aria-hidden="true">
        <SkeletonBlock height={500} />
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className={styles.plainContent} aria-hidden="true">
        <div className={styles.sectionHeader}>
          <SkeletonBlock width={24} height={24} borderRadius={6} />
          <SkeletonBlock width={220} height={24} />
        </div>
        {content}
      </div>
    );
  }

  return (
    <DashboardView
      title={title ?? ''}
      subtitle={
        subtitleLines > 0 ? (
          <div className={styles.subtitle} aria-hidden="true">
            <SkeletonBlock count={subtitleLines} width={'80%'} height={16} />
          </div>
        ) : undefined
      }
    >
      <SingleColumnView>
        <CenteredContainer>{content}</CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
}

import type { ReactElement } from 'react';
import type { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';

import { useTranslations } from 'next-intl';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { SkeletonBlock } from '../../common/ContentLoaders/Skeleton';
import { BulkCodeSteps } from './index';
import styles from './BulkCodesSkeleton.module.scss';

interface BulkCodesSkeletonProps {
  step?: BulkCodeSteps;
}

/**
 * Loading shape for all three bulk-codes steps (select method, select
 * project, issue codes). The DashboardView + TabbedView shell is identical
 * across steps, so it's reused as-is with its real, already-loaded title and
 * tab labels; only the step content, which differs, is a placeholder.
 *
 * `step` must match the step of the page rendering this skeleton, so the
 * active tab and disabled state reflect the route the user is actually on
 * (e.g. a refresh on the select-project step shouldn't show the
 * select-method tab state).
 */
export default function BulkCodesSkeleton({
  step = BulkCodeSteps.SELECT_METHOD,
}: BulkCodesSkeletonProps): ReactElement {
  const t = useTranslations('BulkCodes');

  const tabItems: TabItem[] = [
    {
      label: t('tabCreationMethod'),
      link: '',
      step: BulkCodeSteps.SELECT_METHOD,
    },
    {
      label: t('tabSelectProject'),
      link: '',
      step: BulkCodeSteps.SELECT_PROJECT,
      disabled: step === BulkCodeSteps.SELECT_METHOD,
    },
    {
      label: t('tabIssueCodes'),
      link: '',
      step: BulkCodeSteps.ISSUE_CODES,
      disabled: step !== BulkCodeSteps.ISSUE_CODES,
    },
  ];

  // Each step's real form has a different number of top-level sections
  // (select method: two side-by-side option cards; select project: one
  // selector; issue codes: one form), so the placeholder count must follow
  // the step too, not just the active tab.
  const renderContent = () => {
    switch (step) {
      case BulkCodeSteps.SELECT_PROJECT:
        return <SkeletonBlock height={56} borderRadius={9} />;
      case BulkCodeSteps.ISSUE_CODES:
        return <SkeletonBlock height={400} borderRadius={9} />;
      case BulkCodeSteps.SELECT_METHOD:
      default:
        return (
          <>
            <SkeletonBlock height={130} borderRadius={9} />
            <SkeletonBlock height={130} borderRadius={9} />
          </>
        );
    }
  };

  return (
    <DashboardView
      title={t('bulkCodesTitle')}
      subtitle={
        <span aria-hidden="true">
          <SkeletonBlock width={280} height={16} />
        </span>
      }
    >
      <TabbedView step={step} tabItems={tabItems}>
        <div className={styles.content} aria-hidden="true">
          {renderContent()}
        </div>
      </TabbedView>
    </DashboardView>
  );
}

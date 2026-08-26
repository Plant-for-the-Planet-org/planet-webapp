import type { ReactElement } from 'react';
import type { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';

import { useTranslations } from 'next-intl';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import { SkeletonBlock } from '../../common/ContentLoaders/Skeleton';
import { ManagePayoutTabs } from './index';
import styles from './PayoutsSkeleton.module.scss';

/**
 * Loading shape shared by the overview, add-bank-details, edit-bank-details,
 * and payout-schedule routes: they all render the same DashboardView +
 * TabbedView shell, reused here as-is with its real title and tab labels.
 * Only the per-tab content (a bank account list or a form), which differs,
 * is a placeholder.
 */
export default function PayoutsSkeleton(): ReactElement {
  const t = useTranslations('ManagePayouts');

  const tabItems: TabItem[] = [
    { label: t('tabOverview'), link: '', step: ManagePayoutTabs.OVERVIEW },
    {
      label: t('tabPayoutSchedule'),
      link: '',
      step: ManagePayoutTabs.PAYOUT_SCHEDULE,
    },
    {
      label: t('tabAddBankDetails'),
      link: '',
      step: ManagePayoutTabs.ADD_BANK_DETAILS,
    },
  ];

  return (
    <DashboardView
      title={t('title')}
      subtitle={
        <span aria-hidden="true">
          <SkeletonBlock width={280} height={16} />
        </span>
      }
    >
      <TabbedView step={ManagePayoutTabs.OVERVIEW} tabItems={tabItems}>
        <div className={styles.content} aria-hidden="true">
          <SkeletonBlock height={120} borderRadius={9} />
          <SkeletonBlock height={120} borderRadius={9} />
        </div>
      </TabbedView>
    </DashboardView>
  );
}

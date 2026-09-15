import type { ReactElement } from 'react';

import {
  SkeletonBlock,
  SkeletonCircle,
} from '../../common/ContentLoaders/Skeleton';
import styles from './DonationReceipt.module.scss';

const ReceiptCardSkeleton = (): ReactElement => (
  <div className={styles.donationReceiptCard} aria-hidden="true">
    <div className={styles.donationInfo}>
      <SkeletonBlock width={130} height={28} />
      <SkeletonBlock width={190} height={16} />
    </div>
    <SkeletonBlock
      width={159}
      height={40}
      borderRadius={8}
      className={styles.receiptCardButton}
    />
  </div>
);

const YearGroupSkeleton = ({
  cardCount,
}: {
  cardCount: number;
}): ReactElement => (
  <div className={styles.yearlyReceiptGroup} aria-hidden="true">
    <div className={styles.yearHeader}>
      <SkeletonBlock width={90} height={34} />
      <SkeletonBlock width={187} height={44} borderRadius={12} />
    </div>
    <div className={styles.yearReceiptCards}>
      {Array.from({ length: cardCount }).map((_, index) => (
        <ReceiptCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

/**
 * Loading shape for the donation receipt list (this feature's own CSS
 * classes are reused directly, in place of a shared shell component like
 * DashboardView, since the real page doesn't use one either).
 */
export default function DonationReceiptsSkeleton(): ReactElement {
  return (
    <section className={styles.donorContactManagementLayout} aria-hidden="true">
      <SkeletonBlock
        width={220}
        height={28}
        className={styles.receiptListHeader}
      />
      <section className={styles.donationReceipts}>
        <YearGroupSkeleton cardCount={2} />
        <YearGroupSkeleton cardCount={2} />
      </section>
      <footer className={styles.receiptListFooter} aria-hidden="true">
        <div className={styles.contactInfo}>
          <SkeletonCircle size={24} />
          <div>
            <SkeletonBlock width={280} height={16} />
            <SkeletonBlock width={220} height={16} />
          </div>
        </div>
      </footer>
    </section>
  );
}

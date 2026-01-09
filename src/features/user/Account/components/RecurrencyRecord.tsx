import type { ReactElement, MouseEvent } from 'react';
import type {
  MultipleDestinations,
  Subscription,
} from '../../../common/types/payments';
import type { SetState } from '../../../common/types/common';

import { useMemo } from 'react';
import styles from '../AccountHistory.module.scss';
import getFormattedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import { useLocale, useTranslations } from 'next-intl';
import TransferDetails from './TransferDetails';
import themeProperties from '../../../../theme/themeProperties';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import { clsx } from 'clsx';

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'paused':
      return styles.paused;
    case 'canceled':
    case 'incomplete_expired':
      return styles.cancelled;
    case 'past_due':
      return styles.pastDue;
    default:
      return styles.active;
  }
};

interface HeaderProps {
  record: Subscription;
  handleRecordToggle?: (index: number | undefined) => void;
  index?: number;
}

export function RecordHeader({
  record,
  handleRecordToggle,
  index,
}: HeaderProps): ReactElement {
  const t = useTranslations('Me');
  const locale = useLocale();

  const recordName = useMemo(() => {
    switch (record.destination.type) {
      case 'planet-cash':
        return t('planetCashPayment');
      case 'mixed':
        return t('composite-donation');
      default:
        return record.destination?.name || '';
    }
  }, [record.destination]);

  const statusStyle = useMemo(
    () => getStatusStyle(record.status),
    [record.status]
  );

  const dateDisplay = useMemo(() => {
    const formatDateWithOffset = (dateString: string) =>
      formatDate(
        new Date(new Date(dateString).valueOf() + 1000 * 3600).toISOString()
      );

    // Active or Trialing - check for scheduled cancellation
    if (record.status === 'active' || record.status === 'trialing') {
      if (record.endsAt) {
        const isFuture = new Date(record.endsAt) > new Date();
        if (isFuture) {
          return `${t('willBeCancelledOn')} ${formatDateWithOffset(
            record.endsAt
          )} • ${t(record.frequency)}`;
        }
      }
      return `${t('nextOn')} ${formatDate(
        new Date(record.currentPeriodEnd).toISOString()
      )} • ${t(record.frequency)}`;
    }

    // Paused
    if (record.status === 'paused') {
      if (record.endsAt) {
        const isFuture = new Date(record.endsAt) > new Date();
        if (isFuture) {
          return `${t('willBeCancelledOn')} ${formatDateWithOffset(
            record.endsAt
          )} • ${t(record.frequency)}`;
        }
      }
      if (record.pauseUntil) {
        return `${t('pausedUntil')} ${formatDateWithOffset(
          record.pauseUntil
        )} • ${t(record.frequency)}`;
      }
      return t('pausedUntilResumed');
    }

    // Past Due
    if (record.status === 'past_due') {
      return `${t('lastDueOn')} ${formatDate(
        new Date(record.currentPeriodEnd).toISOString()
      )} • ${t(record.frequency)}`;
    }

    // Canceled
    if (record.status === 'canceled' && record.endsAt) {
      return `${t('cancelledOn')} ${formatDateWithOffset(record.endsAt)} • ${t(
        record.frequency
      )}`;
    }

    // Incomplete, Incomplete Expired, Unpaid - show nothing
    if (
      record.status === 'incomplete' ||
      record.status === 'incomplete_expired' ||
      record.status === 'unpaid'
    ) {
      return null;
    }

    // Fallback for any other status
    return null;
  }, [record, t]);

  return (
    <div
      onClick={handleRecordToggle && (() => handleRecordToggle(index))}
      className={styles.recurrencyRecordHeader}
      style={{
        cursor: record?.status === 'incomplete' ? 'default' : 'pointer',
      }}
    >
      <div className={styles.left}>
        <p className={styles.top}>{recordName}</p>
        {dateDisplay && <p>{dateDisplay}</p>}
      </div>
      <div className={styles.right}>
        <p className={clsx(styles.top, styles.amount)}>
          {getFormattedCurrency(locale, record.currency, record.amount)}
        </p>
        <p className={clsx(styles.status, statusStyle)}>
          {record?.status === 'trialing' ? 'active' : t(record?.status)}
        </p>
      </div>
    </div>
  );
}

interface MixedSubscriptionProjectsProps {
  destinations: MultipleDestinations['items'];
}

export function MixedSubscriptionProjects({
  destinations,
}: MixedSubscriptionProjectsProps): ReactElement {
  const destinationList = destinations.map((destination, index) => (
    <span key={destination.id || index}>{destination.name}</span>
  ));

  const concatenatedDestinations = destinationList.reduce((prev, curr) => (
    <>
      {prev}
      {', '}
      {curr}
    </>
  ));

  return <p>{concatenatedDestinations}</p>;
}

interface DetailProps {
  record: Subscription;
}

export function DetailsComponent({ record }: DetailProps): ReactElement {
  const t = useTranslations('Me');
  const locale = useLocale();
  return (
    <>
      {record.amount && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('amount')}</p>
          <p>{getFormattedCurrency(locale, record.currency, record.amount)}</p>
        </div>
      )}
      {record.frequency && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('frequency')}</p>
          <p>{t(record?.frequency)}</p>
        </div>
      )}
      {record?.method && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('paymentMethod')}</p>
          <p>{t(record.method)}</p>
        </div>
      )}
      {!Number.isNaN(record.totalDonated) && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('totalDonated')}</p>
          <p>
            {getFormattedCurrency(locale, record.currency, record.totalDonated)}
          </p>
        </div>
      )}
      {record?.donorName && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('donorName')}</p>
          <p>{record?.donorName}</p>
        </div>
      )}
      {record.firstDonation?.created && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('firstDonation')}</p>
          <p>{formatDate(record.firstDonation.created)}</p>
        </div>
      )}
      {record?.destination?.type === 'planet-cash' && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('planet-cash')}</p>
          <p>{t('planetCashPayment')}</p>
        </div>
      )}
      {record?.destination?.type === 'project' && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('project')}</p>
          {record.destination.id ? (
            <a href={`/${record.destination.id}`}>{record.destination?.name}</a>
          ) : (
            <p>{record.destination?.name}</p>
          )}
        </div>
      )}

      {record.firstDonation?.reference && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('reference')}</p>
          <p>{record.firstDonation.reference}</p>
        </div>
      )}

      {record?.destination?.type === 'mixed' && (
        <div className={clsx(styles.singleDetail, styles.fullWidth)}>
          <p className={styles.title}>{t('projects')}</p>
          <MixedSubscriptionProjects destinations={record.destination.items} />
        </div>
      )}
    </>
  );
}

interface CommonProps {
  handleRecordToggle: (index: number | undefined) => void;
  selectedRecord: number | null;
  record: Subscription;
  recurrencies: Subscription[];
  setEditDonation: SetState<boolean>;
  setPauseDonation: SetState<boolean>;
  setCancelDonation: SetState<boolean>;
  setReactivateDonation: SetState<boolean>;
}

interface ManageDonationProps {
  record: Subscription;
  setEditDonation: SetState<boolean>;
  setPauseDonation: SetState<boolean>;
  setCancelDonation: SetState<boolean>;
  setReactivateDonation: SetState<boolean>;
}

export function ManageDonation({
  record,
  setEditDonation,
  setPauseDonation,
  setCancelDonation,
  setReactivateDonation,
}: ManageDonationProps): ReactElement {
  const t = useTranslations('Me');

  const showPause =
    (record?.status === 'active' || record?.status === 'trialing') &&
    !record?.endsAt &&
    record.paymentGateway !== 'offline';
  const showEdit =
    (record?.status === 'active' || record?.status === 'trialing') &&
    record?.endsAt === null;
  const showCancel =
    (record?.status === 'active' || record?.status === 'trialing') &&
    !record?.endsAt;
  const showReactivate =
    record?.status === 'paused' || new Date(record?.endsAt || '') > new Date();

  const openModal = (
    e: MouseEvent<HTMLButtonElement>,
    setModalOpen: SetState<boolean>
  ) => {
    e.preventDefault();
    setModalOpen(true);
  };
  return (
    <div className={styles.manageDonations}>
      {showEdit ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.designSystem.colors.primaryColor }}
          onClick={(e) => openModal(e, setEditDonation)}
        >
          {t('editDonation')}
        </button>
      ) : (
        []
      )}
      {showReactivate ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.designSystem.colors.warmBlue }}
          onClick={(e) => openModal(e, setReactivateDonation)}
        >
          {record?.status === 'paused'
            ? t('resumeDonation')
            : t('reactivateDonation')}
        </button>
      ) : (
        []
      )}
      {showPause ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.designSystem.colors.sunriseOrange }}
          onClick={(e) => openModal(e, setPauseDonation)}
        >
          {t('pauseDonation')}
        </button>
      ) : (
        []
      )}
      {showCancel ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.designSystem.colors.fireRed }}
          onClick={(e) => openModal(e, setCancelDonation)}
        >
          {t('cancelDonation')}
        </button>
      ) : (
        []
      )}
    </div>
  );
}

interface ModalProps extends CommonProps {
  index?: undefined;
  isModal: true;
}

interface ListItemProps extends CommonProps {
  index: number;
  isModal?: false;
}

type Props = ModalProps | ListItemProps;

export default function RecurrencyRecord({
  isModal = false,
  index = undefined,
  handleRecordToggle,
  selectedRecord,
  record,
  setEditDonation,
  setPauseDonation,
  setCancelDonation,
  setReactivateDonation,
}: Props): ReactElement {
  const outerDivClasses = clsx({
    [styles.recordModal]: isModal,
    [styles.record]: !isModal,
    [styles.selected]: !isModal && selectedRecord === index,
  });

  return (
    <div className={outerDivClasses}>
      {isModal && (
        <div
          onClick={() => {
            handleRecordToggle(index);
          }}
          className={styles.closeRecord}
        >
          <BackButton />
        </div>
      )}
      {(!isModal || (isModal && selectedRecord !== null)) && (
        <>
          <RecordHeader
            record={record}
            handleRecordToggle={handleRecordToggle}
            index={index}
          />
          {(isModal || index === selectedRecord) && (
            <div className={styles.divider} />
          )}
          <div className={styles.detailContainer}>
            <div className={styles.detailGrid}>
              <DetailsComponent record={record} />
            </div>
            {record.method === 'offline' && record.bankAccount && (
              <TransferDetails account={record.bankAccount} />
            )}
            {record.status !== 'incomplete' && (
              <ManageDonation
                record={record}
                setEditDonation={setEditDonation}
                setPauseDonation={setPauseDonation}
                setCancelDonation={setCancelDonation}
                setReactivateDonation={setReactivateDonation}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

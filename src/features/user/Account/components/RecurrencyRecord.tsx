import type { Dispatch, ReactElement, SetStateAction } from 'react';
import type {
  MultipleDestinations,
  Subscription,
} from '../../../common/types/payments';
import React, { useMemo } from 'react';

import styles from '../AccountHistory.module.scss';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import { useLocale, useTranslations } from 'next-intl';
import TransferDetails from './TransferDetails';
import themeProperties from '../../../../theme/themeProperties';
import BackButton from '../../../../../public/assets/images/icons/BackButton';

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

  return (
    <div
      onClick={handleRecordToggle && (() => handleRecordToggle(index))}
      className={`${styles.recurrencyRecordHeader}`}
      style={{
        cursor: record?.status === 'incomplete' ? 'default' : 'pointer',
      }}
    >
      <div className={styles.left}>
        <p className={styles.top}>{recordName}</p>

        {record?.endsAt ? (
          <p>
            {new Date(record?.endsAt) < new Date()
              ? t('cancelledOn')
              : t('willBeCancelledOn')}{' '}
            {formatDate(
              new Date(
                new Date(record?.endsAt).valueOf() + 1000 * 3600
              ).toISOString()
            )}{' '}
            • {t(record?.frequency)}
          </p>
        ) : record?.status === 'paused' ? (
          record?.pauseUntil ? (
            <p>
              {t('pausedUntil')}{' '}
              {formatDate(
                new Date(
                  new Date(record?.pauseUntil).valueOf() + 1000 * 3600
                ).toISOString()
              )}{' '}
              • {t(record?.frequency)}
            </p>
          ) : (
            <p>{t('pausedUntilResumed')}</p>
          )
        ) : (
          <span>
            {t('nextOn')}{' '}
            {formatDate(
              new Date(
                new Date(record?.currentPeriodEnd).valueOf()
              ).toISOString()
            )}{' '}
            •{' '}
            <span style={{ textTransform: 'capitalize' }}>
              {t(record?.frequency)}
            </span>
          </span>
        )}
      </div>
      <div className={styles.right}>
        <p className={`${styles.top} ${styles.amount}`}>
          {getFormatedCurrency(locale, record.currency, record.amount)}
        </p>
        <p className={`${styles.status} ${statusStyle}`}>
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
          <p>{getFormatedCurrency(locale, record.currency, record.amount)}</p>
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
            {getFormatedCurrency(locale, record.currency, record.totalDonated)}
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
        <div className={`${styles.singleDetail} ${styles.fullWidth}`}>
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
  seteditDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setpauseDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setcancelDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setreactivateDonation: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ManageDonationProps {
  record: Subscription;
  seteditDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setpauseDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setcancelDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setreactivateDonation: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ManageDonation({
  record,
  seteditDonation,
  setpauseDonation,
  setcancelDonation,
  setreactivateDonation,
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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    setModalOpen: Dispatch<SetStateAction<boolean>>
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
          onClick={(e) => openModal(e, seteditDonation)}
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
          onClick={(e) => openModal(e, setreactivateDonation)}
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
          onClick={(e) => openModal(e, setpauseDonation)}
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
          onClick={(e) => openModal(e, setcancelDonation)}
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
  seteditDonation,
  setpauseDonation,
  setcancelDonation,
  setreactivateDonation,
}: Props): ReactElement {
  const outerDivClasses = isModal
    ? styles.recordModal
    : `${styles.record} ${selectedRecord === index ? styles.selected : ''}`;

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
                seteditDonation={seteditDonation}
                setpauseDonation={setpauseDonation}
                setcancelDonation={setcancelDonation}
                setreactivateDonation={setreactivateDonation}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

import React, { ReactElement } from 'react';
import styles from '../AccountHistory.module.scss';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import i18next from '../../../../../i18n';
import themeProperties from '../../../../theme/themeProperties';

const { useTranslation } = i18next;

interface Props {
  handleRecordOpen: Function;
  index: number;
  selectedRecord: number | null;
  record: Payments.Subscription;
  recurrencies: Payments.Subscription[];
  openModal: boolean;
  seteditDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setpauseDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setcancelDonation: React.Dispatch<React.SetStateAction<boolean>>;
  setreactivateDonation: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RecurrencyRecord({
  handleRecordOpen,
  index,
  selectedRecord,
  record,
  recurrencies,
  openModal,
  seteditDonation,
  setpauseDonation,
  setcancelDonation,
  setreactivateDonation,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  return (
    <div
      key={index}
      className={`${styles.record} ${
        selectedRecord === index ? styles.selected : ''
      }`}
    >
      <RecordHeader
        record={record}
        handleRecordOpen={handleRecordOpen}
        index={index}
        openModal={openModal}
      />
      {index !== recurrencies?.length - 1 && <div className={styles.divider} />}
      <div className={styles.detailContainer}>
        <div className={styles.detailGrid}>
          <DetailsComponent record={record} />
        </div>
        <>
          <ManageDonation
            record={record}
            seteditDonation={seteditDonation}
            setpauseDonation={setpauseDonation}
            setcancelDonation={setcancelDonation}
            setreactivateDonation={setreactivateDonation}
          />
        </>
      </div>
    </div>
  );
}

interface HeaderProps {
  record: Payments.Subscription;
  handleRecordOpen: Function;
  index?: number;
}

export function RecordHeader({
  record,
  handleRecordOpen,
  index,
}: HeaderProps): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  return (
    <div
      onClick={() => handleRecordOpen(index)}
      className={`${styles.recurrencyRecordHeader}`}
      style={{
        cursor: record?.status === 'incomplete' ? 'default' : 'pointer',
      }}
    >
      <div className={styles.left}>
        <p className={styles.top}>{record?.project?.name}</p>
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
          <p>
            {t('nextOn')}{' '}
            {formatDate(
              new Date(
                new Date(record?.currentPeriodEnd).valueOf()
              ).toISOString()
            )}{' '}
            •{' '}
            <p style={{ textTransform: 'capitalize' }}>
              {t(record?.frequency)}
            </p>
          </p>
        )}
      </div>
      <div className={styles.right}>
        <p
          className={styles.top}
          style={{ color: themeProperties.primaryColor }}
        >
          {getFormatedCurrency(i18n.language, record.currency, record.amount)}
        </p>
        <p
          className={`${styles.status} ${
            record?.status === 'paused'
              ? styles.paused
              : record?.status === 'canceled' ||
                record?.status === 'incomplete_expired'
              ? styles.cancelled
              : styles.active
          }`}
        >
          {record?.status === 'trialing' ? 'active' : t(record?.status)}
        </p>
      </div>
    </div>
  );
}

interface DetailProps {
  record: Payments.Subscription;
}

export function DetailsComponent({ record }: DetailProps): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  return (
    <>
      {record.amount && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('amount')}</p>
          <p>
            {getFormatedCurrency(i18n.language, record.currency, record.amount)}
          </p>
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
      {record.totalDonated && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('totalDonated')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.totalDonated
            )}
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
      {record?.project.name && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('project')}</p>
          {record.project.id ? (
            <a href={`/${record.project.id}`}>{record.project.name}</a>
          ) : (
            <p>{record.project.name}</p>
          )}
          {/* <p style={{ color: themeProperties.primaryColor }}>
            {record.project.name}
          </p> */}
        </div>
      )}

      {record.firstDonation?.reference && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('reference')}</p>
          <p>{record.firstDonation.reference}</p>
        </div>
      )}
    </>
  );
}

interface ManageDonationProps {
  record: Payments.Subscription;
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
  const { t, i18n } = useTranslation(['me']);

  const showPause =
    (record?.status === 'active' || record?.status === 'trialing') &&
    !record?.endsAt;
  const showEdit =
    (record?.status === 'active' || record?.status === 'trialing') &&
    record?.endsAt === null;
  const showCancel =
    (record?.status === 'active' || record?.status === 'trialing') &&
    !record?.endsAt;
  const showReactivate =
    record?.status === 'paused' || new Date(record?.endsAt) > new Date();
  return (
    <div className={styles.manageDonations}>
      {showEdit ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.primaryColor }}
          onClick={() => seteditDonation(true)}
        >
          {t('editDonation')}
        </button>
      ) : (
        []
      )}
      {showReactivate ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.light.safeColor }}
          onClick={() => setreactivateDonation(true)}
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
          style={{ color: themeProperties.light.secondaryColor }}
          onClick={() => setpauseDonation(true)}
        >
          {t('pauseDonation')}
        </button>
      ) : (
        []
      )}
      {showCancel ? (
        <button
          className={styles.options}
          style={{ color: themeProperties.light.dangerColor }}
          onClick={() => setcancelDonation(true)}
        >
          {t('cancelDonation')}
        </button>
      ) : (
        []
      )}
    </div>
  );
}

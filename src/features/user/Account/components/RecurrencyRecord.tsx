import React, { ReactElement } from 'react';
import styles from '../AccountHistory.module.scss';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import i18next from '../../../../../i18n';
import theme from '../../../../theme/theme';
import themeProperties from '../../../../theme/themeProperties';

const { useTranslation } = i18next;

interface Props {
  handleRecordOpen: Function;
  index: number;
  selectedRecord: number;
  record: Object;
  recurrencies: Object;
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
        {record.details?.recipientBank && (
          <>
            <div className={styles.title}>{t('bankDetails')}</div>
            <div className={styles.detailGrid}>
              <BankDetails record={record} />
            </div>
          </>
        )}
        <>
          {/* <div className={styles.detailGrid}> */}
          <ManageDonation
            record={record}
            seteditDonation={seteditDonation}
            setpauseDonation={setpauseDonation}
            setcancelDonation={setcancelDonation}
            setreactivateDonation={setreactivateDonation}
          />
          {/* </div> */}
        </>
      </div>
    </div>
  );
}

interface HeaderProps {
  record: Object;
  handleRecordOpen: Function;
  index: number;
  handleClose?: Function;
  openModal: boolean;
}

export function RecordHeader({
  record,
  handleRecordOpen,
  index,
  openModal,
  handleClose,
}: HeaderProps): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  console.log(new Date(record?.endsAt) < new Date(), 'Datesss');
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
                new Date(record?.currentPeriodEnd).valueOf() + 1000 * 3600 * 24
              ).toISOString()
            )}{' '}
            • {t(record?.frequency)}
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
              : record?.status === 'canceled'
              ? styles.cancelled
              : styles.active
          }`}
        >
          {record?.status === 'trialing' ? 'active' : record?.status}
        </p>
      </div>
    </div>
  );
}

interface DetailProps {
  record: Object;
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
      {record?.paymentGateway && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('paymentMethod')}</p>
          <p>{record.paymentGateway}</p>
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
            <p>{record.details.project}</p>
          )}
          {/* <p style={{ color: themeProperties.primaryColor }}>
            {record.project.name}
          </p> */}
        </div>
      )}

      {record.details?.project && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('project')}</p>
          {record.projectGuid ? (
            <a href={`/${record.projectGuid}`}>{record.details.project}</a>
          ) : (
            <p>{record.details.project}</p>
          )}
        </div>
      )}
      {record.details?.refundAmount && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('refundAmount')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.refundAmount / 100
            )}
          </p>
        </div>
      )}
      {record.details?.unitCost && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('treeCost')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.unitCost / 100
            )}
          </p>
        </div>
      )}
      {/* {record.projectGuid && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('projectGuid')}</p>
          <p>{record.projectGuid}</p>
        </div>
      )} */}
      {record.firstDonation?.reference && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('reference')}</p>
          <p>{record.firstDonation.reference}</p>
        </div>
      )}
      {record.details?.fees?.disputeFee && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('disputeFee')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.fees.disputeFee / 100
            )}
          </p>
        </div>
      )}
      {record.details?.fees?.planetFee && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('planetFee')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.fees.planetFee / 100
            )}
          </p>
        </div>
      )}
      {record.details?.fees?.transactionFee && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('transactionFee')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.fees.transactionFee / 100
            )}
          </p>
        </div>
      )}
      {record.details?.fees?.transferFee && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('transferFee')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.fees.transferFee / 100
            )}
          </p>
        </div>
      )}
    </>
  );
}

interface BankDetailsProps {
  record: Object;
}

export function BankDetails({ record }: BankDetailsProps): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  return (
    <>
      {record.details?.recipientBank?.bankName && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('bankName')}</p>
          <p>{record.details.recipientBank.bankName}</p>
        </div>
      )}
      {record.details?.recipientBank?.accountHolder && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('accountHolder')}</p>
          <p>{record.details.recipientBank.accountHolder}</p>
        </div>
      )}
      {record.details?.recipientBank?.aba && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('aba')}</p>
          <p>{record.details.recipientBank.aba}</p>
        </div>
      )}
      {record.details?.recipientBank?.bic && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('bic')}</p>
          <p>{record.details.recipientBank.bic}</p>
        </div>
      )}
      {record.details?.recipientBank?.iban && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('iban')}</p>
          <p>{record.details.recipientBank.iban}</p>
        </div>
      )}
      {record.details?.recipientBank?.swift && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('swift')}</p>
          <p>{record.details.recipientBank.swift}</p>
        </div>
      )}
      {record.details?.recipientBank?.isDefault && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('isDefault')}</p>
          <p>
            {Number(record.details.recipientBank.isDefault) === 0
              ? t('no')
              : t('yes')}
          </p>
        </div>
      )}
      {record.details?.recipientBank?.created && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('created')}</p>
          <p>{formatDate(record.details.recipientBank.created)}</p>
        </div>
      )}
      {record.details?.recipientBank?.updated && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('updated')}</p>
          <p>{formatDate(record.details.recipientBank.updated)}</p>
        </div>
      )}
    </>
  );
}

interface ManageDonationProps {
  record: Object;
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

  const showPause = record?.status === 'active' && !record?.endsAt;
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

import React, { ReactElement } from 'react';
import styles from '../AccountHistory.module.scss';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;

interface Props {
  handleRecordOpen: Function;
  index: number;
  selectedRecord: number;
  record: Object;
  paymentHistory: Object;
}

export default function AccountRecord({
  handleRecordOpen,
  index,
  selectedRecord,
  record,
  paymentHistory,
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  return (
    <div
      key={index}
      onClick={() => handleRecordOpen(index)}
      className={`${styles.record} ${
        selectedRecord === index ? styles.selected : ''
      }`}
    >
      <RecordHeader record={record} />
      {index !== paymentHistory?.items?.length - 1 && (
        <div className={styles.divider} />
      )}
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
        {(record.details.donorCertificate ||
          record.details.taxDeductibleReceipt ||
          record.details.giftCertificate) && (
          <>
            <div className={styles.title}>{t('downloads')}</div>
            <div className={styles.detailGrid}>
              <Certificates record={record} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface HeaderProps {
  record: Object;
}

export function RecordHeader({ record }: HeaderProps): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  return (
    <div className={styles.recordHeader}>
      <div className={styles.left}>
        <p className={styles.top}>
          {record.type === 'tree-donation'
            ? getFormattedNumber(i18n.language, record.treeCount) +
              ' ' +
              t(record.type)
            : t(record.type)}
        </p>
        <p>{formatDate(record.created)}</p>
      </div>
      <div className={styles.right}>
        <p className={styles.top}>
          {getFormatedCurrency(
            i18n.language,
            record.currency,
            record.netAmount/100
          )}
        </p>
        <p>{t(record.status)}</p>
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
      {record.status && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('status')}</p>
          <p>{t(record.status)}</p>
        </div>
      )}
      {record.created && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('created')}</p>
          <p>{formatDate(record.created)}</p>
        </div>
      )}
      {record.lastUpdate && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('lastUpdate')}</p>
          <p>{formatDate(record.lastUpdate)}</p>
        </div>
      )}
      {record.details?.paymentDate && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('paymentDate')}</p>
          <p>{formatDate(record.details?.paymentDate)}</p>
        </div>
      )}
      {record.details?.paidAmount && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('paidAmount')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.paidAmount/100
            )}
          </p>
        </div>
      )}
      {record.details?.totalAmount && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('totalAmount')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.totalAmount/100
            )}
          </p>
        </div>
      )}
      {record.details?.donorName && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('donorName')}</p>
          <p>{record.details.donorName}</p>
        </div>
      )}
      {record.details?.method && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('method')}</p>
          <p>{t(record.details.method)}</p>
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
              record.details.refundAmount/100
            )}
          </p>
        </div>
      )}
      {record.details?.treeCost && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('treeCost')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.treeCost/100
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
      {record.reference && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('reference')}</p>
          <p>{record.reference}</p>
        </div>
      )}
      {record.details?.fees?.disputeFee && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('disputeFee')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.fees.disputeFee
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
              record.details.fees.planetFee
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
              record.details.fees.transactionFee
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
              record.details.fees.transferFee
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

interface CertificatesProps {
  record: Object;
}

export function Certificates({ record }: CertificatesProps): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  return (
    <>
      {record.details?.donorCertificate && (
        <div className={styles.singleDetail}>
          <a
            href={record.details.donorCertificate}
            target="_blank"
            rel="noreferrer"
          >
            {t('donorCertificate')}
          </a>
        </div>
      )}
      {record.details?.taxDeductibleReceipt && (
        <div className={styles.singleDetail}>
          <a
            href={record.details.taxDeductibleReceipt}
            target="_blank"
            rel="noreferrer"
          >
            {t('taxDeductibleReceipt')}
          </a>
        </div>
      )}
      {record.details?.giftCertificate && (
        <div className={styles.singleDetail}>
          <a
            href={record.details.giftCertificate}
            target="_blank"
            rel="noreferrer"
          >
            {t('giftCertificate')}
          </a>
        </div>
      )}
    </>
  );
}

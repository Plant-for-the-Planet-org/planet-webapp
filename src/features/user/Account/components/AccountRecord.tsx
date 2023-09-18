import React, { ReactElement, useMemo } from 'react';
import styles from '../AccountHistory.module.scss';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import { useTranslation } from 'next-i18next';
import { TFunction } from 'next-i18next';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import TransferDetails from './TransferDetails';
import {
  PaymentHistoryRecord,
  RecipientBank,
} from '../../../common/types/payments';
import Certificates, { shouldDisableCertificate } from './Certificates';

interface HeaderProps {
  record: PaymentHistoryRecord;
  handleRecordToggle?: (index: number | undefined) => void;
  index?: number;
  isPlanetCash?: boolean;
}

export function RecordHeader({
  record,
  handleRecordToggle,
  index,
  isPlanetCash = false,
}: HeaderProps): ReactElement {
  const { t, i18n } = useTranslation(['me']);
  const getRecordTitle = (): ReactElement => {
    switch (record.type) {
      case 'tree-donation':
        return (
          <p className={styles.top}>{`${getFormattedNumber(
            i18n.language,
            record.quantity
          )} ${t(record.type)}`}</p>
        );
      case 'tree-gift':
        return (
          <p className={styles.top}>{`${getFormattedNumber(
            i18n.language,
            record.quantity
          )} ${t(record.type)}`}</p>
        );
      case 'funds-donation':
      case 'bouquet-donation':
      case 'conservation-donation':
        if (record.details.project.length > 42)
          return (
            <p
              title={record.details.project}
              className={styles.top}
            >{`${record.details.project.substring(0, 42)}...`}</p>
          );
        else return <p className={styles.top}>{record.details.project}</p>;
      default:
        return <p className={styles.top}>{`${t(record.type)}`}</p>;
    }
  };
  const netAmountStatus =
    record.status === 'refunded' || !isPlanetCash
      ? ''
      : record.purpose === 'planet-cash'
      ? 'incoming'
      : 'outgoing';

  return (
    <div
      onClick={handleRecordToggle && (() => handleRecordToggle(index))}
      className={styles.recordHeader}
    >
      <div className={styles.left}>
        {getRecordTitle()}
        <p>{formatDate(record.created)}</p>
      </div>
      <div className={styles.right}>
        <p className={`${styles.top} ${styles[netAmountStatus]}`}>
          {netAmountStatus === 'outgoing' && '-'}
          {getFormatedCurrency(
            i18n.language,
            record.currency,
            record.netAmount
          )}
        </p>
        <p className={`${styles.recordStatus} ${styles[record.status]}`}>
          {t(record.status)}
        </p>
      </div>
    </div>
  );
}

interface DetailProps {
  record: PaymentHistoryRecord;
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
              record.details.paidAmount
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
              record.details.totalAmount
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
            <a title={record.details.project} href={`/${record.projectGuid}`}>
              {record.details.project.length > 42
                ? record.details.project.substring(0, 42)
                : record.details.project}
            </a>
          ) : (
            <p title={record.details.project}>
              {record.details.project.length > 42
                ? record.details.project.substring(0, 42) + '...'
                : record.details.project}
            </p>
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
              record.details.refundAmount
            )}
          </p>
        </div>
      )}
      {record.details?.unitCost ? (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('treeCost')}</p>
          <p>
            {getFormatedCurrency(
              i18n.language,
              record.currency,
              record.details.unitCost
            )}
          </p>
        </div>
      ) : (
        []
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
      {record.details?.giftOccasion && (
        <div className={`${styles.singleDetail} ${styles.fullWidth}`}>
          <p className={styles.title}>{t('giftOccasion')}</p>
          <p>{record.details.giftOccasion}</p>
        </div>
      )}
      {record.details?.giftComment && (
        <div className={`${styles.singleDetail} ${styles.fullWidth}`}>
          <p className={styles.title}>{t('giftComment')}</p>
          <p>{record.details.giftComment}</p>
        </div>
      )}
    </>
  );
}

export const showStatusNote = (
  record: PaymentHistoryRecord,
  t: TFunction
): ReactElement => {
  const showDonationNote = (): string => {
    switch (record.details.method) {
      case 'stripe-sofort':
      case 'stripe-sepa_debit':
      case 'offline-offline':
        return t(`me:donationNote.${record.details.method}`);
      default:
        return '';
    }
  };
  switch (record.status) {
    case 'pending':
      return <p className={styles.donationNote}>{showDonationNote()}</p>;
    case 'in-dispute':
      return (
        <p className={styles.donationNote}>{t('me:donationNote.in-dispute')}</p>
      );
    default:
      return <></>;
  }
};

interface BankDetailsProps {
  recipientBank: RecipientBank;
}

export function BankDetails({ recipientBank }: BankDetailsProps): ReactElement {
  const { t } = useTranslation(['me']);
  return (
    <>
      {recipientBank?.bankName && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('bankName')}</p>
          <p>{recipientBank.bankName}</p>
        </div>
      )}
      {recipientBank?.accountHolder && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('accountHolder')}</p>
          <p>{recipientBank.accountHolder}</p>
        </div>
      )}
      {recipientBank?.aba && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('aba')}</p>
          <p>{recipientBank.aba}</p>
        </div>
      )}
      {recipientBank?.bic && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('bic')}</p>
          <p>{recipientBank.bic}</p>
        </div>
      )}
      {recipientBank?.iban && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('iban')}</p>
          <p>{recipientBank.iban}</p>
        </div>
      )}
      {recipientBank?.swift && recipientBank?.swift !== 'swift' && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('swift')}</p>
          <p>{recipientBank.swift}</p>
        </div>
      )}
      {recipientBank?.isDefault && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('isDefault')}</p>
          <p>{Number(recipientBank.isDefault) === 0 ? t('no') : t('yes')}</p>
        </div>
      )}
      {recipientBank?.created && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('created')}</p>
          <p>{formatDate(recipientBank.created)}</p>
        </div>
      )}
      {recipientBank?.updated && (
        <div className={styles.singleDetail}>
          <p className={styles.title}>{t('updated')}</p>
          <p>{formatDate(recipientBank.updated)}</p>
        </div>
      )}
    </>
  );
}

interface CommonProps {
  handleRecordToggle: (index: number | undefined) => void;
  selectedRecord: number | null;
  record: PaymentHistoryRecord;
  isPlanetCash?: boolean;
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

export default function AccountRecord({
  handleRecordToggle,
  index = undefined,
  selectedRecord,
  isPlanetCash = false,
  record,
  isModal = false,
}: Props): ReactElement {
  const { t } = useTranslation(['me']);

  const outerDivClasses = isModal
    ? styles.recordModal
    : `${styles.record} ${selectedRecord === index ? styles.selected : ''}`;

  const showCertificate = useMemo(() => {
    if (
      (shouldDisableCertificate(record.purpose) &&
        (record?.details?.donorCertificate ||
          record?.details?.giftCertificate)) ||
      record?.details?.taxDeductibleReceipt
    ) {
      return true;
    }
    return false;
  }, [record]);

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
            handleRecordToggle={!isModal ? handleRecordToggle : undefined}
            index={index}
            isPlanetCash={isPlanetCash}
          />
          {(isModal || index === selectedRecord) && (
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
                  <BankDetails recipientBank={record.details.recipientBank} />
                </div>
              </>
            )}
            {record.details?.account && (
              <TransferDetails account={record.details.account} />
            )}
            {showStatusNote(record, t)}
            {showCertificate && (
              <>
                <div className={styles.title}>{t('downloads')}</div>
                <div className={styles.detailGrid}>
                  <Certificates
                    recordDetails={record.details}
                    purpose={record.purpose}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import { Modal } from '@material-ui/core';
import React, { ReactElement } from 'react';
import BackButton from '../../../../../public/assets/images/icons/BackButton';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';
import styles from '../styles/AccountNavbar.module.scss';
import i18next from '../../../../../i18n';
import Link from 'next/link';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';

const { useTranslation } = i18next;

interface Props {
  record: Object;
  index: number;
}

function PaymentRecord({ record, index }: Props) {
  const { t, i18n } = useTranslation('me');
  const [selectedRecord, setselectedRecord] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  function selectRecord1(index: any) {
    if (selectedRecord === index) {
      setselectedRecord(null);
      setOpen(false);
    } else {
      setselectedRecord(index);
      setOpen(true);
    }
  }

  function selectRecord2(index: any) {
    if (selectedRecord === index) {
      setselectedRecord(null);
    } else {
      setselectedRecord(index);
    }
  }

  return (
    <div
      key={index}
      className={`${styles.singleRecord} ${
        index === selectedRecord ? styles.selectedRecord : ''
      }`}
    >
      <div className={styles.recordHeader} onClick={() => selectRecord1(index)}>
        <div className={styles.treesDate}>
          <p className={styles.treesDonated}>
            {record.type === 'tree-donation'
              ? getFormattedNumber(i18n.language, record.treeCount) +
                ' ' +
                t(record.type)
              : t(record.type)}
          </p>
          <p className={styles.donationDate}>{formatDate(record.created)}</p>
        </div>
        <div className={styles.statusAmount}>
          <div className={styles.recordStatus}>
            {record.type === 'app-payout'
              ? getFormatedCurrency(i18n.language, record.currency, record.net)
              : getFormatedCurrency(
                  i18n.language,
                  record.currency,
                  record.amount
                )}
          </div>
          <div>{t(t(record.status))}</div>
        </div>
      </div>

      <div
        className={styles.recordHeaderDesktop}
        onClick={() => selectRecord2(index)}
      >
        <div className={styles.treesDate}>
          <p className={styles.treesDonated}>
            {getFormattedNumber(i18n.language, record.treeCount)}{' '}
            {t(record.type)}
          </p>
          <p className={styles.donationDate}>{formatDate(record.created)}</p>
        </div>
        <div className={styles.statusAmount}>
          <div className={styles.recordStatus}>
            {getFormatedCurrency(i18n.language, record.currency, record.amount)}
          </div>

          <div>{t(record.status)}</div>
        </div>
      </div>

      <div
        className={`${styles.recordDataContainer} ${
          selectedRecord === index ? styles.recordDataContainerSelected : ''
        }`}
      >
        <div className={styles.recordDetails}>
          {record.details && (
            <RecordDetails
              detail={record.details}
              t={t}
              i18n={i18n}
              currency={record.currency}
            />
          )}
        </div>
        <div className={styles.recordDownloads}>
          {record.details.donorCertificate && (
            <div className={styles.detail}>
              <Link href={record.details.donorCertificate}>
                <a>{t('donorCertificate')}</a>
              </Link>
            </div>
          )}
          {record.details.recipientCertificate && (
            <div className={styles.detail}>
              <Link href={record.details.recipientCertificate}>
                <a>{t('recipientCertificate')}</a>
              </Link>
            </div>
          )}
          {record.details.taxReceipt && (
            <div className={styles.detail}>
              <Link href={record.details.taxReceipt}>
                <a>{t('taxReceipt')}</a>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* <div className={styles.borderBottom}></div> */}
      {selectedRecord === index && (
        <Modal
          disableBackdropClick
          hideBackdrop
          className={styles.modal}
          open={open}
          onClose={handleClose}
        >
          <div className={styles.expandedRecord}>
            <div
              onClick={() => {
                selectRecord1(index);
              }}
              className={styles.closeRecord}
            >
              <BackButton style={{}} />
            </div>
            <div className={styles.recordHeader}>
              <div className={styles.treesDate}>
                <p className={styles.treesDonated}>
                  {getFormattedNumber(i18n.language, record.treeCount)}{' '}
                </p>
                <p className={styles.donationDate}>
                  {formatDate(record.created)}
                </p>
              </div>
              <div className={styles.statusAmount}>
                <div className={styles.recordStatus}>
                  {getFormatedCurrency(
                    i18n.language,
                    record.currency,
                    record.amount
                  )}
                </div>

                <div>{t(record.status)}</div>
              </div>
            </div>
            <div className={styles.recordContainer}>
              {record.type === 'app-payout' ? (
                <AppPayoutDetails detail={record} t={t} i18n={i18n} />
              ) : (
                record.details && (
                  <RecordDetails
                    detail={record.details}
                    t={t}
                    i18n={i18n}
                    currency={record.currency}
                  />
                )
              )}
            </div>
            <div className={styles.recordDownloads}>
              {record.details.donorCertificate && (
                <div className={styles.detail}>
                  <Link href={record.details.donorCertificate}>
                    <a>{t('donorCertificate')}</a>
                  </Link>
                </div>
              )}
              {record.details.recipientCertificate && (
                <div className={styles.detail}>
                  <Link href={record.details.recipientCertificate}>
                    <a>{t('recipientCertificate')}</a>
                  </Link>
                </div>
              )}
              {record.details.taxReceipt && (
                <div className={styles.detail}>
                  <Link href={record.details.taxReceipt}>
                    <a>{t('taxReceipt')}</a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function RecordDetails({ detail, t, i18n, currency }: any) {
  return (
    <>
      {detail.amount && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('amount')}</p>
          <div className={styles.detailValue}>
            {getFormatedCurrency(i18n.language, currency, detail.amount)}
          </div>
        </div>
      )}
      {detail.created && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('created')}</p>
          <div className={styles.detailValue}>{formatDate(detail.created)}</div>
        </div>
      )}
      {detail.project && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('project')}</p>
          <div className={styles.detailValue}>{detail.project}</div>
        </div>
      )}
      {detail.method && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('method')}</p>
          <div className={styles.detailValue}>{detail.method}</div>
        </div>
      )}
      {detail.treeCost && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('treeCost')}</p>
          <div className={styles.detailValue}>
            {getFormatedCurrency(i18n.language, currency, detail.treeCost)}
          </div>
        </div>
      )}
      {detail.treeCount && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('treeCount')}</p>
          <div className={styles.detailValue}>
            {getFormattedNumber(i18n.language, detail.treeCount)}
          </div>
        </div>
      )}
      {detail.lastUpdate && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('lastUpdate')}</p>
          <div className={styles.detailValue}>
            {formatDate(detail.lastUpdate)}
          </div>
        </div>
      )}
      {detail.giftMessage && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('giftMessage')}</p>
          <div className={styles.detailValue}>{detail.giftMessage}</div>
        </div>
      )}
      {detail.giftRecipient && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('giftRecipient')}</p>
          <div className={styles.detailValue}>{detail.giftRecipient}</div>
        </div>
      )}
      {detail.refundAmount && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('refundAmount')}</p>
          <div className={styles.detailValue}>{detail.refundAmount}</div>
        </div>
      )}
      {detail.taxDeductibleReceipt && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('taxDeductibleReceipt')}</p>
          <div className={styles.detailValue}>
            {detail.taxDeductibleReceipt}
          </div>
        </div>
      )}
    </>
  );
}

function AppPayoutDetails({ detail, t, i18n }: any) {
  return (
    <>
      {detail.reference && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('reference')}</p>
          <div className={styles.detailValue}>{detail.reference}</div>
        </div>
      )}
      {detail.amount && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('amount')}</p>
          <div className={styles.detailValue}>
            {getFormatedCurrency(i18n.language, currency, detail.amount)}
          </div>
        </div>
      )}
      {detail.fee && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('fee')}</p>
          <div className={styles.detailValue}>
            {getFormatedCurrency(i18n.language, currency, detail.fee)}
          </div>
        </div>
      )}
      {detail.net && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('net')}</p>
          <div className={styles.detailValue}>
            {getFormatedCurrency(i18n.language, currency, detail.net)}
          </div>
        </div>
      )}
      {detail.status && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('status')}</p>
          <div className={styles.detailValue}>{detail.status}</div>
        </div>
      )}
      {detail.paymentDate && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('paymentDate')}</p>
          <div className={styles.detailValue}>
            {formatDate(detail.paymentDate)}
          </div>
        </div>
      )}
      {detail.created && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('created')}</p>
          <div className={styles.detailValue}>{formatDate(detail.created)}</div>
        </div>
      )}
      {detail.updated && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('updated')}</p>
          <div className={styles.detailValue}>{formatDate(detail.updated)}</div>
        </div>
      )}
      {detail.backAccount && detail.bankAccount.bankName && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('bankName')}</p>
          <div className={styles.detailValue}>{detail.bankName}</div>
        </div>
      )}
      {detail.backAccount && detail.bankAccount.accountHolder && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('accountHolder')}</p>
          <div className={styles.detailValue}>{detail.accountHolder}</div>
        </div>
      )}
      {detail.backAccount && detail.bankAccount.aba && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('aba')}</p>
          <div className={styles.detailValue}>{detail.aba}</div>
        </div>
      )}
      {detail.backAccount && detail.bankAccount.bic && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('bic')}</p>
          <div className={styles.detailValue}>{detail.bic}</div>
        </div>
      )}
      {detail.backAccount && detail.bankAccount.iban && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('iban')}</p>
          <div className={styles.detailValue}>{detail.iban}</div>
        </div>
      )}
      {detail.backAccount && detail.bankAccount.swift && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('swift')}</p>
          <div className={styles.detailValue}>{detail.swift}</div>
        </div>
      )}
      {detail.backAccount && detail.bankAccount.isDefault && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('isDefault')}</p>
          <div className={styles.detailValue}>
            {detail.isDefault === 0 ? 'no' : 'yes'}
          </div>
        </div>
      )}
      {detail.backAccount && detail.bankAccount.created && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('bankAccountCreated')}</p>
          <div className={styles.detailValue}>{detail.created}</div>
        </div>
      )}
      {detail.backAccount && detail.bankAccount.updated && (
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>{t('bankAccountUpdated')}</p>
          <div className={styles.detailValue}>{detail.updated}</div>
        </div>
      )}
    </>
  );
}

export default PaymentRecord;

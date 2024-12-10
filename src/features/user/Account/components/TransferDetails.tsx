import type { ReactElement } from 'react';
import type { BankAccount } from '../../../common/types/payments';

import { useTranslations } from 'next-intl';
import styles from '../AccountHistory.module.scss';

interface TransferDetailsProps {
  account: BankAccount;
}

export default function TransferDetails({
  account,
}: TransferDetailsProps): ReactElement {
  const t = useTranslations('Me');
  return (
    <>
      <div className={styles.title}>{t('transferDetails')}</div>
      <div className={styles.detailGrid}>
        {account.beneficiary && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{t('beneficiary')}</p>
            <p>{account.beneficiary}</p>
          </div>
        )}
        {account.iban && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{t('iban')}</p>
            <p>{account.iban}</p>
          </div>
        )}
        {account.bic && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{t('bic')}</p>
            <p>{account.bic}</p>
          </div>
        )}
        {account.bankName && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{t('bankName')}</p>
            <p>{account.bankName}</p>
          </div>
        )}
        {account.swift && account?.swift !== 'swift' && (
          <div className={styles.singleDetail}>
            <p className={styles.title}>{t('swift')}</p>
            <p>{account.swift}</p>
          </div>
        )}
      </div>
    </>
  );
}

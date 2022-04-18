import React, { ReactElement } from 'react';
import i18next from '../../../../i18n';

import FormSteps from './FormSteps';
import BulkMethodSelector from './components/BulkMethodSelector';

import styles from './BulkCodes.module.scss';

interface Props {}

const { useTranslation } = i18next;

export default function BulkCodes({}: Props): ReactElement | null {
  const { t, ready } = useTranslation(['bulkCodes']);
  return ready ? (
    <div className="profilePage">
      <h2 className={'profilePageTitle'}>{t('bulkCodes:bulkCodes')}</h2>
      <div className={'profilePageSubTitle'}>
        {t('bulkCodes:bulkCodesDescription1')}
        <br />
        {t('bulkCodes:bulkCodesDescription2')}
      </div>
      <main className={styles.contentContainer}>
        <FormSteps />
        <div className={styles.formContainer}>
          <BulkMethodSelector />
        </div>
      </main>
    </div>
  ) : null;
}

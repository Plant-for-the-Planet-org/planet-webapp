import React from 'react';
import i18next from '../../../../i18n';
interface Props {}

const { useTranslation } = i18next;

export default function BulkCodes({}: Props) {
  const { t, ready } = useTranslation(['bulkCodes']);
  return ready ? (
    <div className="profilePage">
      <h2 className={'profilePageTitle'}>{t('bulkCodes:bulkCodes')}</h2>
      <div className={'profilePageSubTitle'}>
        {t('bulkCodes:bulkCodesDescription1')}
        <br />
        {t('bulkCodes:bulkCodesDescription2')}
      </div>
    </div>
  ) : null;
}

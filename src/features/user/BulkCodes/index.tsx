import React, { ReactElement } from 'react';
import i18next from '../../../../i18n';
// import { styled } from 'mui-latest';

import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from './TabbedView';
import BulkMethodSelector from './components/BulkMethodSelector';

import styles from './BulkCodes.module.scss';

interface Props {}

const { useTranslation } = i18next;

export default function BulkCodes({}: Props): ReactElement | null {
  const { t, ready } = useTranslation(['bulkCodes']);
  return ready ? (
    <DashboardView
      title={t('bulkCodes:bulkCodes')}
      subtitle={
        <p>
          {t('bulkCodes:bulkCodesDescription1')}
          <br />
          {t('bulkCodes:bulkCodesDescription2')}
        </p>
      }
    >
      <TabbedView>
        <BulkMethodSelector />
      </TabbedView>
    </DashboardView>
  ) : null;
}

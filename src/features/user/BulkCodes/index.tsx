import React, { ReactElement } from 'react';
import i18next from '../../../../i18n';

import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from './TabbedView';
import CreationMethodForm from './components/CreationMethodForm';
import SelectProjectForm from './components/SelectProjectForm';
import IssueCodesForm from './components/IssueCodesForm';

interface BulkCodesProps {
  step: 0 | 1 | 2;
}

const { useTranslation } = i18next;

export default function BulkCodes({
  step,
}: BulkCodesProps): ReactElement | null {
  const { t, ready } = useTranslation(['bulkCodes']);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <CreationMethodForm />;
      case 1:
        return <SelectProjectForm />;
      case 2:
        return <IssueCodesForm />;
      default:
        return <CreationMethodForm />;
    }
  };

  return ready ? (
    <DashboardView
      title={t('bulkCodes:bulkCodesTitle')}
      subtitle={
        <p>
          {t('bulkCodes:bulkCodesDescription1')}
          <br />
          {t('bulkCodes:bulkCodesDescription2')}
        </p>
      }
    >
      <TabbedView step={step}>{renderStep()}</TabbedView>
    </DashboardView>
  ) : null;
}

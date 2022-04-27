import React, { ReactElement, useState } from 'react';
import i18next from '../../../../i18n';

import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from './TabbedView';
import CreationMethodForm from './components/CreationMethodForm';
import SelectProjectForm from './components/SelectProjectForm';
import IssueCodesForm from './components/IssueCodesForm';

import { BulkCodeProvider } from '../../common/Layout/BulkCodeContext';

interface Props {}

const { useTranslation } = i18next;

export default function BulkCodes({}: Props): ReactElement | null {
  const { t, ready } = useTranslation(['bulkCodes']);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [project, setProject] = useState<string | null>(null);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <CreationMethodForm setStep={setStep} />;
      case 1:
        return (
          <SelectProjectForm
            setStep={setStep}
            project={project}
            setProject={setProject}
          />
        );
      case 2:
        return <IssueCodesForm project={project} />;
      default:
        return <CreationMethodForm setStep={setStep} />;
    }
  };

  return ready ? (
    <BulkCodeProvider>
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
        <TabbedView>{renderStep()}</TabbedView>
      </DashboardView>
    </BulkCodeProvider>
  ) : null;
}

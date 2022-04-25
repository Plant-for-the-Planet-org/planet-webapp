import React, { ReactElement, useState } from 'react';
import i18next from '../../../../i18n';

import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from './TabbedView';
import BulkMethodSelector from './components/BulkMethodSelector';
import ProjectSelector from './components/ProjectSelector';

interface Props {
  // step: 0 | 1 | 2;
  // setStep: (step: 0 | 1 | 2) => void;
}

const { useTranslation } = i18next;

export default function BulkCodes({}: Props): ReactElement | null {
  const { t, ready } = useTranslation(['bulkCodes']);
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <BulkMethodSelector setStep={setStep} />;
      case 1:
        return <ProjectSelector setStep={setStep} />;
      case 2:
        return <div>Step 3 will come here</div>;
      default:
        return <BulkMethodSelector setStep={setStep} />;
    }
  };

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
      <TabbedView>{renderStep()}</TabbedView>
    </DashboardView>
  ) : null;
}

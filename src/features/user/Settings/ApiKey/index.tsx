import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import DashboardView from '../../../common/Layout/DashboardView';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import ApiKeyForm from './ApiKeyForm';

export default function ApiKey(): ReactElement | null {
  const t = useTranslations('Me');

  return (
    <DashboardView
      title={t('apiKey')}
      subtitle={
        <div>
          <p>{t('apiKeyMessage1')}</p>
          <p>{t('apiKeyMessage3')}</p>
        </div>
      }
    >
      <SingleColumnView>
        <CenteredContainer>
          <ApiKeyForm />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
}

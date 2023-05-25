import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import DashboardView from '../../../common/Layout/DashboardView';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import ApiKeyForm from './ApiKeyForm';

export default function ApiKey(): ReactElement | null {
  const { t, ready } = useTranslation('me');

  return ready ? (
    <DashboardView
      title={t('apiKey')}
      subtitle={
        <div>
          <p>{t('me:apiKeyMessage1')}</p>
          <p>{t('me:apiKeyMessage3')}</p>
        </div>
      }
    >
      <SingleColumnView>
        <CenteredContainer>
          <ApiKeyForm />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  ) : null;
}

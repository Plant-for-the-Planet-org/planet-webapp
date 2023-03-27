import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import ImpersonateUserForm from './ImpersonateUserForm';

const ImpersonateUser = (): ReactElement => {
  const { t } = useTranslation('me');

  return (
    <DashboardView
      title={t('me:switchUser')}
      subtitle={t('me:switchUserMessage')}
    >
      <SingleColumnView>
        <CenteredContainer>
          <ImpersonateUserForm />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
};

export default ImpersonateUser;

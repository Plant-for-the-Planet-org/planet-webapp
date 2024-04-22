import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import ImpersonateUserForm from './ImpersonateUserForm';

const ImpersonateUser = (): ReactElement => {
  const t = useTranslations('Me');

  return (
    <DashboardView title={t('switchUser')} subtitle={t('switchUserMessage')}>
      <SingleColumnView>
        <CenteredContainer>
          <ImpersonateUserForm />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
};

export default ImpersonateUser;

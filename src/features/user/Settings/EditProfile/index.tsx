import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import DashboardView from '../../../common/Layout/DashboardView';
import EditProfileForm from './EditProfileForm';

export default function (): ReactElement | null {
  const { t, ready } = useTranslation('me');

  return ready ? (
    <DashboardView title={t('editProfile')} subtitle={null} variant="compact">
      <CenteredContainer>
        <EditProfileForm />
      </CenteredContainer>
    </DashboardView>
  ) : null;
}

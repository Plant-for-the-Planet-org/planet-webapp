import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import DashboardView from '../../../common/Layout/DashboardView';
import EditProfileForm from './EditProfileForm';

export default function (): ReactElement | null {
  const t = useTranslations('Me');

  return (
    <DashboardView title={t('editProfile')} subtitle={null} variant="compact">
      <CenteredContainer>
        <EditProfileForm />
      </CenteredContainer>
    </DashboardView>
  );
}

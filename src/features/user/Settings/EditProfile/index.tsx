import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import DashboardView from '../../../common/Layout/DashboardView';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import EditProfileForm from './EditProfileForm';

export default function (): ReactElement | null {
  const { t, ready } = useTranslation('me');

  return ready ? (
    <DashboardView title={t('editProfile')} subtitle={null} type="other">
      <SingleColumnView>
        <CenteredContainer>
          <EditProfileForm />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  ) : null;
}

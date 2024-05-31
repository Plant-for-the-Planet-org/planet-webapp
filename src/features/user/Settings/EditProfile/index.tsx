import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import DashboardView from '../../../common/Layout/DashboardView';
import EditProfileForm from './EditProfileForm';
import SingleColumnView from '../../../common/Layout/SingleColumnView';

export default function EditProfile(): ReactElement | null {
  const t = useTranslations('Me');

  return (
    <DashboardView title={t('editProfile')} subtitle={null}>
      <SingleColumnView>
        <CenteredContainer>
          <EditProfileForm />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
}

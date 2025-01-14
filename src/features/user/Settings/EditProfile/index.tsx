import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import DashboardView from '../../../common/Layout/DashboardView';
import EditProfileForm from './EditProfileForm';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import AddressManagement from './AddressManagement';

export default function EditProfile(): ReactElement {
  const t = useTranslations('Me');

  return (
    <DashboardView title={t('editProfile')} subtitle={null}>
      <SingleColumnView>
        <CenteredContainer>
          <EditProfileForm />
        </CenteredContainer>
        <AddressManagement />
      </SingleColumnView>
    </DashboardView>
  );
}

import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import DashboardView from '../../../common/Layout/DashboardView';
import EditProfileForm from './EditProfileForm';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import AddressManagement from './AddressManagment';

export default function EditProfile(): ReactElement | null {
  const t = useTranslations('Me');
  const tProfile = useTranslations('Profile');

  return (
    <>
      <DashboardView title={t('editProfile')} subtitle={null}>
        <SingleColumnView>
          <CenteredContainer>
            <EditProfileForm />
          </CenteredContainer>
        </SingleColumnView>
      </DashboardView>
      <DashboardView
        title={tProfile('addressManagement.address')}
        subtitle={null}
      >
        <SingleColumnView>
          <CenteredContainer>
            <AddressManagement />
          </CenteredContainer>
        </SingleColumnView>
      </DashboardView>
    </>
  );
}

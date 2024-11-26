import { useTranslations } from 'next-intl';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import DashboardView from '../../../common/Layout/DashboardView';
import EditProfileForm from './EditProfileForm';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import AddressManagement from './AddressManagment';

export default function EditProfile(): React.ReactElement | null {
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

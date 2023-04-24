import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import DeleteProfileForm from './DeleteProfileForm';

export default function DonationLink(): ReactElement | null {
  const { t, ready } = useTranslation('me');

  return ready ? (
    <DashboardView title={t('deleteProfile')} subtitle={null}>
      <SingleColumnView>
        <DeleteProfileForm />
      </SingleColumnView>
    </DashboardView>
  ) : null;
}

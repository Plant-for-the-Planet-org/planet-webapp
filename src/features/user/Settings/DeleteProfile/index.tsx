import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import DeleteProfileForm from './DeleteProfileForm';
import CenteredContainer from '../../../common/Layout/CenteredContainer';

export default function DonationLink(): ReactElement | null {
  const t = useTranslations('Me');

  return (
    <DashboardView title={t('deleteProfile')} subtitle={null}>
      <SingleColumnView>
        <CenteredContainer>
          <DeleteProfileForm />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
}

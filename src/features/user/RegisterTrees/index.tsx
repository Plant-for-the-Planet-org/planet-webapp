import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import SingleColumnView from '../../common/Layout/SingleColumnView';
import RegisterTreesForm from './RegisterTreesForm';

export default function RegisterTrees(): ReactElement | null {
  const { t, ready } = useTranslation('me');

  return ready ? (
    <DashboardView title={t('registerTrees')} subtitle={null}>
      <SingleColumnView>
        <RegisterTreesForm />
      </SingleColumnView>
    </DashboardView>
  ) : null;
}

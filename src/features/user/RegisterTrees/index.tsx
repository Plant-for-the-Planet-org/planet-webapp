import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import SingleColumnView from '../../common/Layout/SingleColumnView';
import RegisterTreesWidget from './RegisterTreesWidget';
import CenteredContainer from '../../common/Layout/CenteredContainer';

export default function RegisterTrees(): ReactElement | null {
  const { t, ready } = useTranslation('me');

  return ready ? (
    <DashboardView title={t('registerTrees')} subtitle={null}>
      <SingleColumnView>
        <CenteredContainer>
          <RegisterTreesWidget />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  ) : null;
}

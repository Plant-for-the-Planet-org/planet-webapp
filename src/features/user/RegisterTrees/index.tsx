import type { ReactElement } from 'react';

import { useTranslations } from 'next-intl';
import DashboardView from '../../common/Layout/DashboardView';
import SingleColumnView from '../../common/Layout/SingleColumnView';
import RegisterTreesWidget from './RegisterTreesWidget';
import CenteredContainer from '../../common/Layout/CenteredContainer';

export default function RegisterTrees(): ReactElement | null {
  const t = useTranslations('Me');

  return (
    <DashboardView title={t('registerTrees')} subtitle={null}>
      <SingleColumnView>
        <CenteredContainer>
          <RegisterTreesWidget />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
}

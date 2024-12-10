import type { ReactElement } from 'react';

import React from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import MySpeciesForm from './MySpeciesForm';
import { useTranslations } from 'next-intl';

export default function MySpecies(): ReactElement {
  const t = useTranslations('Me');

  return (
    <DashboardView title={t('mySpecies')} subtitle={null} variant="compact">
      <CenteredContainer>
        <MySpeciesForm />
      </CenteredContainer>
    </DashboardView>
  );
}

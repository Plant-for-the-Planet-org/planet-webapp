import React, { ReactElement } from 'react';
import DashboardView from '../../../common/Layout/DashboardView';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import MySpeciesForm from './MySpeciesForm';
import { useTranslation } from 'next-i18next';

interface Props {}

export default function MySpecies({}: Props): ReactElement {
  const { t } = useTranslation('me');

  return (
    <DashboardView title={t('me:mySpecies')} subtitle={null} variant="compact">
      <CenteredContainer>
        <MySpeciesForm />
      </CenteredContainer>
    </DashboardView>
  );
}

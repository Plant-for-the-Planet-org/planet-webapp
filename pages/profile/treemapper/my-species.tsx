import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import i18next from '../../../i18n';
import MySpecies from '../../../src/features/user/TreeMapper/MySpecies';

const { useTranslation } = i18next;

interface Props {}

export default function MySpeciesPage({}: Props): ReactElement {
  const { t } = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{t('mySpecies')}</title>
      </Head>
      <MySpecies />
    </UserLayout>
  );
}

import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
<<<<<<< HEAD
import { useTranslation } from 'next-i18next';
import MySpecies from '../../../src/features/user/TreeMapper/MySpecies';

=======
import i18next from '../../../i18n';
import MySpecies from '../../../src/features/user/TreeMapper/MySpecies';

const { useTranslation } = i18next;

>>>>>>> develop
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

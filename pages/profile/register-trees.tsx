import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import  Head from 'next/head';
import i18next from '../../i18n';

const {useTranslation} = i18next;

interface Props {}

export default function Register({}: Props): ReactElement {
  const {t} = useTranslation('me');
  const RegisterTrees = dynamic(
    () => import('../../src/features/user/RegisterTrees/RegisterTrees')
  );
  return (
    <UserLayout>
      <Head>
        <title>{t('registerTrees')}</title>
      </Head>
      <RegisterTrees />
    </UserLayout>
  );
}

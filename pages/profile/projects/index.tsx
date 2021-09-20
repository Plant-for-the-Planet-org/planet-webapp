import React, { ReactElement } from 'react';
import ProjectsContainer from '../../../src/features/user/ManageProjects/ProjectsContainer';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import  Head from 'next/head';
import i18next from '../../../i18n';

const {useTranslation} = i18next;

interface Props {}
export default function Register({}: Props): ReactElement {
  const {t} = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{t('projects')}</title>
      </Head>
      <ProjectsContainer />
    </UserLayout>
  );
}

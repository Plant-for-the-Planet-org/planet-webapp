import React, { ReactElement } from 'react';
import ProjectsContainer from '../../../src/features/user/ManageProjects/ProjectsContainer';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import  Head from 'next/head';

interface Props {}
export default function Register({}: Props): ReactElement {
  return (
    <UserLayout>
      <Head>
        <title>{'Projects'}</title>
      </Head>
      <ProjectsContainer />
    </UserLayout>
  );
}

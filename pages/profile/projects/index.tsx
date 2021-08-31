import React, { ReactElement } from 'react';
import ProjectsContainer from '../../../src/features/user/ManageProjects/ProjectsContainer';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';

interface Props {}
export default function Register({}: Props): ReactElement {
  return (
    <UserLayout>
      <ProjectsContainer />
    </UserLayout>
  );
}

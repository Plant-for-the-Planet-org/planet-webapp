import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';

interface Props {}

export default function Register({}: Props): ReactElement {
  const RegisterTrees = dynamic(
    () => import('../../src/features/user/RegisterTrees/RegisterTrees')
  );
  return (
    <UserLayout>
      <RegisterTrees />
    </UserLayout>
  );
}

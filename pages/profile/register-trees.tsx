import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import UserLayout from '../../src/features/user/UserLayout';

interface Props {}

export default function Register({}: Props): ReactElement {
  const RegisterTrees = dynamic(
    () => import('../../src/features/user/Profile/components/RegisterTrees')
  );
  return (
    <UserLayout>
      <RegisterTrees />
    </UserLayout>
  );
}

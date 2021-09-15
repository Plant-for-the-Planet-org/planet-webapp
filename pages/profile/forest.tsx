import  Head from 'next/head';
import React, { ReactElement, useEffect } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import MyTrees from '../../src/features/user/Profile/components/MyTrees/MyTrees';
import i18next from '../../i18n';

const {useTranslation} = i18next;

function ProfilePage(): ReactElement {
  const {t} = useTranslation('me');
  // External imports
  const { user, contextLoaded, token } = React.useContext(UserPropsContext);

  // Internal states
  const [profile, setProfile] = React.useState<null | Object>();
  const [authenticatedType, setAuthenticatedType] = React.useState('');

  useEffect(() => {
    if (user && contextLoaded) {
      setProfile(user);
      setAuthenticatedType('private');
    }
  }, [contextLoaded, user]);

  return (
    <UserLayout>
      <Head>
        <title>{t('myForest')}</title>
      </Head>
      {profile && (
        <MyTrees
          authenticatedType={authenticatedType}
          profile={profile}
          token={token}
        />
      )}
    </UserLayout>
  );
}

export default ProfilePage;

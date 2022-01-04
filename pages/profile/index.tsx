import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import Profile from '../../src/features/user/Profile';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import MyTrees from '../../src/features/user/Profile/components/MyTrees/MyTrees';
import Head from 'next/head';
import i18next from '../../i18n';
import ChatwootWidget from '../../src/features/user/ChatwootWidget';

const { useTranslation } = i18next;

function ProfilePage(): ReactElement {
  const { t } = useTranslation('me');
  // External imports
  const router = useRouter();
  const { user, contextLoaded, token } = React.useContext(UserPropsContext);

  // Internal states
  const [profile, setProfile] = React.useState<null | Object>();
  const [authenticatedType, setAuthenticatedType] = React.useState('');

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
        setAuthenticatedType('private');
        window.addEventListener('chatwoot:ready', function () {
          window.$chatwoot.setCustomAttributes({
            language: user.locale ? user.locale : 'en',
            profile_guid: user.id,
            email: user.email,
            name: user.displayName,
            // Here the key which is already defined in custom attribute
            // Value should be based on type (Currently support Number, Date, String and Number)
          });
        });
      }
    }
  }, [contextLoaded, user, router]);


  return (
    <UserLayout>
      <Head>
        <title>{t('profile')}</title>
      </Head>
      {profile && (
        <>
          <Profile
            userprofile={profile}
            authenticatedType={authenticatedType}
          />
          <MyTrees
            authenticatedType={authenticatedType}
            profile={profile}
            token={token}
          />
          <ChatwootWidget />
        </>
      )}
    </UserLayout>
  );
}

export default ProfilePage;

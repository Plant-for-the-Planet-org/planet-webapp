import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { useUserProps } from '../../../../src/features/common/Layout/UserPropsContext';
import Profile from '../../../../src/features/user/ProfileV2/components/ProfileBox';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import MyContributions from '../../../../src/features/user/ProfileV2/components/MyContributions';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { User } from '@planet-sdk/common';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { MyForestProvider } from '../../../../src/features/common/Layout/MyForestContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../tenant.config';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import myProfileStyle from '../../../../src/features/user/ProfileV2/styles/MyProfile.module.scss';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function ProfilePage({ pageProps: { tenantConfig } }: Props): ReactElement {
  const { t } = useTranslation('me');
  // External imports
  const router = useRouter();
  const { user, contextLoaded } = useUserProps();
  const { setTenantConfig } = useTenant();

  // Internal states
  const [profile, setProfile] = React.useState<null | User>();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
      }
    }
  }, [contextLoaded, user, router]);

  return (
    tenantConfig && (
      <UserLayout>
        <Head>
          <title>{t('profile')}</title>
        </Head>
        {profile && (
          <>
            <MyForestProvider>
              <div className={myProfileStyle.profileContainer}>
                <Profile userProfile={profile} />
                <MyContributions profile={profile} />
              </div>
            </MyForestProvider>
          </>
        )}
      </UserLayout>
    )
  );
}

export default ProfilePage;

export async function getStaticPaths() {
  const paths = await constructPathsForTenantSlug();
  return {
    paths: paths,
    fallback: 'blocking',
  };
}

interface StaticProps {
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
          'profile',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      tenantConfig,
    },
  };
};

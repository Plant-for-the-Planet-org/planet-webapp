import type { AbstractIntlMessages } from 'next-intl';
import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import ManageProjects from '../../../../../../src/features/user/ManageProjects';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../../../../src/features/common/Layout/Footer';
import Head from 'next/head';
import { constructPathsForTenantSlug } from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../../src/stores/tenantStore';

export default function AddProjectType(): ReactElement {
  const t = useTranslations('ManageProjects');
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [setupAccess, setSetupAccess] = useState<boolean>(false);
  const { user, contextLoaded, token, loginWithRedirect } = useUserProps();
  // store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  useEffect(() => {
    async function loadUserData() {
      const userType = user?.type;
      if (userType === 'tpo') {
        setAccessDenied(false);
        setSetupAccess(true);
      } else {
        setAccessDenied(true);
        setSetupAccess(true);
      }
    }

    if (contextLoaded) {
      if (token && user) {
        loadUserData();
      } else {
        localStorage.setItem(
          'redirectLink',
          '/profile/projects/add-project/restoration-project'
        );
        loginWithRedirect({
          redirectUri: `${window.location.origin}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
  }, [contextLoaded]);

  // User is not TPO
  if (tenantConfig && accessDenied && setupAccess) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    );
  }
  if (!tenantConfig) return <></>;

  return (
    <UserLayout>
      <Head>
        <title>{t('addNewProject')}</title>
      </Head>

      {user?.type === 'tpo' && token !== null ? (
        <ManageProjects token={token} />
      ) : (
        <AccessDeniedLoader />
      )}
    </UserLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          locale: 'en',
        },
      };
    }) ?? [];

  return {
    paths,
    fallback: 'blocking',
  };
};

interface PageProps {
  messages: AbstractIntlMessages;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'manageProjects'],
  });

  return {
    props: {
      messages,
    },
  };
};

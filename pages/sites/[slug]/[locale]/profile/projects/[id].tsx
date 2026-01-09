import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type { APIError } from '@planet-sdk/common';
import type { ExtendedProfileProjectProperties } from '../../../../../../src/features/common/types/project';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import ManageProjects from '../../../../../../src/features/user/ManageProjects';
import GlobeContentLoader from '../../../../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../../../../src/features/common/Layout/Footer';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { ErrorHandlingContext } from '../../../../../../src/features/common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { defaultTenant } from '../../../../../../tenant.config';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../../../src/hooks/useApi';
import { useTenantStore } from '../../../../../../src/stores/tenantStore';

interface Props {
  pageProps: PageProps;
}

function ManageSingleProject({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const t = useTranslations('Common');
  const router = useRouter();
  const { getApiAuthenticated } = useApi();
  const { user, contextLoaded, token } = useUserProps();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  // local state
  const [projectGUID, setProjectGUID] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [setupAccess, setSetupAccess] = useState<boolean>(false);
  const [project, setProject] =
    useState<ExtendedProfileProjectProperties | null>(null);
  // store: action
  const setTenantConfig = useTenantStore((state) => state.setTenantConfig);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (router.query.id && !Array.isArray(router.query.id)) {
      setProjectGUID(router.query.id);
      setReady(true);
    }
  }, [router.query.id]);

  useEffect(() => {
    async function loadProject() {
      try {
        const result =
          await getApiAuthenticated<ExtendedProfileProjectProperties>(
            `/app/profile/projects/${projectGUID}`
          );
        setProject(result);
        setSetupAccess(true);
      } catch (err) {
        setAccessDenied(true);
        setErrors(handleError(err as APIError));
        redirect('/profile');
      }
    }

    // ready is for router, loading is for session
    if (ready && contextLoaded && user) {
      loadProject();
    }
  }, [ready, contextLoaded, user]);

  if (tenantConfig && accessDenied && setupAccess) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    );
  }

  // Showing error to other TPOs is left

  return tenantConfig ? (
    setupAccess ? (
      ready && token && !accessDenied && projectGUID && project ? (
        <UserLayout>
          <Head>
            <title>{`${t('edit')} - ${project?.name}`}</title>
          </Head>
          <ManageProjects GUID={projectGUID} token={token} project={project} />
        </UserLayout>
      ) : (
        <UserLayout>
          <GlobeContentLoader />
        </UserLayout>
      )
    ) : (
      <UserLayout>
        <GlobeContentLoader />
      </UserLayout>
    )
  ) : (
    <></>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          id: v4(),
          locale: 'en',
        },
      };
    }) ?? [];

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

interface PageProps {
  messages: AbstractIntlMessages;
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'manageProjects'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

export default ManageSingleProject;

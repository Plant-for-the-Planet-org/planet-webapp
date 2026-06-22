import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type { APIError, Tenant } from '@planet-sdk/common';
import type { ExtendedProfileProjectProperties } from '../../../../../../src/features/common/types/project';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ManageProjects from '../../../../../../src/features/user/ManageProjects';
import GlobeContentLoader from '../../../../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../../../../src/features/common/Layout/Footer';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../../../src/hooks/useApi';
import { useTenantStore } from '../../../../../../src/stores/tenantStore';
import useLocalizedPath from '../../../../../../src/hooks/useLocalizedPath';
import { useErrorHandlingStore } from '../../../../../../src/stores/errorHandlingStore';
import { defaultTenant } from '../../../../../../tenant.config';

function ManageSingleProject(): ReactElement {
  const t = useTranslations('Common');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { getApiAuthenticated } = useApi();
  const { user, contextLoaded, token } = useUserProps();
  // local state
  const [projectGUID, setProjectGUID] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [setupAccess, setSetupAccess] = useState<boolean>(false);
  const [project, setProject] =
    useState<ExtendedProfileProjectProperties | null>(null);
  // store: state
  const isInitialized = useTenantStore((state) => state.isInitialized);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

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
        router.push(localizedPath('/profile'));
      }
    }

    // ready is for router, loading is for session
    if (ready && contextLoaded && user) {
      loadProject();
    }
  }, [ready, contextLoaded, user]);

  if (isInitialized && accessDenied && setupAccess) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    );
  }

  // Showing error to other TPOs is left

  return isInitialized ? (
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
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'maps', 'me', 'country', 'manageProjects'],
  });

  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

export default ManageSingleProject;

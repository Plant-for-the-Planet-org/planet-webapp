import React, { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import ManageProjects from '../../../../../src/features/user/ManageProjects';
import { getAuthenticatedRequest } from '../../../../../src/utils/apiRequests/api';
import GlobeContentLoader from '../../../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import AccessDeniedLoader from '../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../../../src/features/common/Layout/Footer';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { handleError, APIError } from '@planet-sdk/common';
import {
  ProfileProjectConservation,
  ProfileProjectTrees,
} from '../../../../../src/features/common/types/project';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../../tenant.config';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function ManageSingleProject({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const { t } = useTranslation(['manageProjects', 'common']);
  const [projectGUID, setProjectGUID] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState<boolean>(false);
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const [accessDenied, setAccessDenied] = React.useState<boolean>(false);
  const [setupAccess, setSetupAccess] = React.useState<boolean>(false);
  const [project, setProject] = React.useState<
    ProfileProjectTrees | ProfileProjectConservation | null
  >(null);
  const { user, contextLoaded, token, logoutUser } = useUserProps();
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (router && router.query.id && !Array.isArray(router.query.id)) {
      setProjectGUID(router.query.id);
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    async function loadProject() {
      try {
        const result = await getAuthenticatedRequest<
          ProfileProjectTrees | ProfileProjectConservation
        >(
          tenantConfig.id,
          `/app/profile/projects/${projectGUID}`,
          token,
          logoutUser
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
            <title>{`${t('common:edit')} - ${project?.name}`}</title>
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

export async function getStaticPaths() {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        id: v4(),
      },
    };
  });

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
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      tenantConfig,
    },
  };
};

export default ManageSingleProject;

import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next/types';
import { defaultTenant } from '../../../../../tenant.config';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import { ReactElement, useEffect } from 'react';
import ProjectsLayout from '../../../../../src/features/common/Layout/ProjectsLayout';
import Link from 'next/link';
import {
  NextPageWithLayout,
  PageComponentProps,
  PageProps,
} from '../../../../_app';
import MobileProjectsLayout from '../../../../../src/features/common/Layout/ProjectsLayout/MobileProjectsLayout';
import { useProjects } from '../../../../../src/features/projectsV2/ProjectsContext';

const ProjectListPage: NextPageWithLayout = ({ pageProps }) => {
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  const { projects, isLoading, isError } = useProjects();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  return (
    <div>
      <h2>ProjectListPage</h2>
      <Link href="/en/prd/lemon">Go to Details Page</Link>
      {!isLoading && !isError && projects !== null && (
        // To replace this with the project list
        <div>{projects.length} projects found</div>
      )}
    </div>
  );
};

ProjectListPage.getLayout = function getLayout(
  page: ReactElement,
  pageComponentProps: PageComponentProps
): ReactElement {
  const layoutProps = {
    currencyCode: pageComponentProps.currencyCode,
    setCurrencyCode: pageComponentProps.setCurrencyCode,
    page: 'project-list',
  } as const;

  return pageComponentProps.isMobile ? (
    <MobileProjectsLayout {...layoutProps}>{page}</MobileProjectsLayout>
  ) : (
    <ProjectsLayout {...layoutProps}>{page}</ProjectsLayout>
  );
};

export default ProjectListPage;

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        locale: 'en',
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'maps', 'country'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

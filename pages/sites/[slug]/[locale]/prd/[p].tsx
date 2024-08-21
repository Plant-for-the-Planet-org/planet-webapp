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
import { v4 } from 'uuid';
import Link from 'next/link';
import ProjectsLayout from '../../../../../src/features/common/Layout/ProjectsLayout';
import {
  NextPageWithLayout,
  PageComponentProps,
  PageProps,
} from '../../../../_app';
import MobileProjectsLayout from '../../../../../src/features/common/Layout/ProjectsLayout/MobileProjectsLayout';
import { useProjects } from '../../../../../src/features/projectsV2/ProjectsContext';

const ProjectDetailsPage: NextPageWithLayout = ({ pageProps }) => {
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const { setSelectedClassification, setDebouncedSearchValue } = useProjects();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  //* a temporary hook that will be removed in the future
  useEffect(() => {
    setSelectedClassification([]);
    setDebouncedSearchValue('');
  }, []);

  return (
    <div>
      <h2>ProjectDetailsPage</h2>
      <Link href="/en/prd">Go to List Page</Link>
    </div>
  );
};

ProjectDetailsPage.getLayout = function getLayout(
  page: ReactElement,
  pageComponentProps: PageComponentProps
): ReactElement {
  const layoutProps = {
    currencyCode: pageComponentProps.currencyCode,
    setCurrencyCode: pageComponentProps.setCurrencyCode,
    page: 'project-list',
    isMobile: pageComponentProps.isMobile,
  } as const;
  return pageComponentProps.isMobile ? (
    <MobileProjectsLayout {...layoutProps}>{page}</MobileProjectsLayout>
  ) : (
    <ProjectsLayout {...layoutProps}>{page}</ProjectsLayout>
  );
};

export default ProjectDetailsPage;

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths?.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        p: v4(),
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
    filenames: ['common', 'maps', 'allProjects'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

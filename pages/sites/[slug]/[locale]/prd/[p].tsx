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

const ProjectDetailsPage: NextPageWithLayout = ({ pageProps }) => {
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

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
  return pageComponentProps.isMobile ? (
    // Temp div, remove when implementing mobile layout
    <div className="mobile-layout" style={{ marginTop: '100px' }}>
      {page}
    </div>
  ) : (
    <ProjectsLayout setCurrencyCode={pageComponentProps.setCurrencyCode}>
      {page}
    </ProjectsLayout>
  );
};

export default ProjectDetailsPage;

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
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
    filenames: ['common', 'maps'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

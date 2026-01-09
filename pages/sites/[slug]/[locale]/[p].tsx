import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next/types';
import type { ReactElement } from 'react';
import type {
  NextPageWithLayout,
  PageComponentProps,
  PageProps,
} from '../../../_app';

import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { v4 } from 'uuid';
import ProjectsLayout from '../../../../src/features/common/Layout/ProjectsLayout';
import MobileProjectsLayout from '../../../../src/features/common/Layout/ProjectsLayout/MobileProjectsLayout';
import ProjectDetails from '../../../../src/features/projectsV2/ProjectDetails';
import { useTenantStore } from '../../../../src/stores/tenantStore';

const ProjectDetailsPage: NextPageWithLayout = ({
  pageProps,
  currencyCode,
  isMobile,
}) => {
  const router = useRouter();
  const setTenantConfig = useTenantStore((state) => state.setTenantConfig);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  return <ProjectDetails currencyCode={currencyCode} isMobile={isMobile} />;
};

ProjectDetailsPage.getLayout = function getLayout(
  page: ReactElement,
  pageComponentProps: PageComponentProps
): ReactElement {
  const layoutProps = {
    currencyCode: pageComponentProps.currencyCode,
    setCurrencyCode: pageComponentProps.setCurrencyCode,
    page: 'project-details',
    isMobile: pageComponentProps.isMobile,
  } as const;
  return pageComponentProps.isMobile ? (
    <MobileProjectsLayout {...layoutProps}>{page}</MobileProjectsLayout>
  ) : (
    <ProjectsLayout {...layoutProps}>{page}</ProjectsLayout>
  );
};

export default ProjectDetailsPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          p: v4(),
          locale: 'en',
        },
      };
    }) ?? [];

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
    filenames: [
      'common',
      'maps',
      'allProjects',
      'projectDetails',
      'donate',
      'country',
      'project',
      'me',
    ],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

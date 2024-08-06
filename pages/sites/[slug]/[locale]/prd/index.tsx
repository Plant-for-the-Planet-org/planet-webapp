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
import {
  NextPageWithLayout,
  PageComponentProps,
  PageProps,
} from '../../../../_app';
import MobileProjectsLayout from '../../../../../src/features/common/Layout/ProjectsLayout/MobileProjectsLayout';
import ProjectsSection from '../../../../../src/features/projectsV2/ProjectsSection';

const ProjectListPage: NextPageWithLayout = ({
  pageProps,
  selectedMode,
  setSelectedMode,
}) => {
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  return (
    <ProjectsSection
      selectedMode={selectedMode}
      setSelectedMode={setSelectedMode}
    />
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
    selectedMode: pageComponentProps.selectedMode,
    setSelectedMode: pageComponentProps.setSelectedMode,
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
    filenames: [
      'common',
      'maps',
      'country',
      'projectDetails',
      'donate',
      'allProjects',
      'manageProjects',
    ],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

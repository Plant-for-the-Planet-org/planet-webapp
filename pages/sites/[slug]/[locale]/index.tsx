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

import { constructPathsForTenantSlug } from '../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import ProjectsLayout from '../../../../src/features/common/Layout/ProjectsLayout';
import MobileProjectsLayout from '../../../../src/features/common/Layout/ProjectsLayout/MobileProjectsLayout';
import ProjectsSection from '../../../../src/features/projectsV2/ProjectsSection';
import { useTenantStore } from '../../../../src/stores/tenantStore';

const ProjectListPage: NextPageWithLayout = ({ isMobile }) => {
  // store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  if (!tenantConfig) return <></>;

  return <ProjectsSection isMobile={isMobile} />;
};

ProjectListPage.getLayout = function getLayout(
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

export default ProjectListPage;

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

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: [
      'common',
      'maps',
      'country',
      'projectDetails',
      'donate',
      'allProjects',
      'project',
      'me',
    ],
  });

  return {
    props: {
      messages,
    },
  };
};

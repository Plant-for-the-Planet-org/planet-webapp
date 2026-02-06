import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next/types';
import type { ReactElement } from 'react';
import type { NextPageWithLayout, PageComponentProps } from '../../../_app';
import type { AbstractIntlMessages } from 'next-intl';

import { constructPathsForTenantSlug } from '../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { v4 } from 'uuid';
import ProjectsLayout from '../../../../src/features/common/Layout/ProjectsLayout';
import MobileProjectsLayout from '../../../../src/features/common/Layout/ProjectsLayout/MobileProjectsLayout';
import ProjectDetails from '../../../../src/features/projectsV2/ProjectDetails';
import { useTenantStore } from '../../../../src/stores/tenantStore';

const ProjectDetailsPage: NextPageWithLayout = ({ isMobile }) => {
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  if (!tenantConfig) return <></>;

  return <ProjectDetails isMobile={isMobile} />;
};

ProjectDetailsPage.getLayout = function getLayout(
  page: ReactElement,
  pageComponentProps: PageComponentProps
): ReactElement {
  const layoutProps = {
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

interface PageProps {
  messages: AbstractIntlMessages;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
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
    },
  };
};

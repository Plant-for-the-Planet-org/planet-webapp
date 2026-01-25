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
import type { DirectGiftI } from '../../../../src/features/donations/components/DirectGift';

import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import { useEffect, useState } from 'react';
import ProjectsLayout from '../../../../src/features/common/Layout/ProjectsLayout';
import MobileProjectsLayout from '../../../../src/features/common/Layout/ProjectsLayout/MobileProjectsLayout';
import ProjectsSection from '../../../../src/features/projectsV2/ProjectsSection';
import DirectGift from '../../../../src/features/donations/components/DirectGift';

const ProjectListPage: NextPageWithLayout = ({ pageProps, isMobile }) => {
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  const [directGift, setDirectGift] = useState<DirectGiftI | null>(null);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    const storedDirectGift = localStorage.getItem('directGift');
    if (storedDirectGift) {
      setDirectGift(JSON.parse(storedDirectGift));
    }
  }, []);

  return (
    <>
      <ProjectsSection isMobile={isMobile} />
      {directGift !== null && (
        <DirectGift directGift={directGift} setDirectGift={setDirectGift} />
      )}
    </>
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

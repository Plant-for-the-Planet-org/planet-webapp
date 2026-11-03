import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next/types';
import type { ReactElement } from 'react';
import type { NextPageWithLayout, PageComponentProps } from '../../../_app';
import type { DirectGiftType } from '../../../../src/utils/directGift';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common';

import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useEffect, useState } from 'react';
import ProjectsLayout from '../../../../src/features/common/Layout/ProjectsLayout';
import MobileProjectsLayout from '../../../../src/features/common/Layout/ProjectsLayout/MobileProjectsLayout';
import ProjectsSection from '../../../../src/features/projectsV2/ProjectsSection';
import DirectGift from '../../../../src/features/donations/components/DirectGift';
import { useTenantStore } from '../../../../src/stores/tenantStore';
import { useAuthStore, useUserStore } from '../../../../src/stores';
import { defaultTenant } from '../../../../tenant.config';
import {
  clearStoredDirectGift,
  isSelfDirectGift,
  readStoredDirectGift,
} from '../../../../src/utils/directGift';

const ProjectListPage: NextPageWithLayout = ({ isMobile }) => {
  const isInitialized = useTenantStore((state) => state.isInitialized);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  const userSlug = useUserStore((state) => state.userProfile?.slug);

  const [directGift, setDirectGift] = useState<DirectGiftType | null>(null);

  // Wait for auth so a logged-in user never sees their own gift flash before the profile loads.
  useEffect(() => {
    if (!isAuthResolved) return;
    const storedDirectGift = readStoredDirectGift();
    if (
      storedDirectGift !== null &&
      userSlug !== undefined &&
      isSelfDirectGift(storedDirectGift, userSlug)
    ) {
      clearStoredDirectGift();
      setDirectGift(null);
      return;
    }
    setDirectGift(storedDirectGift);
  }, [isAuthResolved, userSlug]);

  if (!isInitialized) return <></>;

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

interface PageProps {
  messages: AbstractIntlMessages;
  tenantConfig: Tenant;
}

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

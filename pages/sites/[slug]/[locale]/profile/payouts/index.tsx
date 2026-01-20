import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { useEffect, useState } from 'react';
import TopProgressBar from '../../../../../../src/features/common/ContentLoaders/TopProgressBar';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ManagePayouts, {
  ManagePayoutTabs,
} from '../../../../../../src/features/user/ManagePayouts';
import { useTranslations } from 'next-intl';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useUserStore } from '../../../../../../src/stores';

interface Props {
  pageProps: PageProps;
}

export default function OverviewPage({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const t = useTranslations('Me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  // local state
  const [progress, setProgress] = useState(0);
  // store: state
  const isTpo = useUserStore((state) => state.userProfile?.type === 'tpo');

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  return tenantConfig ? (
    <>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <UserLayout>
        <Head>
          <title>{t('managePayouts.titleOverview')}</title>
        </Head>
        {isTpo ? (
          <ManagePayouts
            step={ManagePayoutTabs.OVERVIEW}
            setProgress={setProgress}
          />
        ) : (
          <AccessDeniedLoader />
        )}
      </UserLayout>
    </>
  ) : (
    <></>
  );
}

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
    filenames: ['common', 'me', 'country', 'managePayouts'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

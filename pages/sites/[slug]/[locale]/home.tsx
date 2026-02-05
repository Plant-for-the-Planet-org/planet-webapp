import type { APIError } from '@planet-sdk/common';
import type {
  LeaderBoardList,
  TenantScore,
} from '../../../../src/features/common/types/leaderboard';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../src/hooks/useLocalizedPath';
import SalesforceHome from '../../../../src/tenants/salesforce/Home';
import SternHome from '../../../../src/tenants/stern/Home';
import BasicHome from '../../../../src/tenants/common/Home';
import ConcentrixHome from '../../../../src/tenants/concentrix/Home';
import GetHomeMeta from '../../../../src/utils/getMetaTags/GetHomeMeta';
import { useApi } from '../../../../src/hooks/useApi';
import { handleError } from '@planet-sdk/common';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useErrorHandlingStore } from '../../../../src/stores/errorHandlingStore';

interface Props {
  pageProps: PageProps;
}

export default function Home({ pageProps }: Props) {
  //route
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { getApi } = useApi();
  const { setTenantConfig } = useTenant();
  //local state
  const [leaderboard, setLeaderboard] = useState<LeaderBoardList | null>(null);
  const [tenantScore, setTenantScore] = useState<TenantScore | null>(null);
  // store
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    async function loadTenantScore() {
      try {
        const newTenantScore = await getApi<TenantScore>('/app/tenantScore');
        setTenantScore(newTenantScore);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    loadTenantScore();
  }, []);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const newLeaderBoard = await getApi<LeaderBoardList>(
          '/app/leaderboard'
        );
        setLeaderboard(newLeaderBoard);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    loadLeaderboard();
  }, []);

  if (
    !pageProps.tenantConfig.config.header.items.find(
      (item) => item.headerKey === 'home' && item.visible
    )
  ) {
    if (typeof window !== 'undefined') {
      router.push(localizedPath('/'));
    }
  }

  let HomePage;

  function getHomePage() {
    switch (pageProps.tenantConfig.config.slug) {
      case 'salesforce':
        HomePage = SalesforceHome;
        return (
          <HomePage
            leaderboard={leaderboard}
            tenantScore={{ total: 65000000 }} //temp for SF
          />
        );
      case 'stern':
        HomePage = SternHome;
        return <HomePage leaderboard={leaderboard} tenantScore={tenantScore} />;
      case 'concentrix':
        HomePage = ConcentrixHome;
        return <HomePage />;
      case 'nitrosb':
      case 'energizer':
      case 'senatDerWirtschaft':
      case 'pampers':
      case 'interactClub':
      case 'culchacandela':
      case 'xiting':
      case 'lacoqueta':
      case 'ulmpflanzt':
      case 'sitex':
      case '3pleset':
      case 'weareams':
        HomePage = BasicHome;
        return <HomePage leaderboard={leaderboard} tenantScore={tenantScore} />;
      default:
        HomePage = null;
        return HomePage;
    }
  }

  return pageProps.tenantConfig ? (
    <>
      <GetHomeMeta />
      {getHomePage()}
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
    filenames: [
      'common',
      'me',
      'country',
      'leaderboard',
      'planet',
      'tenants',
      'projectDetails',
    ],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

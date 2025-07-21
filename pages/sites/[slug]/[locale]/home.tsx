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

import { useRouter } from 'next/router';
import React from 'react';
import SalesforceHome from '../../../../src/tenants/salesforce/Home';
import SternHome from '../../../../src/tenants/stern/Home';
import BasicHome from '../../../../src/tenants/common/Home';
import GetHomeMeta from '../../../../src/utils/getMetaTags/GetHomeMeta';
import { useApi } from '../../../../src/hooks/useApi';
import { ErrorHandlingContext } from '../../../../src/features/common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import getLocalizedPath from '../../../../src/utils/getLocalizedPath';
import { useLocale } from 'next-intl';
interface Props {
  pageProps: PageProps;
}

export default function Home({ pageProps }: Props) {
  const router = useRouter();
  const { getApi } = useApi();
  const locale = useLocale();

  const [leaderboard, setLeaderboard] = React.useState<LeaderBoardList | null>(
    null
  );
  const [tenantScore, setTenantScore] = React.useState<TenantScore | null>(
    null
  );
  const { setErrors } = React.useContext(ErrorHandlingContext);

  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  React.useEffect(() => {
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

  React.useEffect(() => {
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
      router.push(getLocalizedPath('/', locale));
    }
  }

  let HomePage;

  function getHomePage() {
    switch (pageProps.tenantConfig.config.slug) {
      case 'salesforce':
        HomePage = SalesforceHome;
        return <HomePage leaderboard={leaderboard} tenantScore={tenantScore} />;
      case 'stern':
        HomePage = SternHome;
        return <HomePage leaderboard={leaderboard} tenantScore={tenantScore} />;
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
    filenames: ['common', 'me', 'country', 'leaderboard', 'planet', 'tenants'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

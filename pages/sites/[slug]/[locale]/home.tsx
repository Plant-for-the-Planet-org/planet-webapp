import { useRouter } from 'next/router';
import React from 'react';
import SalesforceHome from '../../../../src/tenants/salesforce/Home';
import SternHome from '../../../../src/tenants/stern/Home';
import BasicHome from '../../../../src/tenants/common/Home';
import GetHomeMeta from '../../../../src/utils/getMetaTags/GetHomeMeta';
import { getRequest } from '../../../../src/utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../../src/features/common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import {
  LeaderBoardList,
  TenantScore,
} from '../../../../src/features/common/types/leaderboard';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { defaultTenant } from '../../../../tenant.config';
import { AbstractIntlMessages } from 'next-intl';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

export default function Home({ pageProps }: Props) {
  const router = useRouter();

  const [leaderboard, setLeaderboard] = React.useState<LeaderBoardList | null>(
    null
  );
  const [tenantScore, setTenantScore] = React.useState<TenantScore | null>(
    null
  );
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  React.useEffect(() => {
    async function loadTenantScore() {
      try {
        const newTenantScore = await getRequest<TenantScore>(
          pageProps.tenantConfig.id,
          `/app/tenantScore`
        );
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
        const newLeaderBoard = await getRequest<LeaderBoardList>(
          pageProps.tenantConfig.id,
          `/app/leaderboard`
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
      router.push('/');
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

import { useRouter } from 'next/router';
import React from 'react';
import SalesforceHome from '../../../src/tenants/salesforce/Home';
import SternHome from '../../../src/tenants/stern/Home';
import BasicHome from '../../../src/tenants/common/Home';
import GetHomeMeta from '../../../src/utils/getMetaTags/GetHomeMeta';
import { getRequest } from '../../../src/utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { handleError, APIError } from '@planet-sdk/common';
import {
  LeaderBoardList,
  TenantScore,
} from '../../../src/features/common/types/leaderboard';
import { useTenant } from '../../../src/features/common/Layout/TenantContext';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../src/utils/multiTenancy/helpers';

interface Props {
  initialized: Boolean;
  pageProps: {
    tenantConfig: Tenant;
  };
}

export default function Home({ initialized, pageProps }: Props) {
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
          undefined,
          `/app/tenantScore`
        );
        setTenantScore(newTenantScore);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/');
      }
    }
    loadTenantScore();
  }, []);

  React.useEffect(() => {
    async function loadLeaderboard() {
      try {
        const newLeaderBoard = await getRequest<LeaderBoardList>(
          undefined,
          `/app/leaderboard`
        );
        setLeaderboard(newLeaderBoard);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/');
      }
    }
    loadLeaderboard();
  }, []);

  if (!pageProps.tenantConfig.config.header.items['home'].visible) {
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
      {initialized ? getHomePage() : <></>}
    </>
  ) : (
    <></>
  );
}

export async function getStaticPaths() {
  return {
    paths: await constructPathsForTenantSlug(),
    fallback: 'blocking',
  };
}

export async function getStaticProps(props: any) {
  const tenantConfig = await getTenantConfig(props.params.slug);

  return {
    props: {
      ...(await serverSideTranslations(
        props.locale || 'en',
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      tenantConfig,
    },
  };
}

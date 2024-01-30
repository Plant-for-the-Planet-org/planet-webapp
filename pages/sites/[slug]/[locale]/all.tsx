import React from 'react';
import LeaderBoard from '../../../../src/tenants/planet/LeaderBoard';
import { getRequest } from '../../../../src/utils/apiRequests/api';
import GetLeaderboardMeta from '../../../../src/utils/getMetaTags/GetLeaderboardMeta';
import { ErrorHandlingContext } from '../../../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { handleError, APIError } from '@planet-sdk/common';
import {
  LeaderBoardList,
  TenantScore,
} from '../../../../src/features/common/types/leaderboard';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useRouter } from 'next/router';
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

interface Props {
  initialized: Boolean;
  pageProps: {
    tenantConfig: Tenant;
  };
}

export default function Home({ initialized, pageProps }: Props) {
  const [leaderboard, setLeaderboard] = React.useState<LeaderBoardList | null>(
    null
  );
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  const router = useRouter();
  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  React.useEffect(() => {
    async function loadLeaderboard() {
      try {
        const newLeaderboard = await getRequest<LeaderBoardList>(
          pageProps.tenantConfig.id,
          `/app/leaderboard/${pageProps.tenantConfig.id}`
        );
        setLeaderboard(newLeaderboard);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    loadLeaderboard();
  }, []);

  const [tenantScore, setTenantScore] = React.useState<TenantScore | null>(
    null
  );

  React.useEffect(() => {
    async function loadTenantScore() {
      try {
        const newTenantScore = await getRequest<TenantScore>(
          pageProps.tenantConfig.id,
          `/app/tenantScore/${pageProps.tenantConfig.id}`
        );
        setTenantScore(newTenantScore);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    loadTenantScore();
  }, []);

  let AllPage;
  function getAllPage() {
    switch (pageProps.tenantConfig.config.slug) {
      case 'planet':
        AllPage = (
          <LeaderBoard leaderboard={leaderboard} tenantScore={tenantScore} />
        );
        return AllPage;
      case 'ttc':
        AllPage = (
          <LeaderBoard leaderboard={leaderboard} tenantScore={tenantScore} />
        );
        return AllPage;
      default:
        AllPage = null;
        return AllPage;
    }
  }

  return pageProps.tenantConfig ? (
    <>
      {initialized ? (
        <>
          <GetLeaderboardMeta />
          {getAllPage()}
        </>
      ) : null}
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

interface StaticProps {
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
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
};

import type { APIError } from '@planet-sdk/common';
import type {
  LeaderBoardList,
  TenantScore,
  TreesDonated,
} from '../../../../src/features/common/types/leaderboard';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';

import React from 'react';
import LeaderBoard from '../../../../src/tenants/planet/LeaderBoard';
import GetLeaderboardMeta from '../../../../src/utils/getMetaTags/GetLeaderboardMeta';
import { ErrorHandlingContext } from '../../../../src/features/common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import { useRouter } from 'next/router';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../src/hooks/useApi';

interface Props {
  pageProps: PageProps;
}

export default function Home({ pageProps }: Props) {
  const [leaderboard, setLeaderboard] = React.useState<LeaderBoardList | null>(
    null
  );
  const { setErrors } = React.useContext(ErrorHandlingContext);

  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const { getApi } = useApi();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  React.useEffect(() => {
    async function loadLeaderboard() {
      try {
        const newLeaderboard = await getApi<LeaderBoardList>(
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
        const newTenantScore = await getApi<TenantScore>(
          `/app/tenantScore/${pageProps.tenantConfig.id}`
        );
        setTenantScore(newTenantScore);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    loadTenantScore();
  }, []);

  const [treesDonated, setTreesDonated] = React.useState<TreesDonated | null>(
    null
  );

  React.useEffect(() => {
    async function loadTreesDonated() {
      try {
        const newTreesDonated = await getApi<TreesDonated>(
          `${process.env.WEBHOOK_URL}/platform/total-tree-count`
        );
        setTreesDonated(newTreesDonated);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    loadTreesDonated();
  }, []);

  let AllPage;
  function getAllPage() {
    switch (pageProps.tenantConfig.config.slug) {
      case 'planet':
        AllPage = (
          <LeaderBoard
            leaderboard={leaderboard}
            tenantScore={tenantScore}
            treesDonated={treesDonated}
          />
        );
        return AllPage;
      case 'ttc':
        AllPage = (
          <LeaderBoard
            leaderboard={leaderboard}
            tenantScore={tenantScore}
            treesDonated={treesDonated}
          />
        );
        return AllPage;
      default:
        AllPage = null;
        return AllPage;
    }
  }

  return pageProps.tenantConfig ? (
    <>
      <GetLeaderboardMeta />
      {getAllPage()}
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
    filenames: ['common', 'me', 'country', 'leaderboard', 'planet'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

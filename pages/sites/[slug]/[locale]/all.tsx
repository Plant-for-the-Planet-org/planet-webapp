import type { APIError } from '@planet-sdk/common';
import type {
  LeaderBoardList,
  TenantScore,
  TreesDonated,
} from '../../../../src/features/common/types/leaderboard';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common';

import { useEffect, useState } from 'react';
import LeaderBoard from '../../../../src/tenants/planet/LeaderBoard';
import GetLeaderboardMeta from '../../../../src/utils/getMetaTags/GetLeaderboardMeta';
import { handleError } from '@planet-sdk/common';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../src/hooks/useApi';
import { useTenantStore } from '../../../../src/stores/tenantStore';
import { useErrorHandlingStore } from '../../../../src/stores/errorHandlingStore';

export default function Home() {
  const { getApi } = useApi();
  // local state
  const [leaderboard, setLeaderboard] = useState<LeaderBoardList | null>(null);
  const [tenantScore, setTenantScore] = useState<TenantScore | null>(null);
  const [treesDonated, setTreesDonated] = useState<TreesDonated | null>(null);
  // store: state
  const storedTenantConfig = useTenantStore((state) => state.tenantConfig);
  const isInitialized = useTenantStore((state) => state.isInitialized);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  useEffect(() => {
    if (!isInitialized) return;
    async function loadLeaderboard() {
      try {
        const newLeaderboard = await getApi<LeaderBoardList>(
          `/app/leaderboard/${storedTenantConfig.id}`
        );
        setLeaderboard(newLeaderboard);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    loadLeaderboard();
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    async function loadTenantScore() {
      try {
        const newTenantScore = await getApi<TenantScore>(
          `/app/tenantScore/${storedTenantConfig.id}`
        );
        setTenantScore(newTenantScore);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    loadTenantScore();
  }, [isInitialized]);

  useEffect(() => {
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
    switch (storedTenantConfig.config.slug) {
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
  if (!isInitialized) return <></>;

  return (
    <>
      <GetLeaderboardMeta />
      {getAllPage()}
    </>
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
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'leaderboard', 'planet'],
  });

  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

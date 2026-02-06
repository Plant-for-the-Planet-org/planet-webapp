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

import { useEffect, useState } from 'react';
import LeaderBoard from '../../../../src/tenants/planet/LeaderBoard';
import GetLeaderboardMeta from '../../../../src/utils/getMetaTags/GetLeaderboardMeta';
import { handleError } from '@planet-sdk/common';
import { constructPathsForTenantSlug } from '../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../src/hooks/useApi';
import { useTenantStore } from '../../../../src/stores/tenantStore';
import { useErrorHandlingStore } from '../../../../src/stores/errorHandlingStore';

export default function Home() {
  const { getApi } = useApi();
  // local state
  const [leaderboard, setLeaderboard] = useState<LeaderBoardList | null>(null);
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const newLeaderboard = await getApi<LeaderBoardList>(
          `/app/leaderboard/${tenantConfig.id}`
        );
        setLeaderboard(newLeaderboard);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    loadLeaderboard();
  }, []);

  const [tenantScore, setTenantScore] = useState<TenantScore | null>(null);

  useEffect(() => {
    async function loadTenantScore() {
      try {
        const newTenantScore = await getApi<TenantScore>(
          `/app/tenantScore/${tenantConfig.id}`
        );
        setTenantScore(newTenantScore);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    loadTenantScore();
  }, []);

  const [treesDonated, setTreesDonated] = useState<TreesDonated | null>(null);

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
    switch (tenantConfig.config.slug) {
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
  if (!tenantConfig) return <></>;

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
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'leaderboard', 'planet'],
  });

  return {
    props: {
      messages,
    },
  };
};

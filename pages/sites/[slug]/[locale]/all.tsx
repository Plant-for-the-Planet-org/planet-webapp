import React from 'react';
import LeaderBoard from '../../../../src/tenants/planet/LeaderBoard';
import { getRequest } from '../../../../src/utils/apiRequests/api';
import GetLeaderboardMeta from '../../../../src/utils/getMetaTags/GetLeaderboardMeta';
import { ErrorHandlingContext } from '../../../../src/features/common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import {
  LeaderBoardList,
  TenantScore,
  TreesDonated,
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
import { AbstractIntlMessages } from 'next-intl';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';

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


  const [treesDonated, setTreesDonated] = React.useState<TreesDonated | null>(
    null
  );

  React.useEffect(() => {
    async function loadTreesDonated() {
      try {
        const newTreesDonated = await getRequest<TreesDonated>(
          pageProps.tenantConfig.id,
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
          <LeaderBoard leaderboard={leaderboard} tenantScore={tenantScore} treesDonated={treesDonated} />
        );
        return AllPage;
      case 'ttc':
        AllPage = (
          <LeaderBoard leaderboard={leaderboard} tenantScore={tenantScore} treesDonated={treesDonated}/>
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
    filenames: ['common', 'me', 'country', 'leaderboard', 'planet'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

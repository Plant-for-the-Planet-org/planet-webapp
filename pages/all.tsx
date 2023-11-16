import React from 'react';
import LeaderBoard from '../src/tenants/planet/LeaderBoard';
import { getRequest } from '../src/utils/apiRequests/api';
import GetLeaderboardMeta from './../src/utils/getMetaTags/GetLeaderboardMeta';
import { TENANT_ID } from '../src/utils/constants/environment';
import { ErrorHandlingContext } from '../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { handleError, APIError } from '@planet-sdk/common';
import { GetStaticPropsContext } from 'next';
import {
  LeaderBoardList,
  TenantScore,
} from '../src/features/common/types/leaderboard';
import { useTenant } from '../src/features/common/Layout/TenantContext';

interface Props {
  initialized: Boolean;
}

export default function Home({ initialized }: Props) {
  const {tenantConfig} = useTenant()
  const [leaderboard, setLeaderboard] = React.useState<LeaderBoardList | null>(
    null
  );
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    async function loadLeaderboard() {
      try {
        const newLeaderboard = await getRequest<LeaderBoardList>(
          tenantConfig?.id,
          `/app/leaderboard/${tenantConfig?.id}`
        );
        setLeaderboard(newLeaderboard);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/');
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
          `/app/tenantScore/${TENANT_ID}`
        );
        setTenantScore(newTenantScore);
      } catch (err) {
        setErrors(handleError(err as APIError));
        redirect('/');
      }
    }
    loadTenantScore();
  }, []);

  let AllPage;
  function getAllPage() {
    switch (process.env.TENANT) {
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

  return (
    <>
      {initialized ? (
        <>
          <GetLeaderboardMeta />
          {getAllPage()}
        </>
      ) : null}
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
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
    },
  };
}

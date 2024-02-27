import React, { ReactElement } from 'react';
import Footer from '../../../features/common/Layout/Footer';
import Score from './components/Score';
import Stats from './components/Stats';
import Stories from './components/Stories';
import {
  LeaderBoardList,
  TenantScore,
} from '../../../features/common/types/leaderboard';

interface Props {
  leaderboard: LeaderBoardList | null;
  tenantScore: TenantScore | null;
}

export default function index({
  leaderboard,
  tenantScore,
}: Props): ReactElement {
  return (
    <div>
      <Score leaderboard={leaderboard} />
      {tenantScore && <Stats tenantScore={tenantScore} />}
      <Stories />
      <Footer />
    </div>
  );
}

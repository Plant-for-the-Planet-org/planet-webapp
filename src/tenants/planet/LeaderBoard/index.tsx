import React, { ReactElement } from 'react';
import Footer from '../../../features/common/Layout/Footer';
import Score from './components/Score';
import Stats from './components/Stats';
import Stories from './components/Stories';

interface Props {
  leaderboard: any;
  tenantScore: any;
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

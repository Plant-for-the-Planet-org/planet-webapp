import { router } from '../trpc';

import { projectListsProcedure } from '../procedures/myForestV2/projectList';
import { contributionsProcedure } from '../procedures/myForestV2/contributions';
import { leaderboardProcedure } from '../procedures/myForestV2/leaderboard';

export const myForestV2Router = router({
  projectList: projectListsProcedure,
  contributions: contributionsProcedure,
  leaderboard: leaderboardProcedure,
});

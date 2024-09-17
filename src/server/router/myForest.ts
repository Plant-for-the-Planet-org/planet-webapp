import { router } from '../trpc';

import { projectListsProcedure } from '../procedures/myForest/projectList';
import { contributionsProcedure } from '../procedures/myForest/contributions';
import { leaderboardProcedure } from '../procedures/myForest/leaderboard';

export const myForestRouter = router({
  projectList: projectListsProcedure,
  contributions: contributionsProcedure,
  leaderboard: leaderboardProcedure,
});

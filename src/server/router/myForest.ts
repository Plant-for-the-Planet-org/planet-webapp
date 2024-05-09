import { router } from '../trpc';

import { contributions } from '../procedures/myForest/contributions';
import { stats } from '../procedures/myForest/stats';
import { contributionsGeoJson } from '../procedures/myForest/contributionsGeoJson';
import { projectListsProcedure } from '../procedures/myForestV2/projectList';

export const myForestRouter = router({
  contributions: contributions,
  stats: stats,
  contributionsGeoJson: contributionsGeoJson,
});

export const myForestV2Router = router({
  projectList: projectListsProcedure,
});

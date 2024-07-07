import { router } from '../trpc';

import { contributions } from '../procedures/myForest/contributions';
import { stats } from '../procedures/myForest/stats';
import { contributionsGeoJson } from '../procedures/myForest/contributionsGeoJson';

export const myForestRouter = router({
  contributions: contributions,
  stats: stats,
  contributionsGeoJson: contributionsGeoJson,
});

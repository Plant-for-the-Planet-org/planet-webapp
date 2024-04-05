export type TenantScore = { total: number };
export type LeaderBoard = {
  mostDonated: { created: string; donorName: string; treeCount: string }[];
  mostRecent: { created: string; donorName: string; treeCount: string }[];
};

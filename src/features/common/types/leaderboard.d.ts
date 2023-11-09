export type TenantScore = {
  total: number;
};

export type LeaderBoardItem = {
  donorName: string;
  treeCount: number;
  created: string;
};

export type LeaderBoardList = {
  mostRecent: LeaderBoardItem[];
  mostDonated: LeaderBoardItem[];
};

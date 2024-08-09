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

export type TreesDonated = {
  trees_since_2019: number;
  updated_on: string;
};

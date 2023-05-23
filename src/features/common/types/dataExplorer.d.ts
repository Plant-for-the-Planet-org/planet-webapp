export interface IDailyFrame {
  plantedDate: string;
  treesPlanted: number;
}

export interface IWeeklyFrame {
  weekStartDate: string;
  weekEndDate: string;
  weekNum: number;
  month: string;
  year: number;
  treesPlanted: number;
}

export interface IMonthlyFrame {
  month: string;
  year: number;
  treesPlanted: number;
}

export interface IYearlyFrame {
  year: number;
  treesPlanted: number;
}

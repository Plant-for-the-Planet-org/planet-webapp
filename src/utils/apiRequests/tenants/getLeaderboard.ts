import getRequest from "../api";

export async function getLeaderboard() {
  return getRequest(`/app/leaderboard`);
}
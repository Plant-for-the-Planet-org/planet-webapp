import getRequest from "../api";

export async function getUserProfile(slug:any) {
  return getRequest(`/public/v1.0/en/treecounter/${slug}`);
}
import getRequest from "../api";

export async function getTenantScore() {
  return getRequest(`/app/tenantScore`);
}
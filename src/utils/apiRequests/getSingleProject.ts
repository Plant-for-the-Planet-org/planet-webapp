import getStoredCurrency from "../countryCurrency/getStoredCurrency";
import getRequest from "./api";

export async function getSingleProject(id: any) {
  let currencyCode = getStoredCurrency();
  return getRequest(`/app/projects/${id}?_scope=extended&currency=${currencyCode}`);
}

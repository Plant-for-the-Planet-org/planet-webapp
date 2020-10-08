import getStoredCurrency from '../countryCurrency/getStoredCurrency';
import getRequest from "./api";

export async function getAllProjects() {
  let currencyCode = getStoredCurrency();
  return getRequest(`/app/projects?_scope=map&currency=${currencyCode}`);
}

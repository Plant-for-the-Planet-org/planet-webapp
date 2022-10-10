import {DEFAULT_TENANT_ID} from '../../../src/utils/constants/environment'

type paramTenant = string | string [] | undefined | null
export const getTenantID = (paramTenant: paramTenant) : paramTenant => {
  return  undefined || paramTenant || DEFAULT_TENANT_ID
}
import {AbstractIntlMessages} from "next-intl";
import {Tenant} from "@planet-sdk/common/build/types/tenant";

export interface PageProps {
    messages: AbstractIntlMessages;
    tenantConfig: Tenant;
}

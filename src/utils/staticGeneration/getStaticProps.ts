import type {PageProps} from "../../types/common/pageProps";
import {GetStaticProps} from 'next';
import getMessagesForPage from '../../utils/language/getMessagesForPage';
import {getTenantConfig} from '../multiTenancy/helpers';
import {defaultTenant} from '../../../tenant.config';

export const fetchStaticProps: GetStaticProps<PageProps> = async (context) => {
    const slug = context.params?.slug as string;
    const locale = context.params?.locale as string;

    if (!slug || !locale) return {notFound: true};

    const tenantConfig = (await getTenantConfig(slug)) ?? defaultTenant;
    const messages = await getMessagesForPage({locale, filenames: ['common', 'me', 'country']});

    return {
        props: {
            messages,
            tenantConfig,
        },
    };
};

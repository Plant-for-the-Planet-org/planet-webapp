import {constructPathsForTenantSlug} from '../multiTenancy/helpers';

export const fetchStaticPaths = async () => {
    const paths = (await constructPathsForTenantSlug()) ?? [];

    return {
        paths: paths.map((path) => ({
            params: { slug: path.params.slug, locale: 'en' },
        })),
        fallback: 'blocking',
    };
};

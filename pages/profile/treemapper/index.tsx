import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import TreeMapper from '../../../src/features/user/TreeMapper';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface Props {
}

function TreeMapperPage({
}: Props): ReactElement {
    const router = useRouter();

    // TODO - remove this
    // if (typeof window !== 'undefined') {
    //   router.push('/');
    // }
    const { t } = useTranslation('me');
    return (
        <UserLayout>
            <Head>
                <title>{t('treemapper')}</title>
            </Head>
            <TreeMapper />
        </UserLayout>
    );
}

export default TreeMapperPage;

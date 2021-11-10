import Head from 'next/head';
import React, { ReactElement } from 'react';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import ApiKey from '../../src/features/user/Settings/ApiKey';
import { useTranslation } from 'react-i18next';

function EditProfilePage(): ReactElement {
    const { t } = useTranslation('me');
    return (
        <UserLayout>
            <Head>
                <title>{t('apiKey')}</title>
            </Head>
            <ApiKey />
        </UserLayout>
    );
}

export default EditProfilePage;

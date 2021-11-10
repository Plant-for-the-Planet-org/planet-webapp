import Head from 'next/head'
import React, { ReactElement } from 'react'
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout'
import MySpecies from '../../../src/features/user/TreeMapper/MySpecies';
import { useTranslation } from 'react-i18next';

interface Props {

}

export default function MySpeciesPage({ }: Props): ReactElement {
    const { t } = useTranslation('me');
    return (
        <UserLayout>
            <Head>
                <title>{t('mySpecies')}</title>
            </Head>
            <MySpecies />
        </UserLayout>
    )
}

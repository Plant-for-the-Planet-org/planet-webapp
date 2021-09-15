import Head from 'next/head'
import React, { ReactElement } from 'react'
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout'
import i18next from '../../../i18n'
import ImportData from '../../../src/features/user/TreeMapper/Import';

const {useTranslation} = i18next;

interface Props {
    
}

export default function Import({}: Props): ReactElement {
    const {t} = useTranslation('me');
    return (
        <UserLayout>
      <Head>
        <title>{t('Import Data')}</title>
      </Head>
      <ImportData/>
    </UserLayout>
    )
}

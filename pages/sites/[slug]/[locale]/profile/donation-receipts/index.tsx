import DonationReceipts from "../../../../../../src/features/user/DonationReceipts";
import Head from 'next/head';
import React from 'react';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import type {ReactElement} from 'react';
import type  {PageProps} from "../../../../../_app";
import {fetchStaticPaths} from '../../../../../../src/utils/staticGeneration/getStaticPaths';
import {fetchStaticProps} from '../../../../../../src/utils/staticGeneration/getStaticProps';

function DonationReceiptsPage({messages, tenantConfig}: PageProps): ReactElement {
    return (
        <UserLayout>
            <Head>
                <title>Donation Receipts</title>
            </Head>
            <DonationReceipts/>
        </UserLayout>
    );
}

export default DonationReceiptsPage;

export {fetchStaticPaths as getStaticPaths};
export {fetchStaticProps as getStaticProps};

import DonorUpdate from "../../../../../../src/features/user/DonationReceipts/DonorUpdatePage";
import Head from 'next/head';
import React from 'react';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import type {ReactElement} from 'react';

function DonorUpdatePage(): ReactElement {
    return (
        <UserLayout>
            <Head>
                <title>Donor Update</title>
            </Head>
            <DonorUpdate/>
        </UserLayout>
    );
}

export default DonorUpdatePage;

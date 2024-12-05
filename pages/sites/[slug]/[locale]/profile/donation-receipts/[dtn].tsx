import DonationReceipt from "../../../../../../src/features/user/DonationReceipts/DonationReceiptPage";
import Head from "next/head";
import React from "react";
import UserLayout from "../../../../../../src/features/common/Layout/UserLayout/UserLayout";
import type {ReactElement} from "react";

function DonationReceiptPage(): ReactElement {
    return (
        <UserLayout>
            <Head>
                <title>Donation Receipt</title>
            </Head>
            <DonationReceipt/>
        </UserLayout>
    );
}

export default DonationReceiptPage;

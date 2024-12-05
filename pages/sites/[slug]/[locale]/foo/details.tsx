// pages/foo/details.tsx
import React, {ReactElement} from 'react';
import UserLayout from "../../../../../src/features/common/Layout/UserLayout/UserLayout";
import Head from "next/head";
import {useFooContext} from "../../../../../src/features/common/Layout/FooContext";

function FooDetailsPage(): ReactElement {
    const {fooData, clearFooData} = useFooContext();

    const handleClearData = () => {
        clearFooData();
    };

    return (
        <UserLayout>
            <Head>
                <title>Foo Details</title>
            </Head>
            <div style={{marginTop: '100px'}}>
                <h1>Foo Details Page</h1>
                <p>Current Data:</p>
                <div>
                    FooData: {fooData}
                </div>
                <div>
                    FooData: {fooData}
                </div>
                <button onClick={handleClearData}>Clear Data</button>
            </div>
        </UserLayout>
    );
}

export default FooDetailsPage;
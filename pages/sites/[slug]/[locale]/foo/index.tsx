// pages/foo/index.tsx
import React, { ReactElement } from 'react';
import withFooContext from '../../../../../src/hoc/withFooContext';
import UserLayout from "../../../../../src/features/common/Layout/UserLayout/UserLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import {useFooContext} from "../../../../../src/features/common/Layout/FooContext";

function FooIndexPage(): ReactElement {
    const { addFooData, fooData } = useFooContext();
    const router = useRouter();

    const handleAddDataAndNavigate = () => {
        addFooData('exampleValue');
        router.push('/foo/details');
    };

    return (
        <UserLayout>
            <Head>
                <title>Foo Index</title>
            </Head>
            <div style={{ marginTop: '100px' }}>
                <h1>Foo Index Page</h1>
                <p>Current Data:</p>
                <div>
                    FooData: {fooData}
                </div>
                <button onClick={handleAddDataAndNavigate}>
                    Add Data and Go to Details
                </button>
            </div>
        </UserLayout>
    );
}

export default FooIndexPage;

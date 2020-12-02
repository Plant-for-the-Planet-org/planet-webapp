import React, { ReactElement } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import UserProfileLoader from '../src/features/common/ContentLoaders/UserProfile/UserProfile';

interface Props {

}

function Login({ }: Props): ReactElement {
    const {
        loginWithRedirect,
    } = useAuth0();

    loginWithRedirect();
    return (
        <div>
            <UserProfileLoader/>
        </div>
    )
}

export default Login

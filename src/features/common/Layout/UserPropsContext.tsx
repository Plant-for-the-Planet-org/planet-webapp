import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { getAccountInfo } from '../../../utils/apiRequests/api';

interface Props { }

export const UserPropsContext = React.createContext({
    userprofile: {} || null,
    setUserprofile: (value: {}) => { },
    userExistsInDB: false,
    setUserExistsInDB: (value: boolean) => { },
});

function UserPropsProvider({ children }: any): ReactElement {
    const {
        isLoading,
        isAuthenticated,
        loginWithRedirect,
        getAccessTokenSilently,
    } = useAuth0();

    const router = useRouter();
    
    const [userprofile, setUserprofile] = React.useState(null);
    const [userExistsInDB,setUserExistsInDB] = React.useState(false);

    React.useEffect(() => {
        async function loadUserProfile() {
            let token = null;
            if (isAuthenticated) {
                token = await getAccessTokenSilently();
            }
            if (!isLoading && token) {
                try {
                    const res = await getAccountInfo(token);
                    if (res.status === 200) {
                        const resJson = await res.json();
                        setUserprofile(resJson);
                    } else if (res.status === 303) {
                        // if 303 -> user doesn not exist in db
                        setUserExistsInDB(false);
                        if (typeof window !== 'undefined') {
                            router.push('/complete-signup');
                        }
                    } else if (res.status === 401) {
                        // in case of 401 - invalid token: signIn()
                        setUserprofile(null);
                        loginWithRedirect({
                            redirectUri: `${process.env.NEXTAUTH_URL}`,
                            ui_locales: localStorage.getItem('language') || 'en',
                        });
                    } else {
                        // any other error
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        }
        if (!isLoading)
            loadUserProfile();

    }, [isLoading, isAuthenticated,router])

    return (
        <UserPropsContext.Provider
            value={{
                userprofile, setUserprofile,userExistsInDB,setUserExistsInDB
            }}
        >
            {children}
        </UserPropsContext.Provider>
    );
}

export default UserPropsProvider;
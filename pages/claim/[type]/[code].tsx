import React, { ReactElement } from 'react'
import { useRouter } from 'next/router';
import { useAuth0 } from '@auth0/auth0-react';
import { postAuthenticatedRequest } from '../../../src/utils/apiRequests/api';

interface Props {

}

function ClaimDonation({ }: Props): ReactElement {

    // Check if the user is logged in or not. 

    // If the user is not logged in - send the user to log in page, store the claim redirect link in the localstorage.
    // When the user logs in, redirect user to the claim link from the localstorage and clear the localstorage. 

    // For this create a separate function which fetches the link from the storage, clears the storage and then redirects the user using the link

    // If the user is logged in - 
    // Validate the code automatically 
    // Once validated ask user to claim their donation
    // Once claimed redirect them to their profile

    const router = useRouter();

    const {
        isAuthenticated,
        isLoading,
        loginWithRedirect,
        getAccessTokenSilently
    } = useAuth0();

    const [isUploadingData, setIsUploadingData] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState()
    const [code, setCode] = React.useState();
    const [type, setType] = React.useState();
    const [codeValidated, setCodeValidated] = React.useState(false)
    const [validCodeData, setValidCodeData] = React.useState();

    const [ready, setReady] = React.useState(false);

    console.log('type',type);
    

    React.useEffect(() => {
        if (router && router.query.type && router.query.code) {
            setCode(router.query.code);
            setType(router.query.type)
            setReady(true);
        }
    }, [router]);

    async function validateCode(code: any) {
        setIsUploadingData(true)
        const submitData = {
            type: 'donation',
            code: code
        }
        if (!isLoading && isAuthenticated) {
            let token = await getAccessTokenSilently();
            let userLang = localStorage.getItem('language') || 'en';
            postAuthenticatedRequest(`/api/v1.3/${userLang}/validateCode`, submitData, token).then((res) => {
                if (res.code === 401) {
                    setErrorMessage(res.message);
                    setIsUploadingData(false)
                }
                else if (res.status === 'error') {
                    setErrorMessage(res.errorText);
                    setIsUploadingData(false)
                }
                else if (res.status === 'success') {
                    setCodeValidated(true);
                    setValidCodeData(res)
                    setIsUploadingData(false)
                }
            })
        }
    }

    React.useEffect(() => {
        if (!isLoading && isAuthenticated) {
            // validate code
            if (ready && code){
                validateCode(code)
            }
        }
        else if (!isLoading && !isAuthenticated) {
            // store the claim link in localstorage
            if (ready && typeof window !== 'undefined') {
                localStorage.setItem('redirectLink',window.location.href);
                loginWithRedirect({ redirectUri: `${process.env.NEXTAUTH_URL}/login` });
            }
        }
    }, [isAuthenticated, isLoading,code])

    
    return ready ? (
        <div>
            <h2>Claim</h2>
            <h2>
            {codeValidated && 'Code validated'} 
            {router.query.code}
            </h2>
        </div>
    ): (
        <></>
    )
}

export default ClaimDonation

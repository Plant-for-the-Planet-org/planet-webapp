import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import ThankYouGiroPay from './../src/features/donations/screens/ThankYouGiroPay'
interface Props {
    
}

function DonationSuccessful({}: Props): ReactElement {
    const router = useRouter();    
    return (
        <div style={{display:'grid',placeItems: 'center',height:'100vh',width:'100vw'}}>
            <ThankYouGiroPay donationID={router.query.donationID} />
        </div>
    )
}

export default DonationSuccessful

import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import ThankYou from '../src/features/donations/screens/ThankYou';
interface Props {

}

function DonationSuccessful({ }: Props): ReactElement {
    const router = useRouter();
    const [donationID, setdonationID] = React.useState(null)
    React.useEffect(() => {
        if (router.query.donationID) {
            setdonationID(router.query.donationID);
        }
    }, [router.query.donationID])

    return donationID ? (
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh', width: '100vw' }}>
            <ThankYou
                donationID={donationID}
                onClose={() => router.replace(`${process.env.NEXTAUTH_URL}`)}
                paymentType={router.query.paymentType}
            />
        </div>
    ) : <></>;
}

export default DonationSuccessful

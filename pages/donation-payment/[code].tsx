import Footer from '../../src/features/common/Layout/Footer';
import { useRouter } from 'next/router';
import React from 'react';
interface Props {
    initialized: Boolean;
}


function PaymentPage({ initialized }: Props) {
    const router = useRouter();

    const [paymentDate, setPaymentData] = React.useState(null);

    React.useEffect(() => {
        async function loadProjects() {
            await fetch(`https://app.plant-for-the-planet.org/public/v1.3/en/paymentInfo/${router.query.code}`).then(async (res) => {
                const data = await res.json();
                setPaymentData(data);
            })
        }
        if(router.query.code){
            loadProjects();
        }
        
    }, [router.query.code]);
    const styles = {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }

    return (
        <>
            {initialized && (
                <div style={styles}>
                    <h2>{router.query.code}</h2>
                </div>
            )}
            
            <Footer />
        </>
    );
}

export default PaymentPage
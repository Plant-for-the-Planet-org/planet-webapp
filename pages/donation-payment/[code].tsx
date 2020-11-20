import Footer from '../../src/features/common/Layout/Footer';
import { useRouter } from 'next/router';
import React from 'react';
import ReactDOM from 'react-dom';
interface Props {
    initialized: Boolean;
    data: any;
}


function PaymentPage({ initialized, data }: Props) {
    const router = useRouter();

    const [paymentDate, setPaymentData] = React.useState(null);

    const [isReady,setIsReady]= React.useState(false)
    let paypal;
    React.useEffect(()=>{
        if (typeof Storage !== 'undefined') {
            window.React = React;
            window.ReactDOM = ReactDOM;
            paypal = window.paypal;
            setIsReady(true)
        }
    })

    console.log('paypal',paypal);
    
    
    let mode = "development";


    const CLIENT = {
        [mode]: "Ac6akWq63eXCG6hd4T28bORJr9io1RMHk32Vw9Y1ixFMZdVKbom_S-fTMOzj-EZbSxZ7om-Ux1ZvbKmu"
    };
    const invoice_number = `ttc-${router.query.code}`;
    //debug('invoice we are sending to paypal as donationId:', invoice_number);
    const payment = () => {
        return paypal.rest.payment.create(mode, CLIENT, {
            transactions: [
                {
                    amount: {
                        total: Math.round(100 * 100) / 100,
                        currency: "EUR"
                    },
                    invoice_number: invoice_number
                }
            ]
        });
    };
    const buttonStyle = {
        color: 'silver', // gold | blue | silver | black
        shape: 'pill', // pill | rect
        label: 'pay', // checkout | credit | pay | buynow | paypal | installment
        size: 'large' // small | medium | large | responsive
    };

    const onSuccess = (data:any)=>{
        console.log(data);
        
    }

    const onAuthorize = (data:any) => {
        onSuccess(data);
    };

    const onError = (data:any) => {
        onSuccess(data);
    };

    const onCancel = (data:any) => {
        let error = {
            ...data,
            type: 'error',
            error: { message: 'Transaction cancelled' }
        };
        onSuccess(error);
    };

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
            {isReady && paypal && <paypal.Button.react
                env={mode}
                style={buttonStyle}
                client={CLIENT}
                commit={false}
                payment={payment}
                onAuthorize={onAuthorize}
                onCancel={onCancel}
                onError={onError}
            /> 
            }
            <Footer />
        </>
    );
}

export default PaymentPage
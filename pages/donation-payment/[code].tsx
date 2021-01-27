import Footer from '../../src/features/common/Layout/Footer';
import { useRouter } from 'next/router';
import React from 'react';
import i18next from './../../i18n'
import LegacyDonations from '../../src/features/donations/legacyDonation';
import styles from './../../src/features/legacyDonations/styles/PaymentDetails.module.scss'
interface Props {
    initialized: Boolean;
}
const { useTranslation } = i18next;


function PaymentPage({ initialized }: Props) {
    const router = useRouter();

    const [paymentData, setPaymentData] = React.useState(null);

    const [isLoaded, setIsLoaded] = React.useState(false);
    const { t, ready } = useTranslation(['donate']);

    React.useEffect(() => {
        async function loadProjects() {
            let userLang = localStorage.getItem('language') || 'en';
            await fetch(`${process.env.API_ENDPOINT}/public/v1.3/${userLang}/paymentInfo/${router.query.code}`).then(async (res) => {
                if (res.status !== 200) {
                    setPaymentData(null)
                    setIsLoaded(true)
                }
                else {
                    const data = await res.json();
                    setPaymentData(data);
                    setIsLoaded(true)
                }

            }).catch((err) => {
                console.log(err);
            })
        }
        if (router.query.code) {
            loadProjects();
        }

    }, [router.query.code]);

    return ready ? (
      isLoaded ? paymentData ? (
        <>
            <div className={styles.donationPaymentSection}>

                {initialized && paymentData && (
                    <LegacyDonations paymentData={paymentData} />
                )}
                <img
                    className={styles.leaderBoardBushImage}
                    src="/tenants/planet/images/leaderboard/Person.svg"
                    alt=""
                />
                <img
                    className={styles.leaderBoardGroupTreeImage}
                    src="/tenants/planet/images/leaderboard/Trees.svg"
                    alt=""
                />

            </div>
            <Footer />
        </>
      ) : 
        <>
            <div className={styles.donationPaymentSection}>
                <h2>
                    {t('donate:donationTokenInvalid')}
                </h2>
            </div>
            <Footer />
        </> : <>
            <div className={styles.donationPaymentSection}>
                <div className={styles.donationPaymentLoader} />
            </div>

            <Footer />
        </>
    ) : null;
}

export default PaymentPage
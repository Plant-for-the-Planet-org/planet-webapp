import { useRouter } from 'next/router';
import React from 'react';
import i18next from './../../i18n'
import Footer from '../../src/features/common/Layout/Footer';
import LegacyDonations from '../../src/features/legacyDonations';
import styles from './../../src/features/legacyDonations/styles/PaymentDetails.module.scss'

interface Props {
    initialized: Boolean;
}
const { useTranslation } = i18next;

function PaymentPage({ initialized }: Props) {
    const router = useRouter();

    const [paymentData, setPaymentData] = React.useState(null);
    const { t } = useTranslation(['donate']);

    React.useEffect(() => {
        async function loadProjects() {
            await fetch(`${process.env.API_ENDPOINT}/public/v1.3/en/paymentInfo/${router.query.code}`).then(async (res) => {
                if(res.status !== 200){
                    setPaymentData(null)
                }
                else{
                    const data = await res.json();
                    setPaymentData(data);   
                }
                
            }).catch((err)=>{
                console.log(err);
            })
        }
        if (router.query.code) {
            loadProjects();
        }

    }, [router.query.code]);

    return paymentData ? (
      <planetapp>
        <div className={styles.donationPaymentSection}>

            {initialized && paymentData && (
                <LegacyDonations paymentData={paymentData}/>
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
      </planetapp>
    ) : <planetapp>
      <div className={styles.donationPaymentSection}>
        <h2>
        {t('donate:donationTokenInvalid')}
        </h2>
      </div>
      <Footer />
    </planetapp>;
}

export default PaymentPage
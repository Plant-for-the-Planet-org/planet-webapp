import Footer from '../../src/features/common/Layout/Footer';
import { useRouter } from 'next/router';
import React from 'react';
import Modal from '@material-ui/core/Modal';
import { Elements } from '@stripe/react-stripe-js';
import { ThemeContext } from '../../src/theme/themeContext';
import getStripe from '../../src/utils/stripe/getStripe';
import DonationsPopup from '../../src/features/donations';

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

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

  const { theme } = React.useContext(ThemeContext);

  let projectDetails = {};

  // Need to pass - 
  // treeCost
  // currency
  // project id (GUID)
  // taxDeductionCountries Array
  // project name
  // project tpo name
  // country
  
    return (
        <>
        <Modal
        className={`modal ${theme}`}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Elements stripe={getStripe()}>
          <DonationsPopup project={projectDetails} onClose={handleClose} />
        </Elements>
      </Modal>
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
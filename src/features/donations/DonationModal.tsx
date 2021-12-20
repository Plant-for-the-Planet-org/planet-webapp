import { CircularProgress, Modal } from '@material-ui/core'
import React, { ReactElement } from 'react'
import { ThemeContext } from '../../theme/themeContext';
import getStoredCurrency from '../../utils/countryCurrency/getStoredCurrency';
import { UserPropsContext } from '../common/Layout/UserPropsContext';

interface Props {
    openDonation: boolean;
    handleOpenDonate: () => void;
    handleCloseDonate: () => void;
    project: {};
}

export default function DonationModal({
    openDonation,
    handleOpenDonate,
    handleCloseDonate,
    project,
}: Props): ReactElement {
    const { theme } = React.useContext(ThemeContext);
    const { user } = React.useContext(UserPropsContext);
    const [loading, setLoading] = React.useState(true);

    const currency = getStoredCurrency();
    const country = localStorage.getItem('countryCode');
    const language = localStorage.getItem('language');

    const getSourceUrl = React.useCallback((): string => {
        var sourceUrl = `${process.env.NEXT_PUBLIC_DONATION_URL}/?to=${project.slug}&embed=true&returnToUrl=${window.location.href}&country=${country}&currency=${currency}&locale=${language}${user ? '&autoLogin=true' : ''}&tenant=${process.env.TENANTID}`;
        return sourceUrl;
    }, [project, country, currency, language, user]);

    const url = getSourceUrl();

    const hideLoader = React.useCallback((): void => {
        setLoading(false);
    }, []);

    return (
        <Modal
            className={`modalContainer ${theme}`}
            open={openDonation}
            onClose={handleCloseDonate}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            disableBackdropClick
        >
            <>
                <div
                    onClick={handleCloseDonate}
                    style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        fontSize: 60,
                        color: '#fff',
                        cursor: 'pointer',
                    }}
                >
                    &times;
                </div>
                {loading ? (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, margin: 'auto', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress color="inherit" />
                    </div>
                ) : []}
                <iframe
                    src={url}
                    width="100%"
                    height="100%"
                    scrolling="yes"
                    allowtransparency="true"
                    allow="payment"
                    allowpaymentrequest="true"
                    title="Donate to Plant-for-the-Planet"
                    referrerpolicy="no-referrer"
                    onLoad={hideLoader}
                // sandbox="allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts"
                >
                </iframe>
            </>
        </Modal>
    )
}

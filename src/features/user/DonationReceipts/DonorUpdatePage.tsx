import AddressPanel from "./AddressPanel";
import DebugPanel from "./DebugPanel";
import DonorPanel from "./DonorPanel";
import {AddressView, DonorView} from "../../../types/donation-receipts";
import {useDonationReceiptContext} from "../../common/Layout/DonationReceiptContext";
import {useRouter} from 'next/router';
import {useUserProps} from "../../common/Layout/UserPropsContext";
import {useEffect} from "react";

/**
 * This page renders a single donation receipt for either verification, download, or issuance.
 * 3 different cases have to be handled:
 * 1. The is accessed via a direct URL with the query parameters `dtn`, `challenge`, and `year`.
 *    In this case, the receipt is fetched from the server and displayed for verification.
 * 2. The user navigates from the donation receipts page by selecting a receipt to verify.
 *    In this case, the receipt data is already present in the context.
 * 3. The user navigates from the donation receipts page by selecting a receipt to issue.
 *    In this case, the receipt data is already present in the context.
 *
 * Detection of the cases:
 * 1. state.operation is empty and the query parameters `dtn`, `challenge`, and `year` are present in the URL.
 * 2. state.operation is 'verify'
 * 3. state.operation is 'issue'
 */
const DonorUpdate = () => {

    const {user} = useUserProps();
    const {state, updateContext} = useDonationReceiptContext();
    const router = useRouter();

    const donor: DonorView = {
        name: user?.type === 'individual'
            ? user?.firstname + ' ' + user?.lastname
            : user?.name || null,
        tin: user?.tin || null,
        type: user?.type || null,
    }

    const transformAddress = (address: any) => {
        return {
            guid: address.id || null,
            address1: address.address || '',
            address2: address.address2 || '',
            city: address.city || '',
            zipCode: address.zipCode || '',
            country: address.country || '',
        };
    }
    const primaryAddress = user?.addresses.find((address) => address.type === 'primary');
    const address: AddressView = transformAddress(primaryAddress);

    const addresses = user?.addresses.map((address) => transformAddress(address)) || [];

    const initPage = () => {
        updateContext({
            donor,
            address,
        });
    }

    useEffect(() => {
        console.log('useEffect triggered');
        initPage();
    }, []);

    const selectAddress = (guid: string | null) => async () => {
        const selectedAddress = user?.addresses.find((addr) => addr.id === guid);
        console.log('Found address:', guid);
        console.log('selected address', selectedAddress)
        if (selectedAddress) {
            updateContext({
                address: {
                    guid: selectedAddress.id || null,
                    address1: selectedAddress.address || '',
                    address2: selectedAddress.address2 || '',
                    city: selectedAddress.city || '',
                    zipCode: selectedAddress.zipCode || '',
                    country: selectedAddress.country || '',
                },
            });
        }
    };

    const returnToReceipt = async () => {
        updateContext({operation: 'issue'}); // Set operation to 'issue' for testing
        try {
            await router.push(state.operation === 'issue'
                ? `/profile/donation-receipts/issue`
                : `/profile/donation-receipts/${state.dtn}`
            );
        } catch (error) {
            console.error('Error verifying receipt:', error);
        }
    }

    console.log('Inside DonorUpdate, state:', state);

    const buttonStyle = {
        backgroundColor: '#007BFF', color: 'white', padding: '10px 20px', border: 'none',
        borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginLeft: '10px',
    };
    const panelStyle = {
        backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '20px',
    };

    const headerStyle = {marginBottom: '10px', color: '#555', fontWeight: 'bold'};

    return (
        <div style={{marginTop: '50px', fontFamily: 'Arial, sans-serif', padding: '20px'}}>
            <h1 style={{textAlign: 'center', color: '#333', fontWeight: 'bold'}}>Donor Information</h1>

            <div style={panelStyle}>
                <h2 style={headerStyle}>Donor</h2>
                <DonorPanel {...state.donor} />
            </div>

            <div style={panelStyle}>
                <h2 style={headerStyle}>Addresses</h2>
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                        }}
                    >
                        <div style={{flex: 1}}>
                            <AddressPanel {...address} />
                        </div>
                        <div>
                            <button
                                style={buttonStyle}
                                onClick={selectAddress(address.id)}
                            >
                                Select this address
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {!state.isVerified && (
                <div style={{textAlign: 'center'}}>
                    <button style={buttonStyle} onClick={returnToReceipt}>
                        Return to Receipt
                    </button>
                </div>
            )}

            {state.downloadUrl && (
                <button
                    style={buttonStyle}
                    onClick={() => window.open(state.downloadUrl as string, '_blank')}
                >
                    Download
                </button>
            )}

            <DebugPanel data={state}/>
        </div>
    );
};

export default DonorUpdate;

// src/features/user/DonationReceipts/DonationList.tsx
import React from 'react';
import type {AddressView} from "../../../types/donation-receipts";

const AddressPanel: React.FC<AddressView> = ({
                                             address1,
                                             address2,
                                             zipCode,
                                             city,
                                             country
                                         }) => {
    return (
        <div>
            <div>{address1}{address2}</div>
            <div>{zipCode} {city}</div>
            <div>{country}</div>
        </div>
    );
};

export default AddressPanel;

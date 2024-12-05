// src/features/user/DonationReceipts/DonationList.tsx
import React from 'react';
import type {DonorView} from "../../../types/donation-receipts";

const DonorPanel: React.FC<DonorView> = (donor) => {
    return (
        <div>
            <div>{donor.name}</div>
            <div>{donor.tin}</div>
        </div>
    );
};

export default DonorPanel;

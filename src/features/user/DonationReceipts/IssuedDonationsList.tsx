import React from 'react';
import type {IssuedDonationView} from "../../../types/donation-receipts";

interface DonationListProps {
    donations: IssuedDonationView[] | null;
}

const IssuedDonationsList: React.FC<DonationListProps> = ({donations}) => {
    const cellStyle = {border: '1px solid #ddd', padding: '8px'};

    if (!donations) {
        return <p>No donations available.</p>;
    }

    return (
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px'}}>
            <thead>
            <tr>
                <th style={cellStyle}>Reference</th>
                <th style={cellStyle}>Amount</th>
                <th style={cellStyle}>Currency</th>
                <th style={cellStyle}>Payment Date</th>
            </tr>
            </thead>
            <tbody>
            {donations.map((donation, index) => (
                <tr key={index}>
                    <td style={cellStyle}>{donation.reference}</td>
                    <td style={cellStyle}>{donation.amount.toFixed(2)}</td>
                    <td style={cellStyle}>{donation.currency}</td>
                    <td style={cellStyle}>{donation.paymentDate}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default IssuedDonationsList;

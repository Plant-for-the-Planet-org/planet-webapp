import React from 'react';
import type {IssuedDonationReceiptApi} from '../../../types/donation-receipts';

interface IssuedReceiptsListProps {
    receipts: IssuedDonationReceiptApi[];
    onVerify: (receipt: IssuedDonationReceiptApi) => void;
}

const IssuedReceiptsList: React.FC<IssuedReceiptsListProps> = ({receipts, onVerify}) => {

    const cellStyle = {border: '1px solid #ddd', padding: '8px'};

    return (
        <div>
            {receipts.length > 0 ? (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                    <tr>
                        <th style={cellStyle}>Reference</th>
                        <th style={cellStyle}>Donation Count</th>
                        <th style={cellStyle}>Year</th>
                        <th style={cellStyle}>Country</th>
                        <th style={cellStyle}>Amount</th>
                        <th style={cellStyle}>Currency</th>
                        <th style={cellStyle}>Payment Date</th>
                        <th style={cellStyle}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {receipts.map((receipt) => (
                        <tr key={receipt.dtn}>
                            <td style={cellStyle}>{receipt.reference}</td>
                            <td style={cellStyle}>{receipt.donationCount}</td>
                            <td style={cellStyle}>{receipt.year}</td>
                            <td style={cellStyle}>{receipt.country}</td>
                            <td style={cellStyle}>{receipt.amount}</td>
                            <td style={cellStyle}>{receipt.currency}</td>
                            <td style={cellStyle}>{new Date(receipt.paymentDate).toLocaleDateString()}</td>
                            <td>
                                {receipt.verificationDate ? (
                                    <a
                                        href={receipt.downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: 'white',
                                            backgroundColor: '#007BFF',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Download
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => onVerify(receipt)}
                                        style={{
                                            backgroundColor: '#28A745',
                                            color: 'white',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Verify
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No issued donation receipts found.</p>
            )}
        </div>
    );
};

export default IssuedReceiptsList;

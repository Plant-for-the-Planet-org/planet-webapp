import React, { ReactElement } from 'react'
import styles from '../styles/AccountNavbar.module.scss'



function treeDonationHistory(props: any) {
    return (

        <div className={styles.historyContainer}>
            <div className={styles.filterRow}>
                {props.paymentHistory.items.map(history =>
                <>
                <div className={styles.singleRow}>
                <div className={styles.captionDate}>
                        <p className={styles.caption}>
                            {history.caption} Trees Donation
                        </p>
                        <p>
                            {history.created}
                    </p>
                    </div>
                    
                    <div className={styles.amtStatus}>
                        <div className={styles.moneyCurr}>
                            <p>{history.currency}</p>
                            <p>{history.amount}</p>
                        </div>
                        {history.status}
                    </div>
                </div>
                <div className={styles.secondRow}>
                    <div className={styles.project}>
                        <p className={styles.projectText}>Project</p>
                        {/* <p className={styles.projectName}>{history.details.project.text}</p> */}
                    </div>

                    <div className={styles.project}>
                        <p className={styles.projectText}>By</p>
                        <p className={styles.dataText}>Some Numeric Number</p>
                    </div>

                    <div className={styles.project}>
                        <p className={styles.projectText}>To</p>
                        <p className={styles.dataText}>Recipent Name</p>
                    </div>
                </div>

                <div className={styles.secondRow}>
                    <div className={styles.project}>
                        <p className={styles.projectText}>Donation ID</p>
                        <p className={styles.projectName}>{history.reference}</p>
                    </div>

                    <div className={styles.project}>
                        <p className={styles.projectText}>Paid Date</p>
                        <p className={styles.dataText}>{history.created}</p>
                    </div>

                    <div className={styles.project}>
                        <p className={styles.projectText}>Payment</p>
                        {/* <p className={styles.dataText}>{history.details.provider.text}</p> */}
                    </div>
                </div>

                <div className={styles.secondRow}>
                    <div className={styles.project}>
                        <p className={styles.projectText}>Cost Per Tree</p>
                        {/* <p className={styles.projectName}>{history.details.treeCost.text}</p> */}
                    </div>

                    <div className={styles.project}>
                        <p className={styles.projectText}>Donation Amount</p>
                        {/* <p className={styles.dataText}>{history.details.amount.text}</p> */}
                    </div>

                    <div className={styles.project}>
                        <p className={styles.projectText}>Refund Amount</p>
                        <p className={styles.dataText}>null</p>
                    </div>
                </div>

                <div className={styles.secondRow}>
                    <div className={styles.project}>
                        <p className={styles.projectText}>Tax Deductible</p>
                        <p className={styles.projectName}>None</p>
                    </div>

                    <div className={styles.project}>
                        <p className={styles.projectText}>Type</p>
                        <p className={styles.dataText}>On Behalf Gift</p>
                    </div>

                    <div className={styles.project}>
                        <p className={styles.projectText}>Txn Free</p>
                        <p className={styles.dataText}>0.0</p>
                    </div>
                </div>
                
                    
                </>
                )}
            </div>
            
        </div>
    )
}

export default treeDonationHistory

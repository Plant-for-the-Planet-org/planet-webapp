import React, { ReactElement } from 'react'
import styles from './../../styles/ProjectDetails.module.scss'

interface Props {
    financialReports:Array<{
        id: number;
        year: number;
        cost: string;
        linkReport: string;
    }> 
}

function FinancialReports({financialReports}: Props): ReactElement {
    return (
        <div className={styles.projectMoreInfo}>
            <div className={styles.infoTitle}>
                Project spending & Financial Reports
            </div>
            {financialReports.map(report=> (
                <div key={report.id} className={styles.infoText}>
                    {report.year}
                    <span>{report.cost}</span>
                    <div className={styles.infoTextButton}>
                        Report
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FinancialReports

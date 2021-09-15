import React, { ReactElement } from 'react'
import styles from './Import.module.scss'

interface Props {
    
}

export default function ImportData({}: Props): ReactElement {
    return (
        <div className={styles.profilePage}>
            <div className={styles.pageContainer}>
            <div className={styles.listContainer}>
                <div className={styles.pageTitle}>Import Data</div>
                <p>You can import kml, csv and other files to TreeMapper.... (only available on web) type: `external` not off-site</p>
            </div>
            </div>
            </div>
    )
}

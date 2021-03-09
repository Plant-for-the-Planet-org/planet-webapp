import React, { ReactElement } from 'react'
import styles from '../styles/AccountNavbar.module.scss'


function FilterBlock(props: any) {
    return (

        <div className={styles.filterContainer}>
            <div className={styles.filterRow}>
                {props.paymentHistory.items.map(item =>
                <>
                <div className={styles.singleRow}>
                <div className={styles.captionDate}>
                        <p className={styles.caption}>
                            {item.caption}
                        </p>
                        <p>
                            {item.created}
                        </p>
                    </div>
                    
                    <div className={styles.filterText}>
                        {item.status}
                    </div>
                </div>
                    
                </>
                )}
            </div>
            
        </div>
        
        
    )
}

export default FilterBlock

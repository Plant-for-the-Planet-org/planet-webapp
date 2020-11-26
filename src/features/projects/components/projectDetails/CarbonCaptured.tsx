import React, { ReactElement } from 'react'
import styles from './../../styles/ProjectDetails.module.scss'

interface Props {
    co2:Array<{
        id: number;
        icon: JSX.Element;
        count: number;
        text: string;
    }> 
}

function CarbonCaptured({co2}: Props): ReactElement {
    return (
        <div className={styles.projectMoreInfo}>
            <div className={styles.infoTitle}>
                22,540 tons captured is equal to
            </div>
                {co2.map(co2 =>(
                    <div key={co2.id}>
                            <div className={styles.infoText}>
                                {co2.icon}
                                <span style={{marginLeft:'20px'}}>{co2.count}</span>
                                <span style={{marginLeft:'20px',flexGrow:1}}>{co2.text}</span>
                            </div>
                        </div>
                ))}
        </div> 
    )
}

export default CarbonCaptured

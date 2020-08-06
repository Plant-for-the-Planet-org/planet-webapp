import React, { ReactElement } from 'react'
import styles from './../../styles/ProjectDetails.module.scss'

interface Props {
    infoProperties:Array<{
        id: number;
        title: string;
        value: string;
    }> 
}

function ProjectInfo({infoProperties}: Props): ReactElement {
    return (
        <div>
            {infoProperties.map(info => (
                <div key={info.id} className={styles.projectMoreInfoHalf}>
                    <div className={styles.infoTitle}>
                        {info.title}
                    </div>
                    <div className={styles.infoText}>
                    {info.value}
                    </div>
                </div>
            ))}
            <div className={styles.projectMoreInfo}>
                <div className={styles.infoTitle}>
                Land ownership
                </div>
                <div className={styles.infoText}>
                Global Forest Generation Limited since 2008
                </div>
            </div>


            <div className={styles.projectMoreInfo}>
                <div className={styles.infoTitle}>
                Why this site?
                </div>
                <div className={styles.infoText}>
                The Sian Khan reserve is a biodiversity
                hotspot and requires restoration after
                deforestation for palm plantation.
                </div>
            </div>

            <div className={styles.projectMoreInfo}>
                <div className={styles.infoTitle}>
                    External certifications
                </div>
                <div className={styles.infoText}>
                    Gold Standard
                    <div className={styles.infoTextButton}>
                        View
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProjectInfo

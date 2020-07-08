import React, { ReactElement } from 'react'
import styles from './../styles/Projects.module.css'

interface Props {
    
}

export default function ProjectSnippet({}: Props): ReactElement {
    return (
        <div className={styles.singleProject}>
                    <div className={styles.projectImage}>
                        <div className={styles.projectType}>
                            Tree Planting
                        </div>
                        <div className={styles.projectName}>
                            Acción Andina
                        </div>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressBarHighlight} />
                    </div>
                    <div className={styles.projectInfo}>
                        <div className={styles.projectData}>
                            <div className={styles.targetLocation}>
                                <div className={styles.target}>
                                    102K planted •
                                </div>
                                <div className={styles.location}>
                                    Chile
                                </div>   
                            </div>
                            <div className={styles.projectTPOName}>
                                By Global Forest Generation
                            </div>
                        </div>
                        <div className={styles.projectCost}>
                            <div className={styles.costButton}>
                                    $1.78
                            </div>
                            <div className={styles.perTree}>
                                per tree
                            </div>
                        </div>
                    </div>
                </div>
    )
}

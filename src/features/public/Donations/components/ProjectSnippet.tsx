import React, { ReactElement } from 'react'
import styles from './../styles/Projects.module.scss'

interface Props {
    project:any
}

export default function ProjectSnippet({project}: Props): ReactElement {
    return (
        <div className={styles.singleProject}>
                    <div className={styles.projectImage}>
                        <div className={styles.projectType}>
                            Tree Planting
                        </div>
                        <div className={styles.projectName}>
                            {project.properties.name}
                        </div>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressBarHighlight} />
                    </div>
                    <div className={styles.projectInfo}>
                        <div className={styles.projectData}>
                            <div className={styles.targetLocation}>
                                <div className={styles.target}>
                                    {project.properties.countPlanted} planted •
                                </div>
                                <div className={styles.location}>
                                    Chile
                                </div>   
                            </div>
                            <div className={styles.projectTPOName}>
                                By {project.properties.tpoName}
                            </div>
                        </div>
                        <div className={styles.projectCost}>
                            <div className={styles.costButton}>
                                    $ {project.properties.treeCost}
                            </div>
                            <div className={styles.perTree}>
                                per tree
                            </div>
                        </div>
                    </div>
                </div>
    )
}

import React, { ReactElement } from 'react'
import styles from './../styles/Projects.module.scss'
import { getImageUrl } from '../../../../utils/getImageURL'

interface Props {
    project:any
}

export default function ProjectSnippet({project}: Props): ReactElement {
    console.log(project.properties.image);
    return (
        <div className={styles.singleProject}>
                    <div className={styles.projectImage}>
                      { project.properties.image ?
                        <img className={styles.projectImageFile} src={getImageUrl('project', 'large',project.properties.image)} />
                        : null }
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
                            {project.properties.treeCost ? (
                                <>
                                    <div className={styles.costButton}>
                                            {project.properties.currency === 'usd' ? '$' : project.properties.currency === 'eur' ? '€' : project.properties.currency} {project.properties.treeCost.toFixed(2)}
                                    </div>
                                    <div className={styles.perTree}>
                                        per tree
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
    )
}

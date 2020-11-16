import React, { ReactElement } from 'react'
import styles from './Stories.module.scss';

interface Props {
    
}

export default function Stories({}: Props): ReactElement {
    return (
        <div className={styles.container}>
            <div className={styles.storyCard}>
                <img src={'/tenants/planet/images/leaderboard/restoreTrees.svg'} />
                <div className={styles.storyContent}>
                    <h2>How do we restore a trillion trees?</h2>
                    <div>
                        <img src={'/tenants/planet/images/leaderboard/playIcon.svg'} />
                        <p>Watch Video</p>
                    </div>
                </div>
            </div>
            <div className={styles.storyCard}>
                <img src={'/tenants/planet/images/leaderboard/selectProjects.svg'} />
                <div className={styles.storyContent}>
                    <h2>How we select projects</h2>
                    <div>
                        <img src={'/tenants/planet/images/leaderboard/mapIcon.svg'} />
                        <p>Learn More</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

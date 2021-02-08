import React, { ReactElement } from 'react'
import AnimatedButton from '../../../../features/common/InputTypes/AnimatedButton'
import styles from './../styles/anilloverdegranada.module.scss'

interface Props {

}

function ProjectBy({ }: Props): ReactElement {
    return (
        <div className={styles.projectBySection}>
            <h2>A project by:</h2>
            <h1>Sat1 with Plant-for-the-Planet</h1>
            <div className={styles.sustainableButtonContainer}>
                <a target="_blank" rel="noopener noreferrer" href="http://planetspain.org/">
                    <AnimatedButton className={styles.secondaryButton}>
                        CONÓCENOS
                    </AnimatedButton>
                </a>
            </div>
        </div>
    )
}

export default ProjectBy

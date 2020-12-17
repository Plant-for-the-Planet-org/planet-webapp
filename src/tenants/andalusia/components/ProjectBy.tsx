import React, { ReactElement } from 'react'
import AnimatedButton from '../../../features/common/InputTypes/AnimatedButton'
import styles from './../styles/anilloverdegranada.module.scss'

interface Props {
    
}

function ProjectBy({}: Props): ReactElement {
    return (
        <div className={styles.projectBySection}>
            <h2>Un proyecto impulsado por:</h2>
            <h1>Plant-for-the-Planet-Spain</h1>
            <div className={styles.sustainableButtonContainer}>
                <AnimatedButton className={styles.secondaryButton}>
                    CONÓCENOS
                </AnimatedButton>
            </div>
        </div>
    )
}

export default ProjectBy

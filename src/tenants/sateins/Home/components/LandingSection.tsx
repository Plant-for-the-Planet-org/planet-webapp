import AnimatedButton from '../../../../features/common/InputTypes/AnimatedButton'
import TreeCounterSection from './TreeCounter'
import styles from './../styles/anilloverdegranada.module.scss'

export default function LandingSection(props: any) {
    return (
        <div className={styles.landingSection}>

            <div className={styles.landingTextSection}>
                <h2>
                    <span>{props.LandingSectionData.mainTitleSubText}</span>
                </h2>
                <p>
                    {props.LandingSectionData.para}
                </p>
                <div className={styles.landingButtonContainer}>
                    <AnimatedButton onClick={() => props.handleOpen()} className={styles.continueButton}>
                        Jetzt Bäume pflanzen
                    </AnimatedButton>
                    {/* <AnimatedButton onClick={() => props.handleViewProject()} className={styles.secondaryButton} style={{ marginLeft: '24px' }}>
                        Ver Proyecto {'>'}
                    </AnimatedButton> */}
                </div>
            </div>
            <div className={styles.landingImageSection}>
                <TreeCounterSection tenantScore={props.tenantScore} />
            </div>

        </div>
    )
}
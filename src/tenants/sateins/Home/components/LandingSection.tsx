import AnimatedButton from '../../../../features/common/InputTypes/AnimatedButton'
import TreeCounterSection from './TreeCounter'
import styles from './../styles/sateins.module.scss'

export default function LandingSection(props: any) {
    
    return (
        <div className={styles.landingSection}>
            {/* <div className={styles.landingSectionOverlay}></div> */}

            <div className={styles.landingContent}>

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
                {props.tenantScore && props.tenantScore.total && (
                    <div className={styles.landingImageSection}>
                        <TreeCounterSection tenantScore={props.tenantScore} />
                    </div>
                )}
            </div>


        </div>
    )
}
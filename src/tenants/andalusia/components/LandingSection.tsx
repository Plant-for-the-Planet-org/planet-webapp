import AnimatedButton from '../../../features/common/InputTypes/AnimatedButton'
import styles from './../styles/anilloverdegranada.module.scss'

export default function LandingSection(props:any) {
    return (
        <div className={styles.landingSection}>
            <div className={styles.landingTextSection}>
                <h2>
                    {props.LandingSectionData.mainTitleText} <br />
                    <span>{props.LandingSectionData.mainTitleSubText}</span>
                </h2>
                <p>
                    {props.LandingSectionData.para}
                </p>
                <div className={styles.landingButtonContainer}>
                    <AnimatedButton onClick={()=>props.handleOpen()} className={styles.continueButton}>
                        Plantar árboles
                    </AnimatedButton>
                </div>
            </div>
            <div className={styles.landingImageSection}>
                <img src={props.LandingSectionData.imagePath} />
            </div>

        </div>
    )
}
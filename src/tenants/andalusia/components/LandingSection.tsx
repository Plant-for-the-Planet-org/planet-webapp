import AnimatedButton from '../../../features/common/InputTypes/AnimatedButton'
import styles from './../styles/anilloverdegranada.module.scss'

export default function LandingSection() {
    return (
        <div className={styles.landingSection}>
            <div className={styles.landingTextSection}>
                <h2>
                    200.000 árboles para Granada, <br />
                    <span>1 Billón para el planeta.</span>
                </h2>
                <p>
                    <b>Plant-for-the-Planet</b>  propuso al Ayuntamiento de Granada en 2019 desarrollar el proyecto "Anillo verde de Granada" para crear un anillo natural reforestado que rodeará la ciudad.
                </p>
                <div className={styles.landingButtonContainer}>
                    <AnimatedButton className={styles.continueButton}>
                        Plantar árboles
                    </AnimatedButton>
                </div>
            </div>
            <div className={styles.landingImageSection}>
                <img src="/tenants/andalusia/images/alhambra.jpg" />
            </div>

        </div>
    )
}
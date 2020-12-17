import AnimatedButton from '../../../features/common/InputTypes/AnimatedButton'
import styles from './../styles/anilloverdegranada.module.scss'

export default function SustainableCity() {
    return (
        <div className={styles.sustainableSection}>
            <div className={styles.sustainableTextSection}>
                <h2>Si amas Granada...</h2>
                <p>
                    <b>Plant-for-the-Planet</b>  propuso al Ayuntamiento de Granada en 2019 desarrollar el proyecto "Anillo verde de Granada" para crear un anillo natural reforestado que rodeará la ciudad.
                </p>
                <div className={styles.sustainableButtonContainer}>
                    <AnimatedButton className={styles.continueButton}>
                        Plantar árboles
                    </AnimatedButton>
                </div>
            </div>
            <div className={styles.sustainableImageSection}>
                <img src="/tenants/andalusia/images/sustainableCity.jpg" />
            </div>

        </div>
    )
}
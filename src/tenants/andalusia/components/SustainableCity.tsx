import AnimatedButton from '../../../features/common/InputTypes/AnimatedButton'
import styles from './../styles/anilloverdegranada.module.scss'

export default function SustainableCity() {
    return (
        <div className={styles.sustainableSection}>
            <div className={styles.sustainableTextSection}>
                <h2>Si amas Granada...</h2>
                <h3>Si deseas formar parte de su presente y futuro...</h3>
                <h3 style={{color:'#568802'}}>Si quieres ayudar a crear una ciudad más verde y sostenible</h3>
                
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
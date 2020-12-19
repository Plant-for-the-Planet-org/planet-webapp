import AnimatedButton from '../../../features/common/InputTypes/AnimatedButton'
import styles from './../styles/anilloverdegranada.module.scss'

export default function SustainableCity(props:any) {
    return (
        <div className={styles.sustainableSection}>
            <div className={styles.sustainableTextSection}>
                {props.SustainableCityData.sustainableText}
                
                <div className={styles.sustainableButtonContainer}>
                    <AnimatedButton onClick={()=>props.handleOpen()} className={styles.continueButton}>
                        Plantar árboles
                    </AnimatedButton>
                </div>
            </div>
            <div className={styles.sustainableImageSection}>
                <img src={props.SustainableCityData.imagePath} />
            </div>

        </div>
    )
}
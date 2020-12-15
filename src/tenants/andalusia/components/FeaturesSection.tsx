import styles from './../styles/anilloverdegranada.module.scss'

export default function FeaturesSection(){
    return(
        <div className={styles.featuresMainContainer}>
            <div className={styles.featuresContainerText}>
                <div>
                    <span>Un pulmón para una de las ciudades más bellas de España</span>
                    <h2>El Anillo verde de Granada</h2>
                
                    <p>En aras de reverdecer la ciudad de la Alhambra, este proyecto pretende crear un nuevo ecosistema formado por especies autóctonas.</p>
                    <p>Dicho ecosistema se llevará a cabo mediante la restauración de bosques y otros paisajes en una superficie aproximada de 800 hectáreas por un periodo de al menos 50 años, garantizando su exención de venta o explotación comercial y protegidas durante ese período.</p>
                    <p>La creación de este Anillo verde persigue, por un lado, mitigar el calentamiento global y, por otro, velar por la salud de las generaciones actuales y futuras, a través de la mejora de la calidad del aire, la promoción de la actividad física o los diversos beneficios para el sistema inmunológico y el metabolismo.</p>
                    <p>El proyecto se dividirá en varias etapas desde este año 2020 hasta 2030. </p>

                </div>
            </div>
            <div className={styles.featuresSection}>

            </div>
        </div>
    )
}
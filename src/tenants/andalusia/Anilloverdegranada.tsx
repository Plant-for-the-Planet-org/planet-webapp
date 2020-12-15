import React, { ReactElement } from 'react'
import AnimatedButton from '../../features/common/InputTypes/AnimatedButton'
import styles from './styles/common.module.scss'

interface Props {

}

function Anilloverdegranada({ }: Props): ReactElement {
    return (
        <div>
            <LandingSection />
            <Section2 />
            <FeaturesSection/>
            <DonateSection/>
        </div>
    )
}

function LandingSection() {
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

function Section2() {
    return (
        <div className={styles.section2MainContainer}>
            <div className={styles.section2Overlay}/>
            <p>OBJETIVO (2020-2030)  - 200.000 ÁRBOLES</p>
            <h2>Stop Talking, Start Planting </h2>
            <span>Fase inicial (2020-2021) 6.500 árboles.</span>

        </div>
    )
}

function FeaturesSection(){
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

function DonateSection(){
    return(
        <div className={styles.donateSectionMainContainer}>
            <img src="/tenants/andalusia/images/donateSection.jpg" />
        </div>
    )
}
export default Anilloverdegranada

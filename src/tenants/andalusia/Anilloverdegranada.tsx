import React, { ReactElement } from 'react'
import Footer from '../../features/common/Layout/Footer'
import FeaturesSection from './components/FeaturesSection'
import LandingSection from './components/LandingSection'
import Objective from './components/Objective'
import SustainableCity from './components/SustainableCity'
import styles from './styles/anilloverdegranada.module.scss'

interface Props {

}

function Anilloverdegranada({ }: Props): ReactElement {
    return (
        <div className={styles.pageContainer}>
            <LandingSection />
            <Objective />
            <FeaturesSection/>
            <SustainableCity/>
            <Footer/>
        </div>
    )
}


export default Anilloverdegranada
